import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import faunadb from 'faunadb'
import { User } from 'src/pages/members'
import { getSession } from 'next-auth/client'
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

  try {
    const response: any = await client.query(
      q.Map(q.Paginate(q.Documents(q.Collection('users'))), (userRef) => {
        const user = q.Get(userRef)
        const userId = q.Select(['ref', 'id'], user)
        let isFollowing = false

        if (session) {
          const followerId = (session.user as User).id
          const ref = q.Match(q.Index('unique_user_and_follower'), [
            q.Ref(q.Collection('users'), userId),
            q.Ref(q.Collection('users'), followerId),
          ])
          isFollowing = q.If(
            q.Exists(ref),
            q.Select(['data', 'isFollowing'], q.Get(ref)),
            false
          ) as boolean
        }
        return {
          id: userId,
          name: q.Select(['data', 'name'], user, null),
          username: q.Select(['data', 'username'], user, null),
          image: q.Select(['data', 'image'], user, null),
          account: {
            firstName: q.Select(['data', 'account', 'firstName'], user, null),
            bio: q.Select(['data', 'account', 'bio'], user, null),
          },
          socials: q.Select(['data', 'socials'], user, null),
          isFollowing,
        }
      })
    )
    const users: User[] = response.data

    res.status(200).json({ users })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
