import { PaddedLayout } from 'src/layouts'

export default function Jobs() {
  return <p>Hello World - Jobs</p>
}

Jobs.layoutProps = {
  meta: {
    title: 'Jobs',
  },
  Layout: PaddedLayout,
}
