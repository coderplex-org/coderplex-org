import { PaddedLayout } from 'src/layouts'

export default function Notifications() {
  return <p>Hello World - Notifications</p>
}

Notifications.layoutProps = {
  meta: {
    title: 'Notifications',
  },
  Layout: PaddedLayout,
}
