import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

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
  const session = await getSession({ req })

  if (!session) {
    return res.status(200).json({ isFollowing: false })
  }

  const followerId = (session.user as User).id

  try {
    const { userId } = req.body
    const response: any = await client.query(
      q.Let(
        {
          ref: q.Match(q.Index('unique_user_and_follower'), [
            q.Ref(q.Collection('users'), userId),
            q.Ref(q.Collection('users'), followerId),
          ]),
        },
        q.If(
          q.Exists(q.Var('ref')),
          q.Select(['data', 'isFollowing'], q.Get(q.Var('ref'))),
          false
        )
      )
    )

    res.status(200).json({ isFollowing: response })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
