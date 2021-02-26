import React, { ReactNode, useState } from 'react'
import { User } from 'src/pages/members'
import { Goal } from '@/components'
import { DateTime } from 'luxon'
import EditGoal from './EditGoal'
import { useSession } from 'next-auth/client'

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
  const [session] = useSession()
  const [isEditing, setIsEditing] = useState(false)
  return (
    <>
      <div className="py-8 xl:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
          <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
            <div>
              <div>
                {isEditing && (
                  <EditGoal
                    goal={goal}
                    onCancelClick={() => setIsEditing(false)}
                  />
                )}

                {!isEditing && (
                  <Goal.Title
                    createdBy={createdBy}
                    onEditClick={() => setIsEditing(true)}
                    showEditButton={
                      session && (session.user as User).id === createdBy.id
                    }
                  >
                    {goal.title}
                  </Goal.Title>
                )}
                {!isEditing && (
                  <Goal.Description>{goal.description}</Goal.Description>
                )}

                <Goal.Meta
                  className="mt-8 xl:hidden"
                  participants={participants}
                  createdAt={createdAt}
                  updatesCount={updatesCount}
                  deadline={goal.deadline}
                />
              </div>
            </div>

            {children}
          </div>
          <Goal.Meta
            className="hidden xl:block xl:pl-8"
            participants={participants}
            createdAt={createdAt}
            updatesCount={updatesCount}
            deadline={goal.deadline}
          />
        </div>
      </div>
    </>
  )
}

export type GoalType = {
  id: string
  title: string
  description: string
  creatorId: string
  deadline: DateTime
}
