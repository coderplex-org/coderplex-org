import { GoalType, HomePageFeed, Title } from '@/components'
import { useSession } from 'next-auth/client'
import { useQuery } from 'react-query'
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
  const [session] = useSession()

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

  if (isError || isGoalError) {
    return <p>Something went wrong!!!</p>
  }

  return (
    <>
      <Title>Learn. Code. Collaborate.</Title>
      <HomePageFeed
        updates={isLoading ? [] : data.updates}
        showGoal={Boolean(
          !isGoalLoading && !isGoalError && session && goalData?.goal
        )}
        goal={goalData?.goal}
      />
    </>
  )
}

Home.layoutProps = {
  meta: {
    title: 'Home',
  },
}
