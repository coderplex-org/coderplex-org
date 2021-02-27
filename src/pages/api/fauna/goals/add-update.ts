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
  const { goalId, description } = req.body
  const userId = (session.user as User).id

  try {
    const response = await client.query(
      q.Let(
        {
          // If the logged in user is a participant of this goal, then post the update
          goalUpdateDoc: q.If(
            q.Exists(
              q.Match(q.Index('unique_goal_and_participant'), [
                q.Ref(q.Collection('goals'), goalId),
                q.Ref(q.Collection('users'), userId),
              ])
            ),
            q.Create(q.Collection('goal_updates'), {
              data: {
                goal: q.Ref(q.Collection('goals'), goalId),
                postedBy: q.Ref(q.Collection('users'), userId),
                description,
                timestamps: {
                  createdAt: q.Now(),
                  updatedAt: q.Now(),
                },
              },
            }),
            null
          ),
          goalDoc: q.Get(q.Select(['data', 'goal'], q.Var('goalUpdateDoc'))),
          postedByDoc: q.Get(
            q.Select(['data', 'postedBy'], q.Var('goalUpdateDoc'))
          ),
        },
        {
          id: q.Select(['ref', 'id'], q.Var('goalUpdateDoc'), null),
          goal: {
            id: q.Select(['ref', 'id'], q.Var('goalDoc')),
            title: q.Select(['data', 'title'], q.Var('goalDoc')),
          },
          comments: {
            data: [],
          },
          hasLiked: false,
          likes: {
            data: [],
          },
          description: q.Select(
            ['data', 'description'],
            q.Var('goalUpdateDoc')
          ),
          createdAt: q.ToMillis(
            q.Select(
              ['data', 'timestamps', 'createdAt'],
              q.Var('goalUpdateDoc')
            )
          ),
          postedBy: {
            id: q.Select(['ref', 'id'], q.Var('postedByDoc')),
            name: q.Select(['data', 'name'], q.Var('postedByDoc'), null),
            image: q.Select(['data', 'image'], q.Var('postedByDoc'), null),
            username: q.Select(
              ['data', 'username'],
              q.Var('postedByDoc'),
              null
            ),
            account: {
              firstName: q.Select(
                ['data', 'account', 'firstName'],
                q.Var('postedByDoc'),
                null
              ),
            },
          },
        }
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
