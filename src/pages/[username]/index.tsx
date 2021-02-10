import { Goal, Profile, Title } from '@/components'
import { PaddedLayout } from 'src/layouts'
import faunadb from 'faunadb'
import { InferGetServerSidePropsType } from 'next'
import { User } from '../members'
import { DateTime } from 'luxon'
import { useQuery } from 'react-query'
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

type GoalResponse = {
  id: string
  title: string
  description: string
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
  const { isLoading, isError, data } = useQuery(
    ['/api/fauna/goals/all-goals-by-user'],
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

  const goalResponses = data?.response?.data ?? []

  if (isLoading) {
    return <p>loading...</p>
  }

  if (isError) {
    return <p>Something went wrong!!!</p>
  }

  return (
    <>
      <Title>{user.username}</Title>
      <Profile user={user} />
      {goalResponses.map((goalResponse: GoalResponse) => (
        <Goal.Feed
          createdBy={goalResponse.createdBy}
          goal={{
            title: goalResponse.title,
            description: goalResponse.description,
          }}
          participants={goalResponse.participants.data}
          createdAt={DateTime.fromMillis(goalResponse.createdAt)}
          updatesCount={goalResponse.updates.data.length}
        >
          <Goal.Updates>
            <Goal.UpdatesList>
              {goalResponse.updates.data.map((update) => (
                <Goal.Update
                  postedBy={user}
                  key={update.id}
                  postedOn={DateTime.fromMillis(update.createdAt)}
                >
                  {update.description}
                </Goal.Update>
              ))}
            </Goal.UpdatesList>
            <Goal.New user={user} />
          </Goal.Updates>
        </Goal.Feed>
      ))}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const username = context.query.username
  const dbUser = q.Get(q.Match(q.Index('user_by_username'), username))
  const user = (await client.query({
    id: q.Select(['ref', 'id'], dbUser),
    name: q.Select(['data', 'name'], dbUser, null),
    username: q.Select(['data', 'username'], dbUser, null),
    email: q.Select(['data', 'email'], dbUser, null),
    image: q.Select(['data', 'image'], dbUser, null),
    account: q.Select(['data', 'account'], dbUser, null),
    socials: q.Select(['data', 'socials'], dbUser, null),
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
