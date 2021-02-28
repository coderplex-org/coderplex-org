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
    const ref = q.Match(q.Index('notification_status_by_user'), userRef)
    const response = await client.query(
      q.If(
        q.Exists(ref),
        q.Update(q.Select(['ref'], q.Get(ref)), {
          data: {
            count: q.Count(
              q.Match(
                q.Index('all_notifications_by_user'),
                q.Ref(q.Collection('users'), userId)
              )
            ),
            timestamps: {
              updatedAt: q.Now(),
            },
          },
        }),
        q.Create(q.Collection('notification_statuses'), {
          data: {
            user: userRef,
            count: q.Count(
              q.Match(
                q.Index('all_notifications_by_user'),
                q.Ref(q.Collection('users'), userId)
              )
            ),
            timestamps: {
              createdAt: q.Now(),
              updatedAt: q.Now(),
            },
          },
        })
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
