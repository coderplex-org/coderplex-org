import { getSession } from 'next-auth/client'

import faunadb from 'faunadb'
import { UpdateCommentType } from '..'
import { getCommentFromCommentRef } from 'src/utils/fauna'
import { UpdateComment } from '@/components'
import { PaddedLayout } from 'src/layouts'

const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

export default function Update({ comment }: { comment: UpdateCommentType }) {
  return (
    <UpdateComment comment={comment} canAddNewComment={true}>
      {comment.description}
    </UpdateComment>
  )
}

export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req })
  const comment = await client.query(
    getCommentFromCommentRef({
      ref: q.Ref(q.Collection('update_comments'), query.id),
      session,
    })
  )
  return {
    props: {
      comment,
    },
  }
}

Update.layoutProps = {
  meta: {
    title: 'Comment',
  },
  Layout: PaddedLayout,
}
