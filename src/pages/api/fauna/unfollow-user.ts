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

  try {
    const { userId } = req.body

    const dbUserFollower = q.Get(
      q.Match(q.Index('user_follower_by_user_and_follower'), [
        q.Ref(q.Collection('users'), userId),
        q.Ref(q.Collection('users'), (session.user as User).id),
      ])
    )

    const id = q.Select(['ref', 'id'], dbUserFollower)
    const response = await client.query(
      q.Delete(q.Ref(q.Collection('user_followers'), id))
    )

    res.status(200).json({ response })
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
