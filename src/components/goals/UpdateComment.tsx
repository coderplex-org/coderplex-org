import { Avatar } from '@/ui'
import React from 'react'
import { User } from 'src/pages/members'
import { Markdown } from '@/components'
import { DateTime } from 'luxon'

export type GoalUpdateType = {
  id: string
  description: string
  createdAt: DateTime
}

export default function UpdateComment({
  postedBy,
  children,
  postedOn,
  isLastComment = false,
}: {
  postedBy: User
  children: string
  postedOn: DateTime
  isLastComment?: boolean
}) {
  return (
    <li>
      <div className="relative pb-6">
        <div className="relative flex items-start space-x-3">
          <div className="relative">
            <Avatar src={postedBy.image} />
          </div>
          <div className="min-w-0 flex-1">
            <div>
              <div className="text-sm">
                <a href="/" className="font-medium text-gray-900">
                  {postedBy.account?.firstName ?? postedBy.name}
                </a>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Posted on{' '}
                <time dateTime={postedOn.toISO()}>
                  {postedOn.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
                </time>
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
