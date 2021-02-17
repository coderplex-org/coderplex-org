import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiHandler } from 'next'
import Fauna from '@/adapters'

import faunadb from 'faunadb'
import { User } from 'src/pages/members'
const isProduction = process.env.NODE_ENV === 'production'
const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'user:email',
      // @ts-ignore
      profile: (profileData) => {
        return {
          id: profileData.id,
          name: profileData.name || profileData.login,
          email: profileData.email,
          image: profileData.avatar_url,
          username: profileData.login,
        }
      },
    }),
  ],
  adapter: Fauna.Adapter({ faunaClient }),

  secret: process.env.SECRET,
  pages: {
    signIn: '/join',
  },
  callbacks: {
    session: async (session, user: User) => {
      return Promise.resolve({
        ...session,
        user,
      })
    },
  },
}
