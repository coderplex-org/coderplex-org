import { User } from 'src/pages/members'
import Member from './Member'

export default function Members({ users }: { users: User[] }) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
      <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
        <h2 className="text-black text-3xl font-extrabold tracking-tight sm:text-4xl">
          Coderplex Community
        </h2>
        <p className="text-xl text-gray-500">
          <span className="text-brand-600 font-bold">{users.length}</span>{' '}
          people are a part of this amazing community.
        </p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {users.map((user) => (
          <Member user={user} key={user.id} />
        ))}
      </ul>
    </div>
  )
}
