import { Avatar, Button, Menu } from '@/ui'
import {
  ChatCenteredDots,
  DotsThreeOutlineVertical,
  Gear,
  Pencil,
  RocketLaunch,
  ThumbsUp,
  Trash,
  UserCircle,
  Users,
} from 'phosphor-react'
import * as React from 'react'
import { HomePageFeedUpdateType } from 'src/pages'
import { DateTime } from 'luxon'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import classNames from 'classnames'
import { useState, useRef } from 'react'
import { signIn, useSession } from 'next-auth/client'
import { User } from 'src/pages/members'
import useFollowUser from './profile/useFollowUser'
import {
  Markdown,
  A,
  Hero,
  AppNavBar,
  AppFooter,
  NewComment,
  NewGoal,
  NewUpdate,
  UpdateComment,
  UpdateComments,
  UpdateCommentsList,
  FollowModal,
  LikeModal,
  useLikes,
  EditUpdate,
  Goal,
} from '@/components'
import type { GoalResponse } from 'src/pages/[username]'
import { scrollToContentWithId } from 'src/utils'
import { IconBrandDiscord } from 'tabler-icons'
import toast, { Toaster } from 'react-hot-toast'
import ListModal from './modal/ListModal'

export function HomePageFeedUpdate({
  update,
  setGoalId,
}: {
  update: HomePageFeedUpdateType
  setGoalId: () => void
}) {
  const queryClient = useQueryClient()
  const [isInEditMode, setIsInEditMode] = useState(false)
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false)
  const [session] = useSession()
  const [showComments, setShowComments] = useState(false)
  const { postedBy, createdAt: createdAtInMillis, goal, description } = update
  const createdAt = DateTime.fromMillis(createdAtInMillis)
  const toastId = useRef('')

  const { mutate: deleteUpdate } = useMutation(
    () => {
      return fetch(`/api/fauna/goals/delete-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: update.id,
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
        toast.success('Deleted your update!!', {
          id: toastId.current,
          icon: <Trash className="text-danger-400" />,
        })
        queryClient.refetchQueries('/api/fauna/all-updates')
        queryClient.refetchQueries(['/api/fauna/recent-updates', goal.id])
      },
      onError: () => {
        toast.error('Something went wrong!!!', {
          id: toastId.current,
        })
      },
    }
  )

  const { count: likesCount, hasLiked, toggleLike } = useLikes({
    initialCount: update.likes.data.length,
    initialHasLiked: update.hasLiked,
    mutation: {
      endpoint: '/api/fauna/toggle-update-like',
      body: {
        updateId: update.id,
      },
    },
  })

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ListModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        users={update.likes.data}
      />
      <Toaster />
      <li
        className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg"
        id={`homepage-update-${update.id}`}
      >
        {isInEditMode ? (
          <EditUpdate
            update={update}
            goalId={goal.id}
            cancelEditMode={() => setIsInEditMode(false)}
            updateFromHomePage={true}
          />
        ) : (
          <>
            <article>
              <div>
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <A href={`/${postedBy.username}`}>
                      <Avatar src={postedBy.image} />
                    </A>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      <A
                        href={`/${postedBy.username}`}
                        className="hover:underline"
                      >
                        {postedBy.name}
                      </A>
                    </p>
                    <p className="text-sm text-gray-500">
                      <time dateTime={createdAt.toISO()}>
                        {createdAt.toLocaleString(DateTime.DATETIME_MED)}
                      </time>
                    </p>
                  </div>

                  {session && (session.user as User).id === update.postedBy.id && (
                    <div className="flex-shrink-0 self-center flex">
                      <div className="relative inline-block text-left">
                        <Menu
                          trigger={
                            <button className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600">
                              <span className="sr-only">
                                Open quick actions
                              </span>
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
                              deleteUpdate()
                              const id = toast.loading(
                                'Deleting your update...'
                              )
                              toastId.current = id
                            }}
                          >
                            Delete
                          </Menu.Item>
                        </Menu>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex">
                  <button
                    onClick={() => {
                      setGoalId()
                      scrollToContentWithId(`homepage-update-${update.id}`)
                    }}
                    className="hidden lg:block"
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-brand-100 text-brand-800 hover:text-brand-600">
                      🚀 Goal: {goal.title}
                    </span>
                  </button>
                  <A href={`/${postedBy.username}`} className="lg:hidden">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-brand-100 text-brand-800 hover:text-brand-600">
                      🚀 Goal: {goal.title}
                    </span>
                  </A>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700 space-y-4">
                <div className="prose max-w-none">
                  <Markdown>{description}</Markdown>
                </div>
              </div>
              <div className="mt-6 flex justify-between space-x-8">
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
                      user={postedBy}
                      isOpen={isLikeModalOpen}
                      setIsOpen={setIsLikeModalOpen}
                    />
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
                  {likesCount > 0 && (
                    <Button
                      variant="link"
                      onClick={() => setIsOpen(true)}
                      variantColor="brand"
                    >
                      See who liked
                    </Button>
                  )}
                </div>
              </div>
            </article>

            {showComments && (
              <>
                <UpdateComments>
                  <UpdateCommentsList>
                    {update.comments.data.map((comment, index) => (
                      <UpdateComment
                        updateId={update.id}
                        key={comment.id}
                        comment={comment}
                      >
                        {comment.description}
                      </UpdateComment>
                    ))}
                  </UpdateCommentsList>
                  {session && <NewComment updateId={update.id} />}
                </UpdateComments>
              </>
            )}
          </>
        )}
      </li>
    </>
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
  const [session, loading] = useSession()
  const [goalId, setgoalId] = useState('')
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <AppNavBar />
      </header>
      {!loading && !session && <Hero />}
      <div className="py-10 flex-1">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="hidden xl:block xl:col-span-2">
            <HomePageSideNavBar />
          </div>
          <main className="lg:col-span-7 xl:col-span-6 px-2">
            <div className="space-y-3">
              {showGoal ? (
                <div className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
                  <div className="flex">
                    <A href={`${(session.user as User).username}`}>
                      <span className="block text-base text-center text-brand-600 font-semibold tracking-wide">
                        <span className="rounded-md bg-brand-100 text-brand-800 hover:text-brand-600 px-2.5 py-1.5 ml-2">
                          🚀 Your Goal: {'  '} {goal.title}
                        </span>
                      </span>
                    </A>
                  </div>
                  <NewUpdate goal={goal} updateFromHomePage={true} />
                </div>
              ) : (
                session && (
                  <>
                    <div className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
                      <div className="flex">
                        <span className="block text-lg text-center text-brand-600 font-semibold tracking-wide">
                          🚀 Set Goal:
                        </span>
                      </div>
                      <NewGoal />
                    </div>
                  </>
                )
              )}
              <div>
                <h1 className="sr-only">Recent updates</h1>
                <ul className="space-y-4">
                  {updates.map((update: HomePageFeedUpdateType) => (
                    <HomePageFeedUpdate
                      update={update}
                      key={update.id}
                      setGoalId={() => setgoalId(update.goal.id)}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </main>
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <HomePageAside goalId={goalId} />
          </aside>
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
        className="sticky top-20 divide-y divide-gray-300"
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

              <A
                href="/chat"
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="false"
              >
                <IconBrandDiscord className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span className="truncate">Our Chatroom</span>
              </A>
            </>
          )}
          {!session && (
            <>
              <A
                href="/members"
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="false"
              >
                <Users className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span className="truncate">Members</span>
              </A>
              <A
                href="/chat"
                target="_blank"
                className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                aria-current="false"
              >
                <IconBrandDiscord className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                <span className="truncate">Our Chatroom</span>
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
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false)
  return (
    <li className="flex items-center py-4 space-x-3">
      <div className="flex-shrink-0">
        <img className="h-8 w-8 rounded-full" src={user.image} alt="" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <A href={`/${user.username}`}>{user.account?.firstName}</A>
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
              setIsFollowModalOpen(true)
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
      {!session && (
        <FollowModal
          user={user}
          isOpen={isFollowModalOpen}
          setIsOpen={setIsFollowModalOpen}
        />
      )}
    </li>
  )
}

function HomePageAside({ goalId }: { goalId: string }) {
  const [session] = useSession()
  const { isLoading, isError, data } = useQuery(
    ['/api/fauna/recent-updates', goalId],
    () => {
      if (!goalId) {
        return
      }
      return fetch(`/api/fauna/recent-updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      })
    }
  )
  const {
    isLoading: isWhoToFollowLoading,
    isError: isWhoToFollowError,
    data: whoToFollowResponse,
  } = useQuery('api/fauna/who-to-follow', () => {
    return fetch(`/api/fauna/who-to-follow`).then((res) => res.json())
  })

  const shouldShowRecentUpdates =
    Boolean(goalId) && goalId !== '' && !isLoading && !isError
  const goal: GoalResponse = data?.response ?? {}

  return (
    <>
      <div className="sticky top-20 space-y-4">
        {Boolean(goalId) && (
          <section
            aria-labelledby="trending-heading"
            className="max-h-150 overflow-y-auto"
          >
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {isLoading && <p>loading...</p>}
                {isError && <p>Something went wrong!!!</p>}
                {shouldShowRecentUpdates && (
                  <>
                    <Goal.Title
                      createdBy={goal.createdBy}
                      showEditButton={false}
                    >
                      {goal.title}
                    </Goal.Title>
                    <Goal.Description>{goal.description}</Goal.Description>
                    <Goal.Updates>
                      <Goal.UpdatesList>
                        {goal.updates.data.map((update, index) => (
                          <Goal.Update
                            postedBy={update.postedBy}
                            key={update.id}
                            postedOn={DateTime.fromMillis(update.createdAt)}
                            isLastUpdate={
                              index === goal.updates.data.length - 1
                            }
                          >
                            {update.description}
                          </Goal.Update>
                        ))}
                      </Goal.UpdatesList>
                    </Goal.Updates>
                    <div className="mt-6">
                      <A
                        href={`/${goal.createdBy.username}`}
                        className="w-full block text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View more details
                      </A>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
        {!isWhoToFollowLoading &&
          !isWhoToFollowError &&
          whoToFollowResponse.users.length > 0 && (
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
                      {whoToFollowResponse.users.map((user: User) => (
                        <React.Fragment key={user.id}>
                          <FollowButton user={user} />
                        </React.Fragment>
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
          )}
      </div>
    </>
  )
}
