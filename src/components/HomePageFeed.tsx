import { Avatar, Menu } from '@/ui'
import {
  ChatCenteredDots,
  Code,
  DotsThreeOutlineVertical,
  Eye,
  Flag,
  ShareNetwork,
  Star,
  ThumbsUp,
} from 'phosphor-react'
import Link from 'next/link'
import { User } from 'src/pages/members'
import { HomePageFeedUpdateType } from 'src/pages'
import { DateTime } from 'luxon'
import { Markdown, A } from '@/components'
import { useMutation, useQuery } from 'react-query'
import classNames from 'classnames'
import { useEffect, useReducer } from 'react'
import { useSession } from 'next-auth/client'

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
  const { postedBy, createdAt: createdAtInMillis, goal, description } = update
  const createdAt = DateTime.fromMillis(createdAtInMillis)
  const { isLoading, isError, data } = useQuery(
    ['api/fauna/has-liked', update.id],
    () => {
      if (!session) {
        return { liked: false }
      }
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
    if (!session) {
      return Promise.resolve()
    }
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
            <Menu
              trigger={<DotsThreeOutlineVertical className="cursor-pointer" />}
              className="z-10 ml-3"
            >
              <Link href={'/'} passHref={true}>
                <Menu.Item icon={Star}>Add to favourites</Menu.Item>
              </Link>
              <Link href={'/'} passHref={true}>
                <Menu.Item icon={Code}>Embed</Menu.Item>
              </Link>
              <Link href={'/'} passHref={true}>
                <Menu.Item icon={Flag}>Report Content</Menu.Item>
              </Link>
            </Menu>
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
              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                <ChatCenteredDots className="h-5 w-5" />
                <span className="font-medium text-gray-900">11</span>
                <span className="sr-only">replies</span>
              </button>
            </span>
            <span className="inline-flex items-center text-sm">
              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                <Eye className="h-5 w-5" />
                <span className="font-medium text-gray-900">2.7k</span>
                <span className="sr-only">views</span>
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
    </li>
  )
}

export default function HomePageFeed({
  user = {},
  updates,
}: {
  user?: User
  updates: HomePageFeedUpdateType[]
}) {
  return (
    <>
      <div className="px-4 sm:px-0">
        <div className="sm:hidden">
          <label htmlFor="question-tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="question-tabs"
            className="block w-full rounded-md border-gray-300 text-base font-medium text-gray-900 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="#/recent">Recent</option>
            <option value="#/most-liked">Most Liked</option>
            <option value="#/most-answers">Most Answers</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav
            className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
            aria-label="Tabs"
          >
            <a
              href="/"
              aria-current="page"
              className="text-gray-900 rounded-l-lg  group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
            >
              <span>Recent</span>
              <span
                aria-hidden="true"
                className="bg-brand-500 absolute inset-x-0 bottom-0 h-0.5"
              ></span>
            </a>

            <a
              href="/"
              aria-current="false"
              className="text-gray-500 hover:text-gray-700   group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
            >
              <span>Most Liked</span>
              <span
                aria-hidden="true"
                className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"
              ></span>
            </a>

            <a
              href="/"
              aria-current="false"
              className="text-gray-500 hover:text-gray-700  rounded-r-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
            >
              <span>Most Answers</span>
              <span
                aria-hidden="true"
                className="bg-transparent absolute inset-x-0 bottom-0 h-0.5"
              ></span>
            </a>
          </nav>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="sr-only">Recent questions</h1>
        <ul className="space-y-4">
          {updates.map((update) => (
            <HomePageFeedUpdate update={update} key={update.id} />
          ))}
        </ul>
      </div>
    </>
  )
}
