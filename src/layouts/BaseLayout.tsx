import { AppNavBar, AppFooter } from '@/components'
import { ReactNode } from 'react'

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavBar />
      <main className="relative flex-1 overflow-y-auto focus:outline-none">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}
