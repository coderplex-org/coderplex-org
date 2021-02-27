import { Expr } from 'faunadb'
import faunadb from 'faunadb'
import { User } from 'src/pages/members'
const q = faunadb.query

export function getUserFromUserRef({
  ref,
  session,
}: {
  ref: Expr
  session: any
}) {
  const userDoc = q.Get(ref)
  const userId = q.Select(['ref', 'id'], userDoc)
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
    name: q.Select(['data', 'name'], userDoc, null),
    image: q.Select(['data', 'image'], userDoc, null),
    username: q.Select(['data', 'username'], userDoc, null),
    account: {
      firstName: q.Select(['data', 'account', 'firstName'], userDoc, null),
    },
    isFollowing,
  }
}
