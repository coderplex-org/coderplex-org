import { delay } from './../../../utils/index'
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
      q.Do(
        q.Let(
          {
            ref: q.Match(q.Index('unique_user_and_follower'), [
              q.Ref(q.Collection('users'), userId),
              q.Ref(q.Collection('users'), followerId),
            ]),
          },
          q.If(
            q.Exists(q.Var('ref')),
            q.Update(
              q.Ref(
                q.Collection('user_followers'),
                q.Select(['ref', 'id'], q.Get(q.Var('ref')))
              ),
              {
                data: {
                  isFollowing: q.Not(
                    q.Select(['data', 'isFollowing'], q.Get(q.Var('ref')))
                  ),
                  timestamps: {
                    updatedAt: q.Now(),
                  },
                },
              }
            ),
            q.Create(q.Collection('user_followers'), {
              data: {
                user: q.Ref(q.Collection('users'), userId),
                follower: q.Ref(q.Collection('users'), followerId),
                isFollowing: true,
                timestamps: {
                  createdAt: q.Now(),
                  updatedAt: q.Now(),
                },
              },
            })
          )
        )
      )
    )

    await client.query(
      q.Let(
        {
          activityDoc: q.Create(q.Collection('activities'), {
            data: {
              user: q.Ref(q.Collection('users'), followerId),
              // user_follower_ref
              resource: q.Ref(q.Collection('user_followers'), response.ref.id),
              type: response.data.isFollowing ? 'FOLLOWED' : 'UNFOLLOWED',
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          }),
          notificationDoc: q.If(
            q.Equals(
              q.Select(['data', 'type'], q.Var('activityDoc')),
              'FOLLOWED'
            ),
            q.Create(q.Collection('notifications'), {
              data: {
                user: q.Ref(q.Collection('users'), userId),
                activity: q.Ref(
                  q.Collection('activities'),
                  q.Select(['ref', 'id'], q.Var('activityDoc'))
                ),
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
    console.error({ msg1: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
