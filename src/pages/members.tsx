import { Members } from '@/components'
import { PaddedLayout } from 'src/layouts'
import { InferGetServerSidePropsType } from 'next'

import faunadb from 'faunadb'
const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

export default function MembersPage({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log({ users })
  return (
    <>
      <Members users={users} />
    </>
  )
}

MembersPage.layoutProps = {
  meta: {
    title: 'Members',
  },
  Layout: PaddedLayout,
}

export type User = Partial<{
  id: string
  username: string
  name: string
  email: string
  image: string
}>

export const getServerSideProps = async () => {
  const response: any = await client.query(
    q.Map(q.Paginate(q.Documents(q.Collection('users'))), (userRef) => {
      const user = q.Get(userRef)
      return {
        id: q.Select(['ref', 'id'], user),
        name: q.Select(['data', 'name'], user),
        username: q.Select(['data', 'username'], user),
        email: q.Select(['data', 'email'], user),
        image: q.Select(['data', 'image'], user),
      }
    })
  )
  let users: User[] = response.data
  users = users.map((user) => {
    if (typeof user.email === 'object') {
      user.email = null
    }
    if (typeof user.username === 'object') {
      user.username = null
    }
    return user
  })
  return {
    props: {
      users,
    },
  }
}
