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
      q.Let(
        {
          goalParticipantRef: q.Select(
            0,
            q.Paginate(
              q.Match(
                q.Index('all_goals_by_participant'),
                q.Ref(q.Collection('users'), userId)
              )
            )
          ),
          goalParticipantDoc: q.Get(q.Var('goalParticipantRef')),
          goalRef: q.Select(['data', 'goal'], q.Var('goalParticipantDoc')),
        },
        {
          id: q.Select(['id'], q.Var('goalRef')),
          title: q.Select(['data', 'title'], q.Get(q.Var('goalRef'))),
        }
      )
    )

    res.status(200).json({ goal: response })
  } catch (error) {
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
