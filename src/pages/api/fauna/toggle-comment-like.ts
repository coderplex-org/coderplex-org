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

  const userId = (session.user as User).id

  try {
    const { commentId } = req.body
    const response: any = await client.query(
      q.Let(
        {
          ref: q.Match(q.Index('unique_comment_user_like'), [
            q.Ref(q.Collection('update_comments'), commentId),
            q.Ref(q.Collection('users'), userId),
          ]),
        },
        q.If(
          q.Exists(q.Var('ref')),
          q.Update(
            q.Ref(
              q.Collection('comment_likes'),
              q.Select(['ref', 'id'], q.Get(q.Var('ref')))
            ),
            {
              data: {
                liked: q.Not(q.Select(['data', 'liked'], q.Get(q.Var('ref')))),
                timestamps: {
                  updatedAt: q.Now(),
                },
              },
            }
          ),
          q.Create(q.Collection('comment_likes'), {
            data: {
              user: q.Ref(q.Collection('users'), userId),
              comment: q.Ref(q.Collection('update_comments'), commentId),
              liked: true,
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          })
        )
      )
    )
    await client.query(
      q.Let(
        {
          activityDoc: q.Create(q.Collection('activities'), {
            data: {
              user: q.Ref(q.Collection('users'), userId),
              resource: q.Ref(q.Collection('comment_likes'), response.ref.id),
              type: response.data.liked ? 'LIKED_COMMENT' : 'UNLIKED_COMMENT',
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
                'LIKED_COMMENT'
              ),
              q.Not(
                q.Equals(
                  q.Select(
                    ['data', 'postedBy', 'id'],
                    q.Get(q.Ref(q.Collection('update_comments'), commentId))
                  ),
                  q.Select(['data', 'user', 'id'], q.Var('activityDoc'))
                )
              )
            ),
            q.Create(q.Collection('notifications'), {
              data: {
                user: q.Select(
                  ['data', 'postedBy'],
                  q.Get(q.Ref(q.Collection('update_comments'), commentId))
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
    res.status(200).json({ response })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
