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
  const { id, title, description, creatorId } = req.body
  const userId = (session.user as User).id

  if (userId !== creatorId) {
    res.status(403).json({ message: 'Access Forbidden' })
  }

  try {
    const response = await client.query(
      q.Let(
        {
          goalDoc: q.Update(q.Ref(q.Collection('goals'), id), {
            data: {
              title,
              description,
              timestamps: {
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
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
