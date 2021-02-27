import { getUserFromUserRef } from 'src/utils/fauna'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import faunadb from 'faunadb'
import { User } from 'src/pages/members'
import { getSession } from 'next-auth/client'
const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

const FaunaCreateHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({ req })

  try {
    const response: any = await client.query(
      q.Map(q.Paginate(q.Documents(q.Collection('users'))), (userRef) => {
        return getUserFromUserRef({ ref: userRef, session })
      })
    )
    const users: User[] = response.data

    res.status(200).json({ users })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
