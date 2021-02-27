import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import faunadb from 'faunadb'
import { getSession } from 'next-auth/client'
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
  try {
    const response: any = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('all_recent_updates'))), (result) => {
        const goalUpdateRef = q.Select(1, result)
        const goalUpdateDoc = q.Get(goalUpdateRef)
        const goalDoc = q.Get(q.Select(['data', 'goal'], goalUpdateDoc))
        const postedByDoc = q.Get(q.Select(['data', 'postedBy'], goalUpdateDoc))
        const description = q.Select(['data', 'description'], goalUpdateDoc)

        const createdAt = q.ToMillis(
          q.Select(['data', 'timestamps', 'createdAt'], goalUpdateDoc)
        )
        const updateId = q.Select(['ref', 'id'], goalUpdateDoc)
        let hasLiked = false
        if (session) {
          const userId = (session.user as User).id
          const ref = q.Match(q.Index('unique_update_user_like'), [
            q.Ref(q.Collection('goal_updates'), updateId),
            q.Ref(q.Collection('users'), userId),
          ])
          hasLiked = q.If(
            q.Exists(ref),
            q.Select(['data', 'liked'], q.Get(ref)),
            false
          ) as boolean
        }
        return {
          id: updateId,
          goal: {
            id: q.Select(['ref', 'id'], goalDoc),
            title: q.Select(['data', 'title'], goalDoc),
          },
          comments: q.Map(
            q.Paginate(
              q.Match(q.Index('all_comments_by_update'), goalUpdateRef)
            ),
            (commentRef) => {
              const commentDoc = q.Get(commentRef)
              const postedByDoc = q.Get(
                q.Select(['data', 'postedBy'], commentDoc)
              )
              let hasLiked = false
              const commentId = q.Select(['ref', 'id'], commentDoc)
              if (session) {
                const userId = (session.user as User).id
                const ref = q.Match(q.Index('unique_comment_user_like'), [
                  q.Ref(q.Collection('update_comments'), commentId),
                  q.Ref(q.Collection('users'), userId),
                ])
                hasLiked = q.If(
                  q.Exists(ref),
                  q.Select(['data', 'liked'], q.Get(ref)),
                  false
                ) as boolean
              }
              return {
                id: commentId,
                description: q.Select(['data', 'description'], commentDoc),
                createdAt: q.ToMillis(
                  q.Select(['data', 'timestamps', 'createdAt'], commentDoc)
                ),
                hasLiked,
                likes: q.Count(
                  q.Filter(
                    q.Paginate(
                      q.Match(q.Index('all_likes_by_comment'), commentRef)
                    ),
                    (commentLikeRef) => {
                      return q.Select(['data', 'liked'], q.Get(commentLikeRef))
                    }
                  )
                ),
                postedBy: {
                  id: q.Select(['ref', 'id'], postedByDoc),
                  name: q.Select(['data', 'name'], postedByDoc, null),
                  image: q.Select(['data', 'image'], postedByDoc, null),
                  username: q.Select(['data', 'username'], postedByDoc, null),
                  account: {
                    firstName: q.Select(
                      ['data', 'account', 'firstName'],
                      postedByDoc,
                      null
                    ),
                  },
                },
              }
            }
          ),
          hasLiked,
          likes: q.Count(
            q.Filter(
              q.Paginate(
                q.Match(q.Index('all_likes_by_update'), goalUpdateRef)
              ),
              (updateLikeRef) => {
                return q.Select(['data', 'liked'], q.Get(updateLikeRef))
              }
            )
          ),
          description,
          createdAt,
          postedBy: {
            id: q.Select(['ref', 'id'], postedByDoc),
            name: q.Select(['data', 'name'], postedByDoc, null),
            image: q.Select(['data', 'image'], postedByDoc, null),
            username: q.Select(['data', 'username'], postedByDoc, null),
            account: {
              firstName: q.Select(
                ['data', 'account', 'firstName'],
                postedByDoc,
                null
              ),
            },
          },
        }
      })
    )

    res.status(200).json({ updates: response.data })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
