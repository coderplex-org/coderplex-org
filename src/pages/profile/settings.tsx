import { PaddedLayout } from 'src/layouts'

export default function Settings() {
  return <p>Hello World - Settings</p>
}

Settings.layoutProps = {
  meta: {
    title: 'Settings',
  },
  Layout: PaddedLayout,
}
