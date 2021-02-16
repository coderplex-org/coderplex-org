import { GoalType, HomePageFeed, NewUpdate } from '@/components'
import { useQuery } from 'react-query'
import { PaddedLayout } from 'src/layouts'
import { User } from './members'

export type HomePageFeedUpdateType = {
  id: string
  goal: GoalType
  description: string
  createdAt: number
  postedBy: User
}

export default function Home() {
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
    data: goalIdData,
  } = useQuery('/api/fauna/goals/get-current-goal-id', () =>
    fetch('/api/fauna/goals/get-current-goal-id').then((res) => {
      if (!res.ok) {
        throw new Error('Something went wrong!!')
      }
      return res.json()
    })
  )

  if (isLoading || isGoalLoading) {
    return <p>loading...</p>
  }

  if (isError || isGoalError) {
    return <p>Something went wrong!!!</p>
  }

  const updates = data.updates.data

  return (
    <>
      <div className="space-y-3">
        <NewUpdate goalId={goalIdData.goalId} updateFromHomePage={true} />
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
