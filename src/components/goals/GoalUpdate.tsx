import { Avatar } from '@/ui'
import React from 'react'
import { User } from 'src/pages/members'
import { Markdown } from '@/components'
import { DateTime } from 'luxon'

export type GoalUpdateType = {
  description: string
  createdAt: DateTime
}

export default function GoalUpdate({
  user,
  update,
  children,
}: {
  user: User
  update: GoalUpdateType
  children: string
}) {
  return (
    <li>
      <div className="relative pb-8">
        <span
          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        ></span>
        <div className="relative flex items-start space-x-3">
          <div className="relative">
            <Avatar src={user.image} />
          </div>
          <div className="min-w-0 flex-1">
            <div>
              <div className="text-sm">
                <a href="/" className="font-medium text-gray-900">
                  {user.account?.firstName ?? user.name}
                </a>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Posted on{' '}
                {update.createdAt.toLocaleString(
                  DateTime.DATE_MED_WITH_WEEKDAY
                )}
              </p>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <div className="prose prose-sm max-w-none">
                <Markdown>{children}</Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
