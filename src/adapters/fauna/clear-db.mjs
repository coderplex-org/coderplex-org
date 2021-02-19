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
  client.query(
    q.Do(
      q.Map(q.Paginate(q.Documents(q.Collection('users'))), (userRef) =>
        q.Delete(userRef)
      ),
      q.Map(q.Paginate(q.Documents(q.Collection('sessions'))), (sessionRef) =>
        q.Delete(sessionRef)
      ),
      q.Map(q.Paginate(q.Documents(q.Collection('accounts'))), (accountRef) =>
        q.Delete(accountRef)
      ),
      q.Map(
        q.Paginate(q.Documents(q.Collection('verification_requests'))),
        (verificationRequestRef) => q.Delete(verificationRequestRef)
      ),
      q.Map(
        q.Paginate(q.Documents(q.Collection('user_followers'))),
        (userFollower) => q.Delete(userFollower)
      ),
      q.Map(q.Paginate(q.Documents(q.Collection('goals'))), (goal) =>
        q.Delete(goal)
      ),
      q.Map(
        q.Paginate(q.Documents(q.Collection('goal_participants'))),
        (goalParticipant) => q.Delete(goalParticipant)
      ),
      q.Map(
        q.Paginate(q.Documents(q.Collection('goal_updates'))),
        (goalUpdate) => q.Delete(goalUpdate)
      ),
      q.Map(
        q.Paginate(q.Documents(q.Collection('update_likes'))),
        (updateLike) => q.Delete(updateLike)
      ),
      q.Map(
        q.Paginate(q.Documents(q.Collection('update_comments'))),
        (goalComment) => q.Delete(goalComment)
      )
    )
  )
}

main().catch((e) => console.error(e))
