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
  const userId = '291732880734814720'
  const userRef = q.Ref(q.Collection('users'), userId)
  const response = await client.query(
    // q.If(
    //   q.Exists(q.Match(q.Index('notification_status_by_user'), userRef)),
    //   q.Subtract(
    //     q.Count(q.Match(q.Index('all_notifications_by_user'), userRef)),
    //     q.Select(
    //       ['data', 'count'],
    //       q.Get(q.Match(q.Index('notification_status_by_user'), userRef)),
    //       0
    //     )
    //   ),
    //   q.Count(
    //     q.Match(
    //       q.Index('all_notifications_by_user'),
    //       q.Ref(q.Collection('users'), userId)
    //     )
    //   )
    // )
    q.Map(q.Paginate(q.Documents(q.Collection('notifications'))), (userRef) =>
      q.Delete(userRef)
    )
  )
  console.log(JSON.stringify(response, null, 2))
  console.log('THE_END')
}

main().catch((e) => console.error(e))
