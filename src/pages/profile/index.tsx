import { PaddedLayout } from 'src/layouts'

export default function Profile() {
  return <p>Hello World - Profile</p>
}

Profile.layoutProps = {
  meta: {
    title: 'Profile',
  },
  Layout: PaddedLayout,
}
