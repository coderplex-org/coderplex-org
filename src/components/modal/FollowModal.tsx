import { UserPlus } from 'phosphor-react'
import { User } from 'src/pages/members'
import { Modal } from '.'

export default function FollowModal({
  user,
  isOpen,
  setIsOpen,
}: {
  user: User
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  return (
    <Modal
      user={user}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      headerText={`Follow ${user.account?.firstName} to see their
    updates.`}
      subHeaderText="Join our community to never miss their updates."
      icon={UserPlus}
    />
  )
}
