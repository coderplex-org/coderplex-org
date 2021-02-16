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
  const response = client.query(
    q.Update(q.Index('user_follower_by_user_and_follower'), {
      name: 'unique_user_and_follower',
    })
  )
  console.log({ response: JSON.stringify({ response }) })
}

main().catch((e) => console.error(e))
