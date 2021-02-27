import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import faunadb from 'faunadb'
import { getSession } from 'next-auth/client'
import { User } from 'src/pages/members'
import { getUpdateFromUpdateRef, getUserFromUserRef } from 'src/utils/fauna'
const q = faunadb.query
const isProduction = process.env.NODE_ENV === 'production'
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

const FaunaCreateHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({ req })
  try {
    const response: any = await client.query(
      q.Map(q.Paginate(q.Match(q.Index('all_recent_updates'))), (result) => {
        const goalUpdateRef = q.Select(1, result)
        return getUpdateFromUpdateRef({ ref: goalUpdateRef, session })
      })
    )

    res.status(200).json({ updates: response.data })
  } catch (error) {
    console.error(error)
    console.error({ msg: error.message })
    res.status(500).json({ message: error.message })
  }
}

export default FaunaCreateHandler
