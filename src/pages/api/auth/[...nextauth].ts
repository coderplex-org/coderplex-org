import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiHandler } from 'next'
import Fauna from '@/adapters'

import faunadb from 'faunadb'
import slugify from 'slugify'
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
        console.log({ profileData })
        return {
          id: profileData.id,
          name: profileData.name || profileData.login,
          email: profileData.email,
          image: profileData.avatar_url,
          username: profileData.login,
        }
      },
    }),
    Providers.LinkedIn({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      scope: 'r_liteprofile',
      // @ts-ignore
      profileUrl:
        'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))',
      // @ts-ignore
      profile: (profileData) => {
        const profileImage =
          profileData?.profilePicture?.['displayImage~']?.elements[0]
            ?.identifiers?.[0]?.identifier ?? ''
        const name =
          profileData.localizedFirstName + ' ' + profileData.localizedLastName
        const username = slugify(name + ' ' + profileData.id, { lower: true })
        return {
          id: profileData.id,
          name,
          email: null,
          image: profileImage,
          username,
        }
      },
    }),
  ],
  adapter: Fauna.Adapter({ faunaClient }),

  secret: process.env.SECRET,
  pages: {
    signIn: '/login',
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
