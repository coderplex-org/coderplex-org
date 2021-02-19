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

  try {
    const { goalId } = req.body
    const goalRef = q.Ref(q.Collection('goals'), goalId)
    const goalDoc = q.Get(goalRef)
    const goalCreatedByDoc = q.Get(q.Select(['data', 'createdBy'], goalDoc))
    const response: any = await client.query({
      id: q.Select(['ref', 'id'], goalDoc),
      title: q.Select(['data', 'title'], goalDoc),
      description: q.Select(['data', 'description'], goalDoc),
      createdAt: q.ToMillis(
        q.Select(['data', 'timestamps', 'createdAt'], goalDoc, 0)
      ),
      createdBy: {
        id: q.Select(['ref', 'id'], goalCreatedByDoc),
        name: q.Select(['data', 'name'], goalCreatedByDoc, null),
        username: q.Select(['data', 'username'], goalCreatedByDoc, null),
        account: {
          firstName: q.Select(
            ['data', 'account', 'firstName'],
            goalCreatedByDoc,
            null
          ),
        },
      },
      updates: q.Map(
        q.Paginate(q.Match(q.Index('all_updates_by_goal'), goalRef)),
        (updateRef) => {
          const updateDoc = q.Get(updateRef)
          const postedByDoc = q.Get(q.Select(['data', 'postedBy'], updateDoc))
          return {
            id: q.Select(['ref', 'id'], updateDoc),
            description: q.Select(['data', 'description'], updateDoc),
            createdAt: q.ToMillis(
              q.Select(['data', 'timestamps', 'createdAt'], updateDoc, 0)
            ),
            postedBy: {
              id: q.Select(['ref', 'id'], postedByDoc),
              image: q.Select(['data', 'image'], postedByDoc, null),
              name: q.Select(['data', 'name'], postedByDoc, null),
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
    })
    res.status(200).json({ response })
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
