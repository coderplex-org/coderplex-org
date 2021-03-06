import { getCommentFromCommentRef } from 'src/utils/fauna'
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
  const { id, description } = req.body
  const userId = (session.user as User).id
  try {
    const commentDoc = q.Get(q.Ref(q.Collection('update_comments'), id))
    const commentPostedById = q.Select(['data', 'postedBy', 'id'], commentDoc)
    const response = await client.query(
      q.If(
        q.Equals(commentPostedById, userId),
        q.Let(
          {
            commentDoc: q.Update(q.Ref(q.Collection('update_comments'), id), {
              data: {
                description,
              },
            }),
          },
          getCommentFromCommentRef({
            ref: q.Select(['ref'], q.Var('commentDoc')),
            session,
          })
        ),
        q.Abort('You are not authorized to edit this!!!')
      )
    )

    res.status(200).json({ response })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.description })
  }
}

export default FaunaCreateHandler
