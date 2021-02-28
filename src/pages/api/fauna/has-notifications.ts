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
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = (session.user as User).id
  const userRef = q.Ref(q.Collection('users'), userId)
  try {
    const response = await client.query(
      q.If(
        q.Exists(q.Match(q.Index('notification_status_by_user'), userRef)),
        q.Subtract(
          q.Count(q.Match(q.Index('all_notifications_by_user'), userRef)),
          q.Select(
            ['data', 'count'],
            q.Get(q.Match(q.Index('notification_status_by_user'), userRef)),
            0
          )
        ),
        q.Count(
          q.Match(
            q.Index('all_notifications_by_user'),
            q.Ref(q.Collection('users'), userId)
          )
        )
      )
    )
    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
