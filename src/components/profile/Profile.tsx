import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { User } from 'src/pages/members'

export default function Profile({ user }: { user: User }) {
  const [session, loading] = useSession()
  const [currentUser, setCurrentUser] = useState<User>({})

  useEffect(() => {
    if (!loading && session) {
      setCurrentUser(session.user)
    }
  }, [loading, session])

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
                {user.account?.bio ?? ''}
              </p>
            </div>
          </div>
          {currentUser.username === user.username && (
            <div className="mt-5 flex justify-center sm:mt-0">
              <a
                href="/profile/settings"
                className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit profile
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
