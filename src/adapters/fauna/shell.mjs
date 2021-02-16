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
  const updateId = '290679173199954432'
  const userId = '290674292629176832'
  const goalUpdateRef = q.Ref(q.Collection('goal_updates'), updateId)
  const response = await client.query(
    q.Map(
      q.Filter(
        q.Paginate(q.Match(q.Index('all_comments_by_update'), goalUpdateRef)),
        (commentRef) => {
          const commentDoc = q.Get(commentRef)
          return q.IsNull(q.Select(['data', 'parentComment'], commentDoc, null))
        }
      ),
      (commentRef) => {
        const commentDoc = q.Get(commentRef)
        const postedByDoc = q.Get(q.Select(['data', 'postedBy'], commentDoc))
        return {
          id: q.Select(['ref', 'id'], commentDoc),
          description: q.Select(['data', 'description'], commentDoc),
          createdAt: q.ToMillis(
            q.Select(['data', 'timestamps', 'createdAt'], commentDoc)
          ),
          postedByDoc,
          postedBy: {
            id: q.Select(['ref', 'id'], postedByDoc, null),
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
    )
  )

  console.log({ response: JSON.stringify({ response }) })
}

main().catch((e) => console.error(e))
