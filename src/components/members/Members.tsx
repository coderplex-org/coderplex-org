import { User } from 'src/pages/members'
import Member from './Member'

export default function Members({ users }: { users: User[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {users.map((user) => (
        <Member key={user.id} user={user} />
      ))}
    </ul>
  )
}
