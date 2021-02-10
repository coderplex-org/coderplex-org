import React, { ReactNode } from 'react'
import { User } from 'src/pages/members'
import { IconEdit } from 'tabler-icons'
import { Button } from '@/ui'
import { GoalMeta, Markdown } from '@/components'

function GoalDescription({ children }: { children: string }) {
  return (
    <div className="py-3 xl:pt-6 xl:pb-0">
      <h2 className="sr-only">Description</h2>
      <div className="prose max-w-none">
        <Markdown>{children}</Markdown>
      </div>
    </div>
  )
}

function GoalTitle({ children, user }: { children: string; user: User }) {
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

export default function GoalFeed({
  user,
  goal,
  children,
}: {
  user: User
  goal: Goal
  children: ReactNode
}) {
  return (
    <>
      <div className="py-8 xl:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
          <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
            <div>
              <div>
                <GoalTitle user={user}>{goal.title}</GoalTitle>
                <GoalMeta className="mt-8 xl:hidden" user={user} />
                <GoalDescription>{goal.description}</GoalDescription>
              </div>
            </div>

            {children}
          </div>
          <GoalMeta className="hidden xl:block xl:pl-8" user={user} />
        </div>
      </div>
    </>
  )
}

type Goal = {
  title: string
  description: string
}
