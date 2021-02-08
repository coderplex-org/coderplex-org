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
    res.status(401).json({ message: 'Unauthorized' })
  }

  // TODO: handle 403 case - Only allow the owner of the page to update the page

  try {
    const id = req.query.id
    const { user } = req.body
    const response: any = await client.query(
      q.Let(
        {
          userDoc: q.Update(q.Ref(q.Collection('users'), id), {
            data: {
              username: user.username,
              account: {
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
              },
              timestamps: { updatedAt: q.Now() },
            },
          }),
        },
        {
          id: q.Select(['ref', 'id'], q.Var('userDoc')),
        }
      )
    )
    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong!!!' })
  }
}

export default FaunaCreateHandler
