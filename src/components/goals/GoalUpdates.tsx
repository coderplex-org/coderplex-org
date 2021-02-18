import { ReactNode } from 'react'

export function GoalUpdatesList({ children }: { children: ReactNode }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">{children}</ul>
    </div>
  )
}

export default function GoalUpdates({ children }: { children: ReactNode }) {
  return (
    <>
      <section aria-labelledby="profile-updates" className="mt-8 xl:mt-10">
        <div>
          <div className="divide-y divide-gray-200">
            <div className="pb-4">
              <h2
                id="profile-updates"
                className="text-lg font-medium text-gray-900"
              >
                Updates
              </h2>
            </div>
            <div className="pt-6">{children}</div>
          </div>
        </div>
      </section>
    </>
  )
}
