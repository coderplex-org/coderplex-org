import { A, GoalType, HomePageFeed, NewUpdate } from '@/components'
import { useSession } from 'next-auth/client'
import { useQuery } from 'react-query'
import { PaddedLayout } from 'src/layouts'
import { User } from './members'

export type UpdateCommentType = {
  id: string
  description: string
  createdAt: number
  postedBy: User
}

export type HomePageFeedUpdateType = {
  id: string
  goal: GoalType
  description: string
  createdAt: number
  postedBy: User
  likes: {
    data: number
  }
  comments: {
    data: UpdateCommentType[]
  }
}

export default function Home() {
  const [session, loading] = useSession()

  const { isLoading, isError, data } = useQuery('/api/fauna/all-updates', () =>
    fetch(`/api/fauna/all-updates`).then((res) => {
      if (!res.ok) {
        throw new Error('Something went wrong!!')
      }
      return res.json()
    })
  )

  const {
    isLoading: isGoalLoading,
    isError: isGoalError,
    data: goalData,
  } = useQuery('/api/fauna/goals/get-current-goal', () => {
    return fetch('/api/fauna/goals/get-current-goal').then((res) => {
      if (!res.ok) {
        throw new Error('Something went wrong!!')
      }
      return res.json()
    })
  })

  if (loading || isLoading || isGoalLoading) {
    return <p>loading...</p>
  }

  if (isError || isGoalError) {
    return <p>Something went wrong!!!</p>
  }

  const updates = data.updates.data

  return (
    <>
      <div className="space-y-3">
        {session && goalData?.goal && (
          <>
            <div className="mt-2 flex ml-13">
              <A href={`${(session.user as User).username}`}>
                <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                  🚀 Goal: {goalData.goal.title}
                </span>
              </A>
            </div>
            <NewUpdate goal={goalData.goal} updateFromHomePage={true} />
          </>
        )}
        <HomePageFeed updates={updates} />
      </div>
    </>
  )
}

Home.layoutProps = {
  meta: {
    title: 'Home',
  },
  Layout: PaddedLayout,
}
