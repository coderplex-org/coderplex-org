import faunadb from 'faunadb'
const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

async function main() {
  await client.query(q.CreateCollection({ name: 'accounts' }))
  await client.query(q.CreateCollection({ name: 'sessions' }))
  await client.query(q.CreateCollection({ name: 'users' }))
  await client.query(q.CreateCollection({ name: 'verification_requests' }))
  await client.query(q.CreateCollection({ name: 'user_followers' }))
  await client.query(q.CreateCollection({ name: 'goals' }))
  await client.query(q.CreateCollection({ name: 'goal_participants' }))
  await client.query(q.CreateCollection({ name: 'goal_updates' }))
  await client.query(q.CreateCollection({ name: 'update_likes' }))
  await client.query(q.CreateCollection({ name: 'update_comments' }))
  // **GOAL**
  // createdBy: User
  // title: string
  // description: string(markdown)
  // timestamps {
  //    createdAt: Time
  //    updatedAt: Time
  // }

  // **GOAL_PARTICIPANTS**
  // goal: Goal
  // participant: User
  // timestamps {
  //    createdAt: Time
  //    updatedAt: Time
  // }

  // **GOAL_UPDATES**
  // goal: Goal
  // postedBy: User
  // description: string(markdown)
  // timestamps {
  //    createdAt: Time
  //    updatedAt: Time
  // }

  // **UPDATE_LIKES**
  // update: GoalUpdate
  // user: User
  // liked: boolean
  // timestamps {
  //    createdAt: Time
  //    updatedAt: Time
  // }

  // **UPDATE_COMMENTS**
  // update: GoalUpdate
  // postedBy: User
  // description: string
  // timestamps {
  //    createdAt: Time
  //    updatedAt: Time
  // }

  await client.query(
    q.CreateIndex({
      name: 'account_by_provider_account_id',
      source: q.Collection('accounts'),
      unique: true,
      terms: [
        { field: ['data', 'providerId'] },
        { field: ['data', 'providerAccountId'] },
      ],
    })
  )

  await client.query(
    q.CreateIndex({
      name: 'session_by_token',
      source: q.Collection('sessions'),
      unique: true,
      terms: [{ field: ['data', 'sessionToken'] }],
    })
  )

  await client.query(
    q.CreateIndex({
      name: 'user_by_email',
      source: q.Collection('users'),
      unique: true,
      terms: [{ field: ['data', 'email'] }],
    })
  )

  await client.query(
    q.CreateIndex({
      name: 'verification_request_by_token',
      source: q.Collection('verification_requests'),
      unique: true,
      terms: [{ field: ['data', 'token'] }],
    })
  )

  await client.query(
    q.CreateIndex({
      name: 'user_by_username',
      source: q.Collection('users'),
      unique: true,
      terms: [{ field: ['data', 'username'] }],
    })
  )

  await client.query(
    q.CreateIndex({
      name: 'unique_user_and_follower',
      source: q.Collection('user_followers'),
      unique: true,
      terms: [
        {
          field: ['data', 'user'],
        },
        {
          field: ['data', 'follower'],
        },
      ],
    })
  )

  // Get all the goals that the user is participating in
  await client.query(
    q.CreateIndex({
      name: 'all_goals_by_participant',
      source: q.Collection('goal_participants'),
      unique: false,
      terms: [
        {
          field: ['data', 'participant'],
        },
      ],
    })
  )

  // there should be only 1 record for every combination of goal and participant
  await client.query(
    q.CreateIndex({
      name: 'unique_goal_and_participant',
      source: q.Collection('goal_participants'),
      unique: true,
      terms: [
        {
          field: ['data', 'goal'],
        },
        {
          field: ['data', 'participant'],
        },
      ],
    })
  )

  // Get all the participants of a goal
  await client.query(
    q.CreateIndex({
      name: 'all_participants_by_goal',
      source: q.Collection('goal_participants'),
      unique: false,
      terms: [
        {
          field: ['data', 'goal'],
        },
      ],
    })
  )

  // Get all updates of a goal
  await client.query(
    q.CreateIndex({
      name: 'all_updates_by_goal',
      source: q.Collection('goal_updates'),
      unique: false,
      terms: [
        {
          field: ['data', 'goal'],
        },
      ],
    })
  )

  // Get all updates of a participant for a goal
  await client.query(
    q.CreateIndex({
      name: 'all_updates_by_goal_and_participant',
      source: q.Collection('goal_updates'),
      unique: false,
      terms: [
        {
          field: ['data', 'goal'],
        },
        {
          field: ['data', 'postedBy'],
        },
      ],
    })
  )

  // Get all updates – Latest update at the top
  await client.query(
    q.CreateIndex({
      name: 'all_recent_updates',
      source: q.Collection('goal_updates'),
      unique: false,
      values: [
        {
          field: ['data', 'timestamps', 'updatedAt'],
          reverse: true,
        },
        {
          field: ['ref'],
        },
      ],
    })
  )

  // there should be only 1 record for every combination of update and user
  await client.query(
    q.CreateIndex({
      name: 'unique_update_user_like',
      source: q.Collection('update_likes'),
      unique: true,
      terms: [
        {
          field: ['data', 'update'],
        },
        {
          field: ['data', 'user'],
        },
      ],
    })
  )

  // there should be only 1 record for every combination of update and user
  await client.query(
    q.CreateIndex({
      name: 'all_likes_by_update',
      source: q.Collection('update_likes'),
      terms: [
        {
          field: ['data', 'update'],
        },
      ],
    })
  )

  // Get comments by update
  await client.query(
    q.CreateIndex({
      name: 'all_comments_by_update',
      source: q.Collection('update_comments'),
      terms: [
        {
          field: ['data', 'update'],
        },
      ],
    })
  )
}

main()
