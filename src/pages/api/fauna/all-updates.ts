import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

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
  try {
    const updates = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('all_recent_updates'))), (result) => {
        const goalUpdateRef = q.Select(1, result)
        const goalUpdateDoc = q.Get(goalUpdateRef)
        const goalDoc = q.Get(q.Select(['data', 'goal'], goalUpdateDoc))
        const postedByDoc = q.Get(q.Select(['data', 'postedBy'], goalUpdateDoc))
        const description = q.Select(['data', 'description'], goalUpdateDoc)

        const createdAt = q.ToMillis(
          q.Select(['data', 'timestamps', 'createdAt'], goalUpdateDoc)
        )
        return {
          id: q.Select(['ref', 'id'], goalUpdateDoc),
          goal: {
            id: q.Select(['ref', 'id'], goalDoc),
            title: q.Select(['data', 'title'], goalDoc),
          },
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

    res.status(200).json({ updates })
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
