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
import { A, FollowModal } from '@/components'
import { Button } from '@/ui'
import useFollowUser from './useFollowUser'
import { useSession } from 'next-auth/client'

export default function Profile({ user }: { user: User }) {
  const [session, loading] = useSession()
  const { shouldShowFollowButton, toggleFollow } = useFollowUser(user.id)
  const [isHoveringFollowButton, setIsHoveringFollowButton] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isFollowing, setIsFollowing] = useState(user.isFollowing)

  const toggle = () => {
    setIsFollowing(!isFollowing)
    toggleFollow()
  }

  return (
    <div className="rounded-lg bg-white overflow-hidden shadow">
      <h2 className="sr-only" id="profile-overview-title">
        Profile Overview
      </h2>
      <div className="bg-white p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5 sm:items-center">
            <div className="flex-shrink-0">
              <A href={user.username}>
                <img
                  className="mx-auto h-20 w-20 rounded-full"
                  src={user.image}
                  alt={user.account?.firstName ?? user.username}
                />
              </A>
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                {user.account?.firstName}
              </p>
              <p className="text-sm font-medium text-gray-600">
                {user.account?.bio}
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

          {!shouldShowFollowButton ? (
            <div className="mt-5 flex justify-center sm:mt-0">
              <a
                href="/profile/settings"
                className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit profile
              </a>
            </div>
          ) : (
            <div className="mt-5 flex justify-center sm:mt-0">
              {isFollowing ? (
                <>
                  <Button
                    onClick={() => toggle()}
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
                  <Button
                    onClick={() => {
                      if (!session) {
                        setIsModalOpen(true)
                        return
                      }
                      toggle()
                    }}
                  >
                    Follow
                  </Button>
                  <FollowModal
                    user={user}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
