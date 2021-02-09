import { User } from 'src/pages/members'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import faunadb from 'faunadb'
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

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const followerId = (session.user as User).id

  try {
    const { userId } = req.body

    const response: any = await client.query(
      q.Let(
        {
          userFollowerDoc: q.Create(q.Collection('user_followers'), {
            data: {
              user: q.Ref(q.Collection('users'), userId),
              follower: q.Ref(q.Collection('users'), followerId),
            },
          }),
        },
        {
          id: q.Select(['ref', 'id'], q.Var('userFollowerDoc')),
        }
      )
    )
    res.status(200).json(response)
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
