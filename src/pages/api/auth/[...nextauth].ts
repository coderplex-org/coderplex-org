import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiHandler } from 'next'
import Fauna from '@/adapters'

import faunadb from 'faunadb'
import { User } from 'src/pages/members'
import slugify from 'slugify'
const isProduction = process.env.NODE_ENV === 'production'
const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET ?? 'secret',
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

function getFirstAndLastNames(name: string) {
  const nameArray = name.split(' ')
  let firstName = ''
  let lastName = ''
  if (nameArray.length === 1) {
    firstName = name
  } else if (nameArray.length > 1) {
    firstName = nameArray.slice(0, -1).join(' ')
    lastName = nameArray.slice(-1).join(' ')
  }
  return { firstName, lastName }
}

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'user:email',
      // @ts-ignore
      profile: (profileData) => {
        const name = profileData.name || profileData.login
        const { firstName, lastName } = getFirstAndLastNames(name)
        return {
          id: profileData.id,
          name,
          firstName,
          lastName,
          email: profileData.email,
          image: profileData.avatar_url,
          username: profileData.login,
          bio: profileData.bio,
          github: profileData.login,
          twitter: profileData.twitter_username,
          blog: profileData.blog,
          company: profileData.company,
        }
      },
    }),
    ...(isProduction
      ? []
      : [
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
                profileData?.profilePicture?.['displayImage~']?.elements?.[3]
                  ?.identifiers?.[0]?.identifier ??
                profileData?.profilePicture?.['displayImage~']?.elements?.[2]
                  ?.identifiers?.[0]?.identifier ??
                profileData?.profilePicture?.['displayImage~']?.elements?.[1]
                  ?.identifiers?.[0]?.identifier ??
                profileData?.profilePicture?.['displayImage~']?.elements?.[0]
                  ?.identifiers?.[0]?.identifier ??
                ''
              const name =
                profileData.localizedFirstName +
                ' ' +
                profileData.localizedLastName
              const username = slugify(name + ' ' + profileData.id, {
                lower: true,
              })
              return {
                id: profileData.id,
                name,
                email: null,
                firstName: profileData.localizedFirstName,
                lastName: profileData.localizedLastName,
                image: profileImage,
                username,
                bio: null,
                github: null,
                twitter: null,
                blog: null,
                company: null,
              }
            },
          }),
        ]),
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
