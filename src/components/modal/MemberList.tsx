import { useSession } from 'next-auth/client'
import { useState } from 'react'
import { User } from 'src/pages/members'
import { IconPlus } from 'tabler-icons'
import useFollowUser from '../profile/useFollowUser'
import { Button } from '../ui/button'
import FollowModal from './FollowModal'

function Member({ user }: { user: User }) {
  const [isHoveringFollowButton, setIsHoveringFollowButton] = useState(false)
  const [session, loading] = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const { shouldShowFollowButton, toggleFollow } = useFollowUser(user.id)
  const toggle = () => {
    setIsFollowing(!isFollowing)
    toggleFollow()
  }
  if (loading) {
    return <p>loading...</p>
  }
  return (
    <li className="py-4" key={user.id}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8 rounded-full"
            src={user.image}
            alt={user.account?.firstName ?? user.username}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.account?.firstName ?? user.username}
          </p>
          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
        </div>
        {shouldShowFollowButton && (
          <div>
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
          </div>
        )}
      </div>
    </li>
  )
}

export default function MembersList({ users }: { users: User[] }) {
  return (
    <div className="flow-root my-6">
      <ul className="-my-5 divide-y divide-gray-200">
        {users.map((user) => (
          <Member user={user} key={user.id} />
        ))}
      </ul>
    </div>
  )
}
