import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { User } from 'src/pages/members'

export default function useFollowUser(userId: string) {
  const [session, loading] = useSession()
  const [currentUser, setCurrentUser] = useState<User>({})
  useEffect(() => {
    if (!loading && session) {
      setCurrentUser(session.user)
    }
  }, [loading, session])
  const { isLoading, data: isFollowingData } = useQuery(
    ['/api/isFollowing', currentUser?.id, userId],
    () => {
      return fetch(`/api/fauna/is-following`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      })
    }
  )

  const { mutate: toggleFollow } = useMutation(() =>
    fetch(`/api/fauna/toggle-follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Something went wrong!!')
      }
      return res.json()
    })
  )

  return {
    isLoading,
    shouldShowFollowButton: currentUser.id !== userId,
    isFollowing: isFollowingData?.isFollowing ?? false,
    toggleFollow,
  }
}
