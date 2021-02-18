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

const isFollowing = ({
  followerId,
  followingId,
}: {
  followerId: string
  followingId: string
}) => {
  return q.Let(
    {
      ref: q.Match(q.Index('unique_user_and_follower'), [
        q.Ref(q.Collection('users'), followingId),
        q.Ref(q.Collection('users'), followerId),
      ]),
    },
    q.If(
      q.Exists(q.Var('ref')),
      q.Select(['data', 'isFollowing'], q.Get(q.Var('ref'))),
      false
    )
  )
}

const FaunaCreateHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({ req })

  if (!session) {
    const response: any = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('users')), { size: 3 }),
        (userRef) => {
          const userDoc = q.Get(userRef)
          return {
            id: q.Select(['ref', 'id'], userDoc),
            name: q.Select(['data', 'name'], userDoc, null),
            image: q.Select(['data', 'image'], userDoc, null),
            username: q.Select(['data', 'username'], userDoc, null),
            account: {
              firstName: q.Select(
                ['data', 'account', 'firstName'],
                userDoc,
                null
              ),
            },
          }
        }
      )
    )
    return res.status(200).json({ users: response.data })
  }

  const userId = (session.user as User).id

  try {
    const allUsers = q.Filter(q.Documents(q.Collection('users')), (ref) =>
      q.Not(q.Equals(q.Select(['ref', 'id'], q.Get(ref)), userId))
    )
    const whoToFollow = q.Filter(allUsers, (ref) => {
      const followerId = userId
      const followingId = q.Select(['ref', 'id'], q.Get(ref)) as string
      return q.Not(isFollowing({ followerId, followingId }))
    })

    const response: any = await client.query(
      q.Map(q.Paginate(whoToFollow, { size: 3 }), (userRef) => {
        const userDoc = q.Get(userRef)
        return {
          id: q.Select(['ref', 'id'], userDoc),
          name: q.Select(['data', 'name'], userDoc, null),
          image: q.Select(['data', 'image'], userDoc, null),
          username: q.Select(['data', 'username'], userDoc, null),
          account: {
            firstName: q.Select(
              ['data', 'account', 'firstName'],
              userDoc,
              null
            ),
          },
        }
      })
    )

    res.status(200).json({ users: response.data })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
