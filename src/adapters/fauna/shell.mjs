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
  const userId = '290862832026649088'
  const allUsers = q.Filter(q.Documents(q.Collection('users')), (ref) =>
    q.Not(q.Equals(q.Select(['ref', 'id'], q.Get(ref)), userId))
  )

  const isFollowing = (followingId) => {
    const followerId = userId
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

  const whoToFollow = q.Paginate(
    q.Filter(allUsers, (ref) =>
      q.Not(isFollowing(q.Select(['ref', 'id'], q.Get(ref))))
    )
  )

  const response = await client.query(
    q.Map(whoToFollow, (ref) => {
      const doc = q.Get(ref)
      return {
        id: q.Select(['ref', 'id'], doc),
        name: q.Select(['data', 'name'], doc, null),
        image: q.Select(['data', 'image'], doc, null),
        username: q.Select(['data', 'username'], doc, null),
        account: {
          firstName: q.Select(['data', 'account', 'firstName'], doc, null),
        },
      }
    })
  )
  console.log({ response: JSON.stringify(response, null, 2) })
}

main().catch((e) => console.error(e))
