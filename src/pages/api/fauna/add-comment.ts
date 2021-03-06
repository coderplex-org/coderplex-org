import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import faunadb from 'faunadb'
import { User } from 'src/pages/members'
import { getCommentFromCommentRef, getUserFromUserRef } from 'src/utils/fauna'
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
      q.Let(
        {
          commentDoc: q.Create(q.Collection('update_comments'), {
            data: {
              postedBy: q.Ref(q.Collection('users'), userId),
              update: q.Ref(q.Collection('goal_updates'), updateId),
              description,
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          }),
        },
        getCommentFromCommentRef({
          ref: q.Select(['ref'], q.Var('commentDoc')),
          session,
        })
      )
    )

    await client.query(
      q.Let(
        {
          activityDoc: q.Create(q.Collection('activities'), {
            data: {
              user: q.Ref(q.Collection('users'), userId),
              resource: q.Ref(q.Collection('update_comments'), response.id),
              type: 'COMMENTED_ON_UPDATE',
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          }),
          notificationDoc: q.If(
            q.And(
              q.Equals(
                q.Select(['data', 'type'], q.Var('activityDoc')),
                'COMMENTED_ON_UPDATE'
              ),
              q.Not(
                q.Equals(
                  q.Select(
                    ['data', 'postedBy', 'id'],
                    q.Get(q.Ref(q.Collection('goal_updates'), updateId))
                  ),
                  q.Select(['data', 'user', 'id'], q.Var('activityDoc'))
                )
              )
            ),
            q.Create(q.Collection('notifications'), {
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
            null
          ),
        },
        {}
      )
    )
    res.status(201).json(response)
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
