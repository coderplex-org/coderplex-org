import React, { ReactNode } from 'react'
import { User } from 'src/pages/members'
import { Goal } from '@/components'

export default function GoalFeed({
  user,
  goal,
  children,
}: {
  user: User
  goal: GoalType
  children: ReactNode
}) {
  return (
    <>
      <div className="py-8 xl:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
          <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
            <div>
              <div>
                <Goal.Title user={user}>{goal.title}</Goal.Title>
                <Goal.Meta className="mt-8 xl:hidden" user={user} />
                <Goal.Description>{goal.description}</Goal.Description>
              </div>
            </div>

            {children}
          </div>
          <Goal.Meta className="hidden xl:block xl:pl-8" user={user} />
        </div>
      </div>
    </>
  )
}

type GoalType = {
  title: string
  description: string
}
