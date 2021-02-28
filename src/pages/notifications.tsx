import { A, Markdown } from '@/components'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/client'
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { PaddedLayout } from 'src/layouts'
import { User } from './members'

type NotificationType = {
  id: string
  user: User
  type:
    | 'FOLLOWED'
    | 'UNFOLLOWED'
    | 'LIKED_UPDATE'
    | 'UNLIKED_UPDATE'
    | 'LIKED_COMMENT'
    | 'UNLIKED_COMMENT'
    | 'COMMENTED_ON_UPDATE'
  createdAt: number
  documentId: string
}

function message({ notification }: { notification: NotificationType }) {
  const { type, user, documentId } = notification
  const name = user.account?.firstName ?? user.username
  if (type === 'FOLLOWED') {
    return `${name} has started following you.`
  }
  if (type === 'UNFOLLOWED') {
    return `${name} has stopped following you.`
  }
  if (type === 'LIKED_UPDATE') {
    return `${name} has liked [your update](/update/${documentId}).`
  }
  if (type === 'UNLIKED_UPDATE') {
    return `${name} has unliked [your update](/update/${documentId}).`
  }
  if (type === 'LIKED_COMMENT') {
    return `${name} has liked [your comment](/comment/${documentId}).`
  }
  if (type === 'UNLIKED_COMMENT') {
    return `${name} has unliked [your comment](/comment/${documentId}).`
  }
  if (type === 'COMMENTED_ON_UPDATE') {
    return `${name} has [commented on your update](/comment/${documentId}).`
  }
  return ''
}

function Notification({ notification }: { notification: NotificationType }) {
  const [session] = useSession()
  const currentUserId = (session.user as User).id
  if (currentUserId === notification.user.id) {
    return <></>
  }
  if (notification.type === 'UNFOLLOWED') {
    return <></>
  }
  if (notification.type === 'UNLIKED_UPDATE') {
    return <></>
  }
  if (notification.type === 'UNLIKED_COMMENT') {
    return <></>
  }
  const createdAt = DateTime.fromMillis(notification.createdAt)
  const name =
    notification.user.account?.firstName ?? notification.user.username

  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <A href={`/${notification.user.username}`}>
            <img
              className="h-8 w-8 rounded-full"
              src={notification.user.image}
              alt={name}
            />
          </A>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            <div className="prose prose-sm">
              <Markdown>{message({ notification })}</Markdown>
            </div>
          </div>
          <p className="text-sm text-gray-500 truncate">
            <time dateTime={createdAt.toISO()}>
              {DateTime.now().minus(createdAt.diffNow().negate()).toRelative()}
            </time>
          </p>
        </div>
      </div>
    </li>
  )
}

function NotificationsList({
  notifications,
}: {
  notifications: NotificationType[]
}) {
  return (
    <div>
      <div className="flow-root mt-6">
        <ul className="-my-5 divide-y divide-gray-200">
          {notifications.map((notification) => (
            <Notification notification={notification} key={notification.id} />
          ))}
        </ul>
      </div>
    </div>
  )
}
export default function Notifications() {
  const [session, loading] = useSession()
  const queryClient = useQueryClient()
  const { isLoading, isError, data } = useQuery(
    'api/fauna/notifications',
    () => {
      return fetch(`/api/fauna/notifications`).then((res) => res.json())
    }
  )
  const { mutate } = useMutation(
    () =>
      fetch('/api/fauna/update-notification-status').then((res) => res.json()),
    {
      onSuccess: (data) => {
        queryClient.refetchQueries('api/fauna/has-notifications')
      },
    }
  )

  useEffect(() => {
    mutate()
  }, [mutate])

  if (isLoading || loading) {
    return <p>loading...</p>
  }
  if (!session) {
    return <p>Please login first...</p>
  }
  if (isError) {
    return <p>Something went wrong!!!</p>
  }
  return (
    <>
      <NotificationsList notifications={data} />
    </>
  )
}

Notifications.layoutProps = {
  meta: {
    title: 'Notifications',
  },
  Layout: PaddedLayout,
}
