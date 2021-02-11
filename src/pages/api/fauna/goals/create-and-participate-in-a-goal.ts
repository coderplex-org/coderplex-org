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
    res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const { title, description } = req.body
    const userId = (session.user as User).id
    const response = await client.query(
      q.Let(
        {
          goalDoc: q.Create(q.Collection('goals'), {
            data: {
              createdBy: q.Ref(q.Collection('users'), userId),
              title,
              description,
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          }),
          goalParticipant: q.Create(q.Collection('goal_participants'), {
            data: {
              goal: q.Ref(
                q.Collection('goals'),
                q.Select(['ref', 'id'], q.Var('goalDoc'))
              ),
              participant: q.Ref(q.Collection('users'), userId),
              timestamps: {
                createdAt: q.Now(),
                updatedAt: q.Now(),
              },
            },
          }),
        },
        {
          id: q.Select(['ref', 'id'], q.Var('goalDoc')),
        }
      )
    )

    res.status(200).json({ response })
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
