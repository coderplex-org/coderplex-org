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
      name: 'followers_by_user',
      source: q.Collection('user_followers'),
      unique: false,
      terms: [
        {
          field: ['data', 'user'],
        },
      ],
    })
  )
  console.log({ response: JSON.stringify({ response }) })
}

main().catch((e) => console.error(e))
