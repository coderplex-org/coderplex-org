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
      bio: q.Select(['data', 'account', 'bio'], userDoc, null),
    },
    socials: q.Select(['data', 'socials'], userDoc, null),
    isFollowing,
  }
}

export function getUpdateFromUpdateRef({
  ref: goalUpdateRef,
  session,
}: {
  ref: Expr
  session: any
}) {
  const goalUpdateDoc = q.Get(goalUpdateRef)
  const goalDoc = q.Get(q.Select(['data', 'goal'], goalUpdateDoc))
  const postedByDoc = q.Get(q.Select(['data', 'postedBy'], goalUpdateDoc))
  const description = q.Select(['data', 'description'], goalUpdateDoc)

  const createdAt = q.ToMillis(
    q.Select(['data', 'timestamps', 'createdAt'], goalUpdateDoc)
  )
  const updateId = q.Select(['ref', 'id'], goalUpdateDoc)
  let hasLiked = false
  if (session) {
    const userId = (session.user as User).id
    const ref = q.Match(q.Index('unique_update_user_like'), [
      q.Ref(q.Collection('goal_updates'), updateId),
      q.Ref(q.Collection('users'), userId),
    ])
    hasLiked = q.If(
      q.Exists(ref),
      q.Select(['data', 'liked'], q.Get(ref)),
      false
    ) as boolean
  }
  return {
    id: updateId,
    goal: {
      id: q.Select(['ref', 'id'], goalDoc),
      title: q.Select(['data', 'title'], goalDoc),
    },
    comments: q.Map(
      q.Paginate(q.Match(q.Index('all_comments_by_update'), goalUpdateRef)),
      (commentRef) => {
        return getCommentFromCommentRef({ ref: commentRef, session })
      }
    ),
    hasLiked,
    likes: q.Map(
      q.Filter(
        q.Paginate(q.Match(q.Index('all_likes_by_update'), goalUpdateRef)),
        (updateLikeRef) => {
          return q.Select(['data', 'liked'], q.Get(updateLikeRef))
        }
      ),
      (likeRef) => {
        const likeDoc = q.Get(likeRef)
        const userRef = q.Select(['data', 'user'], likeDoc)

        return getUserFromUserRef({ ref: userRef, session })
      }
    ),
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
}

export function getCommentFromCommentRef({
  ref: commentRef,
  session,
}: {
  ref: Expr
  session: any
}) {
  const commentDoc = q.Get(commentRef)
  const postedByDoc = q.Get(q.Select(['data', 'postedBy'], commentDoc))
  let hasLiked = false
  const commentId = q.Select(['ref', 'id'], commentDoc)
  if (session) {
    const userId = (session.user as User).id
    const ref = q.Match(q.Index('unique_comment_user_like'), [
      q.Ref(q.Collection('update_comments'), commentId),
      q.Ref(q.Collection('users'), userId),
    ])
    hasLiked = q.If(
      q.Exists(ref),
      q.Select(['data', 'liked'], q.Get(ref)),
      false
    ) as boolean
  }
  return {
    id: commentId,
    updateId: q.Select(['data', 'update', 'id'], commentDoc),
    description: q.Select(['data', 'description'], commentDoc),
    createdAt: q.ToMillis(
      q.Select(['data', 'timestamps', 'createdAt'], commentDoc)
    ),
    hasLiked,
    likes: q.Map(
      q.Filter(
        q.Paginate(q.Match(q.Index('all_likes_by_comment'), commentRef)),
        (commentLikeRef) => {
          return q.Select(['data', 'liked'], q.Get(commentLikeRef))
        }
      ),
      (likeRef) => {
        const likeDoc = q.Get(likeRef)
        const userRef = q.Select(['data', 'user'], likeDoc)
        return getUserFromUserRef({ ref: userRef, session })
      }
    ),
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
}
