import { PaddedLayout } from 'src/layouts'

export default function Members() {
  return <p>Hello World - Members</p>
}

Members.layoutProps = {
  meta: {
    title: 'Members',
  },
  Layout: PaddedLayout,
}
