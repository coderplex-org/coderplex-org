import { PaddedLayout } from 'src/layouts'

export default function Projects() {
  return <p>Hello World - Projects</p>
}

Projects.layoutProps = {
  meta: {
    title: 'Projects',
  },
  Layout: PaddedLayout,
}
