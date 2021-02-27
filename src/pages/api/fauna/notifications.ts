import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import faunadb from 'faunadb'
import { User } from 'src/pages/members'
import { getUserFromUserRef } from 'src/utils/fauna'
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
    const response: any = await client.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('all_notifications_by_user'),
            q.Ref(q.Collection('users'), userId)
          )
        ),
        (notificationRef) => {
          const notificationDoc = q.Get(notificationRef)
          const activityDoc = q.Get(
            q.Select(['data', 'activity'], notificationDoc)
          )
          const type = q.Select(['data', 'type'], activityDoc)
          const docId = q.If(
            q.Or(q.Equals(type, 'FOLLOWED'), q.Equals(type, 'UNFOLLOWED')),
            q.Select(
              ['data', 'follower', 'id'],
              q.Get(q.Select(['data', 'resource'], activityDoc))
            ),
            q.If(
              q.Or(
                q.Equals(type, 'LIKED_UPDATE'),
                q.Equals(type, 'UNLIKED_UPDATE')
              ),
              q.Select(
                ['data', 'update', 'id'],
                q.Get(q.Select(['data', 'resource'], activityDoc))
              ),
              q.If(
                q.Or(
                  q.Equals(type, 'LIKED_COMMENT'),
                  q.Equals(type, 'UNLIKED_COMMENT')
                ),
                q.Select(
                  ['data', 'comment', 'id'],
                  q.Get(q.Select(['data', 'resource'], activityDoc))
                ),
                q.If(
                  q.Equals(type, 'COMMENTED_ON_UPDATE'),
                  q.Select(['data', 'resource', 'id'], activityDoc),
                  null
                )
              )
            )
          )
          return {
            id: q.Select(['ref', 'id'], activityDoc),
            user: getUserFromUserRef({
              ref: q.Select(['data', 'user'], activityDoc),
              session,
            }),
            type,
            createdAt: q.ToMillis(
              q.Select(['data', 'timestamps', 'createdAt'], activityDoc)
            ),
            // If type === 'FOLLOWED' | 'UNFOLLOWED', documentId = the id of the person who followed
            // If type === 'LIKED_UPDATE' | 'UNLIKED_UPDATE', documentId = the update that was liked
            // If type === 'LIKED_COMMENT' | 'UNLIKED_COMMENT', documentId = the comment that was liked
            // If type === 'COMMENTED_ON_UPDATE' , documentId = the new comment that was posted
            documentId: docId,
          }
        }
      )
    )
    res.status(201).json(response.data)
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
