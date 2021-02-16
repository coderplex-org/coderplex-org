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
    const response: any = await client.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('all_goals_by_participant'),
            q.Ref(q.Collection('users'), userId)
          )
        ),
        (goalParticipantRef) => {
          const goalParticipantDoc = q.Get(goalParticipantRef)
          const goalRef = q.Select(['data', 'goal'], goalParticipantDoc)
          return {
            id: q.Select(['id'], goalRef),
            title: q.Select(['data', 'title'], q.Get(goalRef)),
          }
        }
      )
    )
    res.status(200).json({ goal: response.data[0] })
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
