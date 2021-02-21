import { Button } from '@/ui'
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
import { A, FollowModal } from '@/components'
import useFollowUser from '../profile/useFollowUser'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'

export default function Member({ user }: { user: User }) {
  const [session] = useSession()
  const router = useRouter()
  const socials = user.socials
  const account = user.account
  const bioExists = Boolean(account.bio)
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
  console.log({ user })
  return (
    <li>
      <div className="flex items-center space-x-4 lg:space-x-6">
        <A href={`/${user.username}`}>
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden">
            <img
              className="w-full h-full inline-block text-white focus:ring object-cover"
              src={user.image}
              alt={user.name}
              tabIndex={0}
            />
          </div>
        </A>
        <div className="font-medium text-base leading-6 space-y-1 text-black">
          <A href={`/${user.username}`}>
            <h3>{`${account.firstName} ${account.lastName ?? ''}`}</h3>
          </A>
          <dl className="mt-1 flex-grow flex flex-col justify-between">
            <dt className="sr-only">Bio</dt>
            <dd className="text-gray-500 text-xs">
              {bioExists ? account.bio : 'Coderplex User'}
            </dd>
            <dt className="sr-only">Role</dt>
            <dt className="sr-only">Social Media</dt>
            {socials && (
              <dd className="mt-2">
                <ul className="flex space-x-1 justify-start items-center">
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
          </dl>
        </div>
      </div>
      <div className="ml-20 lg:ml-26">
        {shouldShowFollowButton && (
          <>
            <dt className="sr-only">Follow</dt>
            {!isLoading && (
              <dd className="mt-4">
                {isFollowing ? (
                  <>
                    <Button
                      size="xs"
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
                      size="xs"
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
                size="xs"
                onClick={() => router.push('/profile/settings')}
                leadingIcon={IconEdit}
              >
                Edit Profile
              </Button>
            </dd>
          </>
        )}
      </div>
    </li>
  )
}
