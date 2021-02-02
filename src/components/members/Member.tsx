import { Avatar } from '@/ui'
import { User } from 'src/pages/members'
import { IconExternalLink } from 'tabler-icons'
import A from '../A'

export default function Member({ user }: { user: User }) {
  return (
    <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="flex-1 flex flex-col p-8">
        <Avatar src={user.image} className="w-32 h-32 mx-auto" />
        <h3 className="mt-6 text-gray-900 text-sm font-medium">{user.name}</h3>
        <dl className="mt-1 flex-grow flex flex-col justify-between">
          {/* <dt className="sr-only">Title</dt>
          <dd className="text-gray-500 text-sm">{user.email}</dd> */}
          <dt className="sr-only">Role</dt>
          <dd className="mt-3">
            <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
              Admin
            </span>
          </dd>
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
                className="w-5 h-5 text-gray-400"
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
