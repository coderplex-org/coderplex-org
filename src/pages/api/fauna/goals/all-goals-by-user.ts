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
    const { userId } = req.body

    const FQL = q.Map(
      q.Paginate(
        q.Match(
          q.Index('all_goals_by_participant'),
          q.Ref(q.Collection('users'), userId)
        )
      ),
      (goalParticipantRef) => {
        const goalParticipantDoc = q.Get(goalParticipantRef)
        const goalRef = q.Select(['data', 'goal'], goalParticipantDoc)
        const goalDoc = q.Get(goalRef)
        const goalCreatedByDoc = q.Get(q.Select(['data', 'createdBy'], goalDoc))
        return {
          id: q.Select(['ref', 'id'], goalDoc),
          title: q.Select(['data', 'title'], goalDoc),
          description: q.Select(['data', 'description'], goalDoc),
          deadline: q.If(
            q.IsNull(q.Select(['data', 'deadline'], goalDoc, null)),
            0,
            q.ToMillis(q.Select(['data', 'deadline'], goalDoc, null))
          ),
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
          participants: q.Map(
            q.Paginate(q.Match(q.Index('all_participants_by_goal'), goalRef)),
            (goalParticipantRef2) => {
              const goalParticipantDoc2 = q.Get(goalParticipantRef2)
              const participantDoc = q.Get(
                q.Select(['data', 'participant'], goalParticipantDoc2)
              )
              return {
                id: q.Select(['ref', 'id'], participantDoc),
                image: q.Select(['data', 'image'], goalCreatedByDoc, null),
                name: q.Select(['data', 'name'], participantDoc, null),
                username: q.Select(['data', 'username'], participantDoc, null),
                account: {
                  firstName: q.Select(
                    ['data', 'account', 'firstName'],
                    participantDoc,
                    null
                  ),
                },
              }
            }
          ),
          updates: q.Map(
            q.Paginate(
              q.Match(q.Index('all_updates_by_goal_and_participant'), [
                goalRef,
                q.Ref(q.Collection('users'), userId),
              ])
            ),
            (updateRef) => {
              const updateDoc = q.Get(updateRef)
              const postedByDoc = q.Get(
                q.Select(['data', 'postedBy'], updateDoc)
              )
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
        }
      }
    )
    const response: any = await client.query(FQL)
    res.status(200).json(response.data)
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
