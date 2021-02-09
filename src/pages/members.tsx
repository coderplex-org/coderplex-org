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
  account: Partial<{
    firstName: string
    lastName: string
    bio: string
  }>
  socials: Partial<{
    github: string
    facebook: string
    twitter: string
    linkedin: string
    codepen: string
    discord: string
    blog: string
  }>
  otherDetails: Partial<{
    userType: 'developer' | 'employer' | 'none'
    mobile: string
    isCurrentlyWorking: 'yes' | 'no' | 'none'
    lookingForWork: 'yes' | 'no' | 'none'
    company: string
    technologiesFamiliarWith: string[]
  }>
}>

export const getServerSideProps = async () => {
  const response: any = await client.query(
    q.Map(q.Paginate(q.Documents(q.Collection('users'))), (userRef) => {
      const user = q.Get(userRef)
      return {
        id: q.Select(['ref', 'id'], user),
        name: q.Select(['data', 'name'], user, null),
        username: q.Select(['data', 'username'], user, null),
        email: q.Select(['data', 'email'], user, null),
        image: q.Select(['data', 'image'], user, null),
        account: q.Select(['data', 'account'], user, {}),
        socials: q.Select(['data', 'socials'], user, {}),
        otherDetails: q.Select(['data', 'otherDetails'], user, {}),
      }
    })
  )
  const users: User[] = response.data
  return {
    props: {
      users,
    },
  }
}
