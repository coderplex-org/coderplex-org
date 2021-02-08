import { Avatar } from '@/ui'
import { User } from 'src/pages/members'
import {
  IconBrandCodepen,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconExternalLink,
} from 'tabler-icons'
import { A } from '@/components'

export default function Member({ user }: { user: User }) {
  const socials = user.socials
  const account = user.account
  return (
    <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="flex-1 flex flex-col p-8">
        <Avatar src={user.image} className="w-32 h-32 mx-auto" />
        <h3 className="mt-6 text-gray-900 text-sm font-medium">{user.name}</h3>
        <dl className="mt-1 flex-grow flex flex-col justify-between">
          <dt className="sr-only">Bio</dt>
          <dd className="text-gray-500 text-sm">
            {account.bio ? account.bio : 'Coderplex User'}
          </dd>
          <dt className="sr-only">Role</dt>
          <dt className="sr-only">Social Media</dt>
          {socials && (
            <dd className="mt-3">
              <ul className="flex space-x-5 justify-center items-center">
                {socials.github && (
                  <li>
                    <A
                      href={`https://github.com/${socials.github}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">GitHub</span>
                      <IconBrandGithub className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.facebook && (
                  <li>
                    <A
                      href={`https://facebook.com/${socials.facebook}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Facebook</span>
                      <IconBrandFacebook className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.twitter && (
                  <li>
                    <A
                      href={`https://twitter.com/${socials.twitter}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Twitter</span>
                      <IconBrandTwitter className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.linkedin && (
                  <li>
                    <A
                      href={`https://linkedin.com/in/${socials.linkedin}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <IconBrandLinkedin className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.codepen && (
                  <li>
                    <A
                      href={`https://codepen.io/${socials.codepen}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">CodePen</span>
                      <IconBrandCodepen className="w-5 h-5" />
                    </A>
                  </li>
                )}
              </ul>
            </dd>
          )}
        </dl>
      </div>

      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <A
              href={`/${user.username}`}
              className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
            >
              <IconExternalLink
                className="w-5 h-5text-gray-400"
                aria-hidden={true}
              />
              <span className="ml-3">Visit Profile</span>
            </A>
          </div>
        </div>
      </div>
    </li>
  )
}
