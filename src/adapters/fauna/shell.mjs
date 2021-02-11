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
  const response = await client.query(
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
  console.log({ response: JSON.stringify(response) })
}

main().catch((e) => console.error(e))
