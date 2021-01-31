import { PaddedLayout } from 'src/layouts'

export default function Learn() {
  return <p>Hello World - Learn</p>
}

Learn.layoutProps = {
  meta: {
    title: 'Learn',
  },
  Layout: PaddedLayout,
}
