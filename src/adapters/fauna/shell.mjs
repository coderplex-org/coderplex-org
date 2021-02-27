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
    q.Do(
      q.Map(
        q.Paginate(q.Documents(q.Collection('notifications'))),
        (goalUpdate) => q.Delete(goalUpdate)
      ),
      q.Map(q.Paginate(q.Documents(q.Collection('activities'))), (goalUpdate) =>
        q.Delete(goalUpdate)
      )
    )
  )
  console.log(JSON.stringify(response, null, 2))
  console.log('THE_END')
}

main().catch((e) => console.error(e))
