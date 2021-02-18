import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import faunadb from 'faunadb'
import { User } from 'src/pages/members'
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
  try {
    const response: any = await client.query(
      q.Map(q.Paginate(q.Documents(q.Collection('users'))), (userRef) => {
        const user = q.Get(userRef)
        return {
          id: q.Select(['ref', 'id'], user),
          name: q.Select(['data', 'name'], user, null),
          username: q.Select(['data', 'username'], user, null),
          image: q.Select(['data', 'image'], user, null),
          account: {
            firstName: q.Select(['data', 'account', 'firstName'], user, null),
          },
          socials: q.Select(['data', 'socials'], user, null),
        }
      })
    )
    const users: User[] = response.data

    res.status(200).json({ users })
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
