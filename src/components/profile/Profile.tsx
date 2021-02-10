import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { User } from 'src/pages/members'
import {
  IconBrandCodepen,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconExternalLink,
} from 'tabler-icons'
import { A } from '@/components'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Button } from '@/ui'

export default function Profile({ user }: { user: User }) {
  const queryClient = useQueryClient()
  const [session, loading] = useSession()
  const [currentUser, setCurrentUser] = useState<User>({})
  const [isHoveringFollowButton, setIsHoveringFollowButton] = useState(false)

  useEffect(() => {
    if (!loading && session) {
      setCurrentUser(session.user)
    }
  }, [loading, session])

  const { data: isFollowingData } = useQuery(
    ['/api/isFollowing', currentUser?.id, user.id],
    () => {
      if (!session) {
        return () => {}
      }
      return fetch(`/api/fauna/is-following`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      })
    }
  )

  const { mutate: followUser } = useMutation(
    () =>
      fetch(`/api/fauna/follow-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ['/api/isFollowing', currentUser?.id, user.id],
        })
      },
    }
  )
  const { mutate: unFollowUser } = useMutation(
    () =>
      fetch(`/api/fauna/unfollow-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ['/api/isFollowing', currentUser?.id, user.id],
        })
      },
    }
  )

  return (
    <div className="rounded-lg bg-white overflow-hidden shadow">
      <h2 className="sr-only" id="profile-overview-title">
        Profile Overview
      </h2>
      <div className="bg-white p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5 sm:items-center">
            <div className="flex-shrink-0">
              <img
                className="mx-auto h-20 w-20 rounded-full"
                src={user.image}
                alt=""
              />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                {user.account?.firstName ?? user.name}
              </p>
              <p className="text-sm font-medium text-gray-600">
                {user.account?.bio ?? 'Coderplex User'}
              </p>

              <div>
                <ul className="flex space-x-1.5 mt-1 items-center justify-center sm:justify-start">
                  {user.socials?.github && (
                    <li>
                      <A
                        href={`https://github.com/${user.socials.github}`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">GitHub</span>
                        <IconBrandGithub className="w-5 h-5" />
                      </A>
                    </li>
                  )}
                  {user.socials?.facebook && (
                    <li>
                      <A
                        href={`https://facebook.com/${user.socials.facebook}`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Facebook</span>
                        <IconBrandFacebook className="w-5 h-5" />
                      </A>
                    </li>
                  )}
                  {user.socials?.twitter && (
                    <li>
                      <A
                        href={`https://twitter.com/${user.socials.twitter}`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Twitter</span>
                        <IconBrandTwitter className="w-5 h-5" />
                      </A>
                    </li>
                  )}
                  {user.socials?.linkedin && (
                    <li>
                      <A
                        href={`https://linkedin.com/in/${user.socials.linkedin}`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <IconBrandLinkedin className="w-5 h-5" />
                      </A>
                    </li>
                  )}
                  {user.socials?.codepen && (
                    <li>
                      <A
                        href={`https://codepen.io/${user.socials.codepen}`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">CodePen</span>
                        <IconBrandCodepen className="w-5 h-5" />
                      </A>
                    </li>
                  )}
                  {user.socials?.blog && (
                    <li>
                      <A
                        href={user.socials?.blog}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Blog</span>
                        <IconExternalLink className="w-5 h-5" />
                      </A>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {currentUser.username === user.username ? (
            <div className="mt-5 flex justify-center sm:mt-0">
              <a
                href="/profile/settings"
                className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit profile
              </a>
            </div>
          ) : (
            session && (
              <div className="mt-5 flex justify-center sm:mt-0">
                {isFollowingData?.isFollowing ? (
                  <>
                    <Button
                      onClick={() => unFollowUser()}
                      variant="solid"
                      variantColor={isHoveringFollowButton ? 'danger' : 'brand'}
                      onMouseEnter={() => setIsHoveringFollowButton(true)}
                      onMouseLeave={() => setIsHoveringFollowButton(false)}
                    >
                      {isHoveringFollowButton ? 'Unfollow' : 'Following'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => followUser()}>Follow</Button>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
