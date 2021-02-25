import { Avatar, Menu } from '@/ui'
import React, { useState } from 'react'
import { Markdown, A, LikeModal, useLikes, EditComment } from '@/components'
import { DateTime } from 'luxon'
import { UpdateCommentType } from 'src/pages'
import { useSession } from 'next-auth/client'
import classNames from 'classnames'
import {
  DotsThreeOutlineVertical,
  Pencil,
  ThumbsUp,
  Trash,
} from 'phosphor-react'
import { User } from 'src/pages/members'

export type GoalUpdateType = {
  id: string
  description: string
  createdAt: DateTime
}

export default function UpdateComment({
  updateId,
  comment,
  children,
  isLastComment = false,
}: {
  updateId: string
  children: string
  comment: UpdateCommentType
  isLastComment?: boolean
}) {
  const [isInEditMode, setIsInEditMode] = useState(false)
  const postedOn = DateTime.fromMillis(comment.createdAt)
  const [session] = useSession()
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false)
  const { count: likesCount, hasLiked, toggleLike } = useLikes({
    initialCount: comment.likes.data,
    query: {
      key: ['api/fauna/has-liked-comment', comment.id],
      endpoint: '/api/fauna/has-liked-comment',
      body: {
        commentId: comment.id,
      },
    },
    mutation: {
      endpoint: '/api/fauna/toggle-comment-like',
      body: {
        commentId: comment.id,
      },
    },
  })
  return (
    <li>
      {isInEditMode ? (
        <EditComment
          updateId={updateId}
          comment={comment}
          cancelEditMode={() => setIsInEditMode(false)}
        />
      ) : (
        <div className="relative pb-6">
          <div className="relative flex items-start space-x-3">
            <div className="relative">
              <A href={`/${comment.postedBy.username}`}>
                <Avatar
                  src={comment.postedBy.image}
                  alt={comment.postedBy.account?.firstName}
                />
              </A>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <div className="text-sm">
                    <a
                      href={`/${comment.postedBy.username}`}
                      className="font-medium text-gray-900"
                    >
                      {comment.postedBy.account?.firstName ??
                        comment.postedBy.name}
                    </a>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Posted on{' '}
                    <time dateTime={postedOn.toISO()}>
                      {postedOn.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
                    </time>
                  </p>
                </div>
                {session && (session.user as User).id === comment.postedBy.id && (
                  <div className="flex-shrink-0 self-center flex">
                    <div className="relative inline-block text-left">
                      <Menu
                        trigger={
                          <button className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Open quick actions</span>
                            <DotsThreeOutlineVertical
                              className="h-5 w-5"
                              aria-hidden={true}
                            />
                          </button>
                        }
                      >
                        <Menu.Item
                          icon={Pencil}
                          onClick={() => setIsInEditMode(true)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          icon={Trash}
                          onClick={() => {
                            // deleteUpdate()
                            // const id = toast.loading('Deleting your update...')
                            // toastId.current = id
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <div className="prose prose-sm max-w-none">
                  <Markdown>{children}</Markdown>
                </div>
              </div>

              <div className="mt-3 flex justify-between space-x-8">
                <div className="flex space-x-6">
                  <span className="inline-flex items-center text-sm">
                    <button
                      className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                      onClick={() => {
                        if (!session) {
                          setIsLikeModalOpen(true)
                          return
                        }
                        toggleLike()
                      }}
                    >
                      <ThumbsUp
                        className={classNames(
                          'h-5 w-5',
                          hasLiked && 'text-brand-600'
                        )}
                        weight={hasLiked ? 'bold' : 'regular'}
                      />
                      <span className="font-medium text-gray-900">
                        {likesCount}
                      </span>
                      <span className="sr-only">likes</span>
                    </button>
                    <LikeModal
                      user={comment.postedBy}
                      isOpen={isLikeModalOpen}
                      setIsOpen={setIsLikeModalOpen}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
