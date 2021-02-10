import React, { ReactNode } from 'react'
import { User } from 'src/pages/members'
import { Goal } from '@/components'
import { DateTime } from 'luxon'

export default function GoalFeed({
  createdBy,
  goal,
  children,
  participants,
  createdAt,
  updatesCount,
}: {
  createdBy: User
  goal: GoalType
  children: ReactNode
  participants: User[]
  createdAt: DateTime
  updatesCount: number
}) {
  return (
    <>
      <div className="py-8 xl:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
          <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
            <div>
              <div>
                <Goal.Title createdBy={createdBy}>{goal.title}</Goal.Title>
                <Goal.Meta
                  className="mt-8 xl:hidden"
                  participants={participants}
                  createdAt={createdAt}
                  updatesCount={updatesCount}
                />
                <Goal.Description>{goal.description}</Goal.Description>
              </div>
            </div>

            {children}
          </div>
          <Goal.Meta
            className="hidden xl:block xl:pl-8"
            participants={participants}
            createdAt={createdAt}
            updatesCount={updatesCount}
          />
        </div>
      </div>
    </>
  )
}

type GoalType = {
  title: string
  description: string
}
