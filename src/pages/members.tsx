import { Members } from '@/components'
import { PaddedLayout } from 'src/layouts'
import { InferGetServerSidePropsType } from 'next'

export default function MembersPage({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Members users={users} />
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
}>

export const getServerSideProps = async () => {
  const users: User[] = [
    {
      id: '289394667716346368',
      name: 'Bhanu Teja Pachipulusu',
      email: 'pbteja1998@gmail.com',
      image: 'https://avatars.githubusercontent.com/u/17903466?v=4',
    },
    {
      id: '289395621535678976',
      name: 'Bhanu Teja Pachipulusu',
      email: '',
      image: '',
    },
  ]
  return {
    props: {
      users,
    },
  }
}
