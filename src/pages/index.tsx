import { GoalType, HomePageFeed } from '@/components'
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

  if (isLoading) {
    return <p>loading...</p>
  }

  if (isError) {
    return <p>Something went wrong!!!</p>
  }

  const updates = data.updates.data

  return (
    <>
      <HomePageFeed updates={updates} />
    </>
  )
}

Home.layoutProps = {
  meta: {
    title: 'Home',
  },
  Layout: PaddedLayout,
}
