import { PaddedLayout } from 'src/layouts'

export default function Home() {
  return <p>Hello World</p>
}

Home.layoutProps = {
  meta: {
    title: 'Home',
  },
  Layout: PaddedLayout,
}
