import { User } from 'src/pages/members'
import { IconEdit } from 'tabler-icons'
import { A } from '@/components'
import { Button } from '@/ui'

export default function GoalTitle({
  children,
  createdBy,
  onEditClick,
  showEditButton,
}: {
  children: string
  createdBy: User
  onEditClick: () => void
  showEditButton: boolean
}) {
  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:border-gray-200 xl:pb-6">
      <div>
        <h1>
          <span className="block text-sm text-brand-600 font-semibold tracking-wide uppercase">
            Goal
          </span>
          <span className="text-2xl font-bold text-gray-900">{children}</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Created by{' '}
          <A
            href={`/${createdBy.username}`}
            className="font-medium text-gray-900"
          >
            {createdBy.account?.firstName ?? createdBy.name}
          </A>{' '}
        </p>
      </div>
      <div className="mt-4 flex space-x-3 md:mt-0">
        {showEditButton && (
          <Button leadingIcon={IconEdit} onClick={() => onEditClick()}>
            Edit
          </Button>
        )}
      </div>
    </div>
  )
}
