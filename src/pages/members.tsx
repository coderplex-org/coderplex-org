import { Members } from '@/components'
import { PaddedLayout } from 'src/layouts'
import { useQuery } from 'react-query'

export default function MembersPage() {
  const { isLoading, isError, data } = useQuery('/api/fauna/members', () =>
    fetch(`/api/fauna/members`).then((res) => {
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
  return (
    <>
      <Members users={data.users} />
    </>
  )
}

MembersPage.layoutProps = {
  meta: {
    title: 'Members',
  },
  Layout: PaddedLayout,
}

export type User = Partial<{
  id: string
  username: string
  name: string
  email: string
  image: string
  account: Partial<{
    firstName: string
    lastName: string
    bio: string
  }>
  socials: Partial<{
    github: string
    facebook: string
    twitter: string
    linkedin: string
    codepen: string
    discord: string
    blog: string
  }>
  otherDetails: Partial<{
    userType: 'developer' | 'employer' | 'none'
    mobile: string
    isCurrentlyWorking: 'yes' | 'no' | 'none'
    lookingForWork: 'yes' | 'no' | 'none'
    company: string
    technologiesFamiliarWith: string[]
  }>
}>
