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
    const { updateId } = req.body
    const response = await client.query(
      q.Let(
        {
          ref: q.Match(q.Index('unique_update_user_like'), [
            q.Ref(q.Collection('goal_updates'), updateId),
            q.Ref(q.Collection('users'), userId),
          ]),
        },
        q.If(
          q.Exists(q.Var('ref')),
          q.Update(
            q.Ref(
              q.Collection('update_likes'),
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
          q.Create(q.Collection('update_likes'), {
            data: {
              user: q.Ref(q.Collection('users'), userId),
              update: q.Ref(q.Collection('goal_updates'), updateId),
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
    res.status(200).json({ response })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
