import { Avatar } from '@/ui'
import React from 'react'
import { User } from 'src/pages/members'
import { Markdown } from '@/components'
import { DateTime } from 'luxon'
import type { UpdateCommentType } from 'src/pages/index'

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
  comments,
}: {
  postedBy: User
  children: string
  postedOn: DateTime
  isLastComment?: boolean
  comments: UpdateCommentType[]
}) {
  console.log({ arr: comments })
  return (
    <li>
      <div className="relative pb-8">
        {!isLastComment && (
          <span
            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          ></span>
        )}

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
      <ul className="ml-6 sm:ml-16">
        {comments?.map((comment, index) => (
          <UpdateComment
            key={comment.id}
            postedBy={comment.postedBy}
            postedOn={DateTime.fromMillis(comment.createdAt)}
            isLastComment={index === comments.length - 1}
            comments={comment.comments.data}
          >
            {comment.description}
          </UpdateComment>
        ))}
      </ul>
    </li>
  )
}
