import { Avatar, Button } from '@/ui'
import { User } from 'src/pages/members'
import {
  IconBrandCodepen,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconEdit,
  IconExternalLink,
  IconPlus,
} from 'tabler-icons'
import { A } from '@/components'
import useFollowUser from '../profile/useFollowUser'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FollowModal from '../FollowModal'
import { useSession } from 'next-auth/client'

export default function Member({ user }: { user: User }) {
  const [session] = useSession()
  const router = useRouter()
  const socials = user.socials
  const account = user.account
  const [isHoveringFollowButton, setIsHoveringFollowButton] = useState(false)
  const {
    shouldShowFollowButton,
    isFollowing: isFollowingData,
    toggleFollow,
    isLoading,
  } = useFollowUser(user.id)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isFollowing, setIsFollowing] = useState(false)
  useEffect(() => {
    if (!isLoading) {
      setIsFollowing(isFollowingData)
    }
  }, [isFollowingData, isLoading])

  const toggle = () => {
    setIsFollowing(!isFollowing)
    toggleFollow()
  }

  return (
    <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="flex-1 flex flex-col p-8">
        <Avatar src={user.image} className="w-32 h-32 mx-auto" />
        <h3 className="mt-6 text-gray-900 text-sm font-medium">
          {user.account?.firstName ?? user.name}
        </h3>
        <dl className="mt-1 flex-grow flex flex-col justify-between">
          <dt className="sr-only">Bio</dt>
          <dd className="text-gray-500 text-sm">
            {account.bio ? account.bio : 'Coderplex User'}
          </dd>
          <dt className="sr-only">Role</dt>
          <dt className="sr-only">Social Media</dt>
          {socials && (
            <dd className="mt-4">
              <ul className="flex space-x-5 justify-center items-center">
                {socials.github && (
                  <li>
                    <A
                      href={`https://github.com/${socials.github}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">GitHub</span>
                      <IconBrandGithub className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.facebook && (
                  <li>
                    <A
                      href={`https://facebook.com/${socials.facebook}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Facebook</span>
                      <IconBrandFacebook className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.twitter && (
                  <li>
                    <A
                      href={`https://twitter.com/${socials.twitter}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Twitter</span>
                      <IconBrandTwitter className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.linkedin && (
                  <li>
                    <A
                      href={`https://linkedin.com/in/${socials.linkedin}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <IconBrandLinkedin className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.codepen && (
                  <li>
                    <A
                      href={`https://codepen.io/${socials.codepen}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">CodePen</span>
                      <IconBrandCodepen className="w-5 h-5" />
                    </A>
                  </li>
                )}
                {socials.blog && (
                  <li>
                    <A
                      href={socials.blog}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Blog</span>
                      <IconExternalLink className="w-5 h-5" />
                    </A>
                  </li>
                )}
              </ul>
            </dd>
          )}
          {shouldShowFollowButton && (
            <>
              <dt className="sr-only">Follow</dt>
              {!isLoading && (
                <dd className="mt-4">
                  {isFollowing ? (
                    <>
                      <Button
                        onClick={() => toggle()}
                        variant="solid"
                        variantColor={
                          isHoveringFollowButton ? 'danger' : 'brand'
                        }
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
                        leadingIcon={IconPlus}
                      >
                        Follow
                      </Button>
                      {!session && (
                        <FollowModal
                          user={user}
                          isOpen={isModalOpen}
                          setIsOpen={setIsModalOpen}
                        />
                      )}
                    </>
                  )}
                </dd>
              )}
            </>
          )}
          {!shouldShowFollowButton && (
            <>
              <dt className="sr-only">Edit Profile</dt>
              <dd className="mt-3">
                <Button
                  onClick={() => router.push('/profile/settings')}
                  leadingIcon={IconEdit}
                >
                  Edit Profile
                </Button>
              </dd>
            </>
          )}
        </dl>
      </div>

      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <A
              href={`/${user.username}`}
              className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
            >
              <IconExternalLink
                className="w-5 h-5text-gray-400"
                aria-hidden={true}
              />
              <span className="ml-3">Visit</span>
            </A>
          </div>
        </div>
      </div>
    </li>
  )
}
