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
  const goalId = '290932327237812736'
  const response = await client.query(
    q.Map(q.Paginate(q.Documents(q.Collection('goals'))), (goalRef) =>
      q.Select(['ref', 'id'], q.Get(goalRef))
    )
  )
  console.log(JSON.stringify(response, null, 2))
}

main().catch((e) => console.error(e))
