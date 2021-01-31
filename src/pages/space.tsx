import { PaddedLayout } from 'src/layouts'

export default function Space() {
  return <p>Hello World - Space</p>
}

Space.layoutProps = {
  meta: {
    title: 'Space',
  },
  Layout: PaddedLayout,
}
