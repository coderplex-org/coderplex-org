import { PaddedLayout } from 'src/layouts'

export default function Events() {
  return <p>Hello World - Events</p>
}

Events.layoutProps = {
  meta: {
    title: 'Events',
  },
  Layout: PaddedLayout,
}
