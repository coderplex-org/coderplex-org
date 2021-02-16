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
  const userId = '290660451092529664'
  const updateId = '290663250781012480'
  const response = await client.query(
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
  console.log({ response: JSON.stringify({ response }) })
}

main().catch((e) => console.error(e))
