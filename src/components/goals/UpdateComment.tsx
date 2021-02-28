import { Avatar, Menu } from '@/ui'
import React, { useRef, useState } from 'react'
import { Markdown, A, LikeModal, useLikes, EditComment } from '@/components'
import { DateTime } from 'luxon'
import { HomePageFeedUpdateType, UpdateCommentType } from 'src/pages'
import { useSession } from 'next-auth/client'
import classNames from 'classnames'
import {
  DotsThreeOutlineVertical,
  Pencil,
  ThumbsUp,
  Trash,
} from 'phosphor-react'
import { User } from 'src/pages/members'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import ListModal from '../modal/ListModal'

export type GoalUpdateType = {
  id: string
  description: string
  createdAt: DateTime
}

export default function UpdateComment({
  comment,
  children,
}: {
  children: string
  comment: UpdateCommentType
}) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isInEditMode, setIsInEditMode] = useState(false)
  const postedOn = DateTime.fromMillis(comment.createdAt)
  const [session] = useSession()
  const toastId = useRef('')
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false)
  const { count: likesCount, hasLiked, toggleLike } = useLikes({
    initialCount: comment.likes.data.length,
    initialHasLiked: comment.hasLiked,
    updateId: comment.updateId,
    commentId: comment.id,
    type: 'COMMENT_LIKE',
    mutation: {
      endpoint: '/api/fauna/toggle-comment-like',
      body: {
        commentId: comment.id,
      },
    },
  })
  const { mutate: deleteComment } = useMutation(
    () => {
      return fetch(`/api/fauna/goals/delete-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: comment.id,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('something went wrong!!!')
        }
        return res.json()
      })
    },
    {
      onSuccess: () => {
        toast.success('Deleted your comment!!', {
          id: toastId.current,
          icon: <Trash className="text-danger-400" />,
        })
        if (queryClient.getQueryState('/api/fauna/all-updates')) {
          queryClient.setQueryData<{ updates: HomePageFeedUpdateType[] }>(
            '/api/fauna/all-updates',
            (oldData) => ({
              updates: oldData.updates.map((_update) => {
                if (_update.id === comment.updateId) {
                  _update.comments.data = _update.comments.data.filter(
                    (_comment) => _comment.id !== comment.id
                  )
                }
                return _update
              }),
            })
          )
        }
      },
      onError: () => {
        toast.error('Something went wrong!!!', {
          id: toastId.current,
        })
      },
    }
  )
  return (
    <>
      <ListModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        users={comment.likes.data}
      />
      <li>
        {isInEditMode ? (
          <EditComment
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
                        {postedOn.toLocaleString(
                          DateTime.DATE_MED_WITH_WEEKDAY
                        )}
                      </time>
                    </p>
                  </div>

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
                        {session &&
                          (session.user as User).id === comment.postedBy.id && (
                            <>
                              <Menu.Item
                                icon={Pencil}
                                onClick={() => setIsInEditMode(true)}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item
                                icon={Trash}
                                onClick={() => {
                                  deleteComment()
                                  const id = toast.loading(
                                    'Deleting your comment...'
                                  )
                                  toastId.current = id
                                }}
                              >
                                Delete
                              </Menu.Item>
                            </>
                          )}

                        <Menu.Item
                          icon={ThumbsUp}
                          onClick={() => setIsOpen(true)}
                        >
                          See who liked
                        </Menu.Item>
                      </Menu>
                    </div>
                  </div>
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
    </>
  )
}
