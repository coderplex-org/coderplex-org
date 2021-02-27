import { getSession } from 'next-auth/client'
import { HomePageFeedUpdate } from 'src/components/HomePageFeed'
import { PaddedLayout } from 'src/layouts'

import faunadb from 'faunadb'
import { getUpdateFromUpdateRef } from 'src/utils/fauna'
import { HomePageFeedUpdateType } from '..'

const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

export default function Update({ update }: { update: HomePageFeedUpdateType }) {
  return <HomePageFeedUpdate update={update} setGoalId={() => {}} />
}

export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req })
  const update = await client.query(
    getUpdateFromUpdateRef({
      ref: q.Ref(q.Collection('goal_updates'), query.id),
      session,
    })
  )
  return {
    props: {
      update,
    },
  }
}

Update.layoutProps = {
  meta: {
    title: 'Update',
  },
  Layout: PaddedLayout,
}
