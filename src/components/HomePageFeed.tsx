import { Avatar } from '@/ui'
import {
  ChatCenteredDots,
  Gear,
  RocketLaunch,
  ShareNetwork,
  ThumbsUp,
  UserCircle,
  Users,
} from 'phosphor-react'
import { HomePageFeedUpdateType } from 'src/pages'
import { DateTime } from 'luxon'
import { Markdown, A } from '@/components'
import { useMutation, useQuery } from 'react-query'
import classNames from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { signIn, useSession } from 'next-auth/client'
import {
  NewComment,
  NewUpdate,
  UpdateComment,
  UpdateComments,
  UpdateCommentsList,
} from './goals'
import { User } from 'src/pages/members'
import AppNavBar from './AppNavBar'
import AppFooter from './AppFooter'
import useFollowUser from './profile/useFollowUser'

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

export function HomePageFeedUpdate({
  update,
}: {
  update: HomePageFeedUpdateType
}) {
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
          <div className="pbrand pbrand max-w-none">
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
            {session && <NewComment updateId={update.id} />}
          </UpdateComments>
        </>
      )}
    </li>
  )
}

export default function HomePageFeed({
  updates,
  goal,
  showGoal,
}: {
  updates: HomePageFeedUpdateType[]
  goal?: {
    id: string
    title: string
  }
  showGoal: boolean
}) {
  const [session] = useSession()
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <AppNavBar />
      </header>
      <div className="py-10 flex-1">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <HomePageSideNavBar />
          </div>
          <main className="lg:col-span-9 xl:col-span-6">
            <div className="space-y-3">
              {showGoal && (
                <div className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
                  <div className="flex">
                    <A href={`${(session.user as User).username}`}>
                      <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide">
                        🚀 Your Goal:
                        <span className="rounded-md bg-brand-100 text-brand-800 hover:text-brand-600 px-2.5 py-1.5 ml-2">
                          {goal.title}
                        </span>
                      </span>
                    </A>
                  </div>
                  <NewUpdate goal={goal} updateFromHomePage={true} />
                </div>
              )}
              <div>
                <h1 className="sr-only">Recent questions</h1>
                <ul className="space-y-4">
                  {updates.map((update: HomePageFeedUpdateType) => (
                    <HomePageFeedUpdate update={update} key={update.id} />
                  ))}
                </ul>
              </div>
            </div>
          </main>
          <HomePageAside updates={updates.slice(0, 3)} />
        </div>
      </div>

      <AppFooter />
    </div>
  )
}

function HomePageSideNavBar() {
  const [session] = useSession()
  return (
    <>
      <nav
        aria-label="Sidebar"
        className="sticky top-4 divide-y divide-gray-300"
      >
        <div className="pb-8 space-y-1">
          {session && (
            <>
              <A
                href={`/${(session.user as User).username}`}
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="page"
              >
                <UserCircle className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span className="truncate">Your Profile</span>
              </A>

              <A
                href={`/${(session.user as User).username}`}
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="page"
              >
                <RocketLaunch className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />

                <span className="truncate">Your Goal</span>
              </A>

              <A
                href="/profile/settings"
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="false"
              >
                <Gear className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span className="truncate">Settings</span>
              </A>
            </>
          )}
          {!session && (
            <>
              <button
                onClick={() => signIn('github')}
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="false"
              >
                <RocketLaunch className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span className="truncate">Get Started</span>
              </button>
              <A
                href="/members"
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="false"
              >
                <Users className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span className="truncate">Members</span>
              </A>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

function FollowButton({ user }: { user: User }) {
  const [session] = useSession()
  const { toggleFollow } = useFollowUser(user.id)
  const [isFollowing, setIsFollowing] = useState(false)
  return (
    <li className="flex items-center py-4 space-x-3">
      <div className="flex-shrink-0">
        <img className="h-8 w-8 rounded-full" src={user.image} alt="" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <A href={`/${user.username}`}>
            {user.account?.firstName ?? user.name}
          </A>
        </p>
        <p className="text-sm text-gray-500">
          <A href={`/${user.username}`}>@{user.username}</A>
        </p>
      </div>
      <div className="flex-shrink-0">
        <button
          type="button"
          className="inline-flex items-center px-3 py-0.5 rounded-full bg-brand-50 text-sm font-medium text-brand-700 hover:bg-brand-100"
          onClick={() => {
            if (!session) {
              signIn('github')
              return
            }
            setIsFollowing(true)
            toggleFollow()
          }}
        >
          {!isFollowing && (
            <svg
              className="-ml-1 mr-0.5 h-5 w-5 text-brand-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          )}

          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </button>
      </div>
    </li>
  )
}

function HomePageAside({ updates }: { updates: HomePageFeedUpdateType[] }) {
  const [session] = useSession()
  const { isLoading, isError, data: response } = useQuery(
    'api/fauna/who-to-follow',
    () => {
      return fetch(`/api/fauna/who-to-follow`).then((res) => res.json())
    }
  )

  return (
    <>
      <aside className="hidden xl:block xl:col-span-4">
        <div className="sticky top-4 space-y-4">
          <section aria-labelledby="trending-heading">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2
                  id="trending-heading"
                  className="text-base font-medium text-gray-900"
                >
                  Recent Updates
                </h2>
                <div className="mt-6 flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {updates.map((update) => (
                      <li className="flex py-4 space-x-3" key={update.id}>
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={update.postedBy.image}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800">
                            {update.description}
                          </p>
                          <div className="mt-2 flex">
                            <span className="inline-flex items-center text-sm">
                              <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                <ChatCenteredDots className="h-5 w-5" />
                                <span className="font-medium text-gray-900">
                                  {update.comments.data.length}
                                </span>
                              </button>
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {session ? (
                  <div className="mt-6">
                    <A
                      href={`/${(session.user as User).username}`}
                      className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View all
                    </A>
                  </div>
                ) : (
                  <div className="mt-6">
                    <button
                      onClick={() => signIn('github')}
                      className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Join
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="who-to-follow-heading">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2
                  id="who-to-follow-heading"
                  className="text-base font-medium text-gray-900"
                >
                  Who to follow
                </h2>
                <div className="mt-6 flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {!isLoading &&
                      !isError &&
                      response.users.map((user: User) => (
                        <FollowButton user={user} key={user.id} />
                      ))}
                  </ul>
                </div>
                <div className="mt-6">
                  {session ? (
                    <A
                      href="/members"
                      className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View all
                    </A>
                  ) : (
                    <button
                      onClick={() => signIn('github')}
                      className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}
