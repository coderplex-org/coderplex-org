import { Goal, Profile, Title } from '@/components'
import { PaddedLayout } from 'src/layouts'
import faunadb from 'faunadb'
import { InferGetServerSidePropsType } from 'next'
import { User } from '../members'
import { DateTime } from 'luxon'
import { useQuery } from 'react-query'
import { getSession, useSession } from 'next-auth/client'
const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

type Update = {
  id: string
  description: string
  createdAt: number
  postedBy: User
}

export type GoalResponse = {
  id: string
  title: string
  description: string
  deadline: number
  createdAt: number
  createdBy: User
  participants: {
    data: User[]
  }
  updates: {
    data: Update[]
  }
}

export default function UserProfile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [session, loading] = useSession()
  const { isLoading, isError, data } = useQuery(
    '/api/fauna/goals/all-goals-by-user',
    () =>
      fetch(`/api/fauna/goals/all-goals-by-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      })
  )

  const goalResponses = data ?? []

  if (isLoading) {
    return (
      <>
        <Title>{user.username}</Title>
        <p>loading...</p>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Title>{user.username}</Title>
        <p>Something went wrong!!!</p>
      </>
    )
  }

  const allowToPostUpdate = (goalResponse: GoalResponse) => {
    const participantIds = goalResponse.participants.data.map(
      (participant) => participant.id
    )
    return session && participantIds.includes((session.user as User).id)
  }

  return (
    <>
      <Title>{user.username}</Title>
      <Profile user={user} />
      {goalResponses.map((goalResponse: GoalResponse) => (
        <Goal.Feed
          key={goalResponse.id}
          createdBy={goalResponse.createdBy}
          goal={{
            id: goalResponse.id,
            title: goalResponse.title,
            description: goalResponse.description,
            creatorId: goalResponse.createdBy.id,
            deadline: DateTime.fromMillis(goalResponse.deadline),
          }}
          participants={goalResponse.participants.data}
          createdAt={DateTime.fromMillis(goalResponse.createdAt)}
          updatesCount={goalResponse.updates.data.length}
        >
          <Goal.Updates>
            <Goal.UpdatesList>
              {goalResponse.updates.data.map((update, index) => (
                <Goal.Update
                  postedBy={update.postedBy}
                  key={update.id}
                  postedOn={DateTime.fromMillis(update.createdAt)}
                  isLastUpdate={
                    index === goalResponse.updates.data.length - 1 &&
                    !allowToPostUpdate(goalResponse)
                  }
                >
                  {update.description}
                </Goal.Update>
              ))}
            </Goal.UpdatesList>

            {allowToPostUpdate(goalResponse) && (
              <Goal.NewUpdate
                goal={{ id: goalResponse.id, title: goalResponse.title }}
              />
            )}
          </Goal.Updates>
        </Goal.Feed>
      ))}
      {goalResponses.length === 0 &&
        session &&
        (session.user as User).id === user.id && (
          <>
            <div className="bg-white px-4 py-6 mt-4 shadow sm:p-6 sm:rounded-lg">
              <div className="flex">
                <span className="block text-lg text-brand-600 font-semibold tracking-wide">
                  🚀 Set Your Goal:
                </span>
              </div>
              <Goal.New />
            </div>
          </>
        )}
    </>
  )
}

export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req })
  const username = query.username
  const dbUser = q.Get(q.Match(q.Index('user_by_username'), username))
  const userId = q.Select(['ref', 'id'], dbUser)
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
  const user = (await client.query({
    id: userId,
    name: q.Select(['data', 'name'], dbUser, null),
    username: q.Select(['data', 'username'], dbUser, null),
    email: q.Select(['data', 'email'], dbUser, null),
    image: q.Select(['data', 'image'], dbUser, null),
    account: q.Select(['data', 'account'], dbUser, null),
    socials: q.Select(['data', 'socials'], dbUser, null),
    isFollowing,
  })) as User
  return {
    props: {
      user,
    },
  }
}

UserProfile.layoutProps = {
  Layout: PaddedLayout,
}
