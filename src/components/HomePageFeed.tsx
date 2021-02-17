import { Avatar } from '@/ui'
import { ChatCenteredDots, ShareNetwork, ThumbsUp } from 'phosphor-react'
import { HomePageFeedUpdateType } from 'src/pages'
import { DateTime } from 'luxon'
import { Markdown, A } from '@/components'
import { useMutation, useQuery } from 'react-query'
import classNames from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { useSession } from 'next-auth/client'
import {
  NewComment,
  UpdateComment,
  UpdateComments,
  UpdateCommentsList,
} from './goals'

type LikeData = {
  count: number
  hasLiked: boolean
}
const initialState: LikeData = { count: 0, hasLiked: false }

function reducer(state: LikeData, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'toggle':
      return {
        hasLiked: !state.hasLiked,
        count: state.hasLiked
          ? Number(state.count) - 1
          : Number(state.count) + 1,
      }
    case 'set':
      return { count: action.payload.count, hasLiked: action.payload.hasLiked }
    default:
      throw new Error()
  }
}

function HomePageFeedUpdate({ update }: { update: HomePageFeedUpdateType }) {
  const [session, loading] = useSession()
  const [showComments, setShowComments] = useState(false)
  const { postedBy, createdAt: createdAtInMillis, goal, description } = update
  const createdAt = DateTime.fromMillis(createdAtInMillis)
  const { isLoading, isError, data } = useQuery(
    ['api/fauna/has-liked', update.id],
    () => {
      return fetch(`/api/fauna/has-liked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updateId: update.id,
        }),
      }).then((res) => res.json())
    }
  )
  const { mutate } = useMutation(() => {
    return fetch(`/api/fauna/toggle-like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updateId: update.id,
      }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('something went wrong!!!')
      }
      return res.json()
    })
  })

  const [{ count: likesCount, hasLiked }, dispatch] = useReducer(
    reducer,
    initialState
  )

  useEffect(() => {
    if (!isLoading && !isError) {
      dispatch({
        type: 'set',
        payload: { hasLiked: data.liked, count: update.likes.data },
      })
    }
  }, [data?.liked, isError, isLoading, update.likes.data])

  return (
    <li className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
      <article aria-labelledby="question-title-81614">
        <div>
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <A href={`/${postedBy.username}`}>
                <Avatar src={postedBy.image} />
              </A>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                <A href={`/${postedBy.username}`} className="hover:underline">
                  {postedBy.name}
                </A>
              </p>
              <p className="text-sm text-gray-500">
                <time dateTime={createdAt.toISO()}>
                  {createdAt.toLocaleString(DateTime.DATETIME_MED)}
                </time>
              </p>
            </div>
          </div>
          <div className="mt-4 flex">
            <A href={`${postedBy.username}`}>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-brand-100 text-brand-800 hover:text-brand-600">
                🚀 Goal: {goal.title}
              </span>
            </A>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-700 space-y-4">
          <div className="prose prose max-w-none">
            <Markdown>{description}</Markdown>
          </div>
        </div>
        <div className="mt-6 flex justify-between space-x-8">
          <div className="flex space-x-6">
            <span className="inline-flex items-center text-sm">
              <button
                className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                onClick={() => {
                  if (session) {
                    dispatch({ type: 'toggle' })
                    mutate()
                  }
                }}
              >
                <ThumbsUp
                  className={classNames(
                    'h-5 w-5',
                    hasLiked && 'text-brand-600'
                  )}
                  weight={hasLiked ? 'bold' : 'regular'}
                />
                <span className="font-medium text-gray-900">{likesCount}</span>
                <span className="sr-only">likes</span>
              </button>
            </span>
            <span className="inline-flex items-center text-sm">
              <button
                className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                onClick={() => setShowComments(!showComments)}
              >
                <ChatCenteredDots className="h-5 w-5" />
                <span className="font-medium text-gray-900">
                  {update.comments.data.length}
                </span>
                <span className="sr-only">replies</span>
              </button>
            </span>
          </div>
          <div className="flex text-sm">
            <span className="inline-flex items-center text-sm">
              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                <ShareNetwork className="h-5 w-5" />
                <span className="font-medium text-gray-900">Share</span>
              </button>
            </span>
          </div>
        </div>
      </article>

      {showComments && (
        <>
          <UpdateComments>
            <UpdateCommentsList>
              {update.comments.data.map((comment, index) => (
                <UpdateComment
                  key={comment.id}
                  postedBy={comment.postedBy}
                  postedOn={DateTime.fromMillis(comment.createdAt)}
                  isLastComment={index === update.comments.data.length - 1}
                >
                  {comment.description}
                </UpdateComment>
              ))}
            </UpdateCommentsList>
            <NewComment updateId={update.id} />
          </UpdateComments>
        </>
      )}
    </li>
  )
}

export default function HomePageFeed({
  updates,
}: {
  updates: HomePageFeedUpdateType[]
}) {
  return (
    <>
      <div className="mt-4">
        <h1 className="sr-only">Recent updates</h1>
        <ul className="space-y-4">
          {updates.map((update) => (
            <HomePageFeedUpdate update={update} key={update.id} />
          ))}
        </ul>
      </div>
    </>
  )
}
