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
  const { updateId, description } = req.body
  const userId = (session.user as User).id

  try {
    const response: any = await client.query(
      q.Create(q.Collection('update_comments'), {
        data: {
          postedBy: q.Ref(q.Collection('users'), userId),
          update: q.Ref(q.Collection('goal_updates'), updateId),
          description,
          timestamps: {
            createdAt: q.Now(),
            updatedAt: q.Now(),
          },
        },
      })
    )
    await client.query(
      q.Let(
        {
          activityDoc: q.Create(q.Collection('activities'), {
            data: {
              user: q.Ref(q.Collection('users'), userId),
              resource: q.Ref(q.Collection('update_comments'), response.ref.id),
              type: 'COMMENTED_ON_UPDATE',
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          }),
          notificationDoc: q.Create(q.Collection('notifications'), {
            data: {
              user: q.Select(
                ['data', 'postedBy'],
                q.Get(q.Ref(q.Collection('goal_updates'), updateId))
              ),
              activity: q.Ref(
                q.Collection('activities'),
                q.Select(['ref', 'id'], q.Var('activityDoc'))
              ),
              isRead: false,
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          }),
        },
        {}
      )
    )
    res.status(201).json({ response })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
