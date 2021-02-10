import { Goal, Profile, Title } from '@/components'
import { PaddedLayout } from 'src/layouts'
import faunadb from 'faunadb'
import { InferGetServerSidePropsType } from 'next'
import { User } from '../members'
import { GoalUpdateType } from 'src/components/goals/GoalUpdate'
import { DateTime } from 'luxon'
const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

const updates: GoalUpdateType[] = [
  {
    description: `Opened an issue in [Coderplex](https://github.com/coderplex-org/coderplex-org) repo.`,
    createdAt: DateTime.local().minus({ days: 2 }),
  },
  {
    description: `Submitted a PR to [Coderplex](https://github.com/coderplex-org/coderplex-org) repo. Waiting for the review.`,
    createdAt: DateTime.local().minus({ days: 4 }),
  },
]
const goal = {
  title: 'Contribute to Open Source',
  description: `My goal is to contribute to any open source atleast once in a
week. I would have achieved my goal if I complete all of the
following.

- Contribute to open source projects atleast once per week for 6 months.
- Get atleast 1 pull request merged atleast once per month for 6 months.
  `,
}

export default function UserProfile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Title>{user.username}</Title>
      <Profile user={user} />
      <Goal.Feed user={user} goal={goal}>
        <Goal.Updates>
          <Goal.UpdatesList>
            {updates.map((update) => (
              <Goal.Update user={user} update={update}>
                {update.description}
              </Goal.Update>
            ))}
          </Goal.UpdatesList>
          <Goal.New user={user} />
        </Goal.Updates>
      </Goal.Feed>
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
