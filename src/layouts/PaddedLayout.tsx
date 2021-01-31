import { ReactNode } from 'react'
import BaseLayout from './BaseLayout'

export default function PaddedLayout({ children }: { children: ReactNode }) {
  return (
    <BaseLayout>
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6 md:py-8">{children}</div>
      </div>
    </BaseLayout>
  )
}
