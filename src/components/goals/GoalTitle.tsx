import { User } from 'src/pages/members'
import { IconEdit } from 'tabler-icons'
import { Button } from '../ui/button'

export default function GoalTitle({
  children,
  user,
}: {
  children: string
  user: User
}) {
  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
      <div>
        <h1>
          <span className="block text-sm text-indigo-600 font-semibold tracking-wide uppercase">
            Goal
          </span>
          <span className="text-2xl font-bold text-gray-900">{children}</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Created by{' '}
          <a href="/" className="font-medium text-gray-900">
            {user.account?.firstName ?? user.name}
          </a>{' '}
        </p>
      </div>
      <div className="mt-4 flex space-x-3 md:mt-0">
        <Button leadingIcon={IconEdit}>Edit</Button>
      </div>
    </div>
  )
}
