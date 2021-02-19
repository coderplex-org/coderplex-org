import { ThumbsUp } from 'phosphor-react'
import { User } from 'src/pages/members'
import { Modal } from '.'

export default function LikeModal({
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
      headerText="Like the updates shared by the community members"
      subHeaderText={`Join our community now to let ${
        user.account?.firstName ?? user.name
      } know you like their update.`}
      icon={ThumbsUp}
    />
  )
}
