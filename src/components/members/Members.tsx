import { User } from 'src/pages/members'
import Member from './Member'

export default function Members({ users }: { users: User[] }) {
  return (
    <div className="mx-auto max-w-7xl">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {users.map((user) => (
          <Member user={user} key={user.id} />
        ))}
      </ul>
    </div>
  )
}
