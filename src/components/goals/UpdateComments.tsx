import { ReactNode } from 'react'

export function UpdateCommentsList({ children }: { children: ReactNode }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">{children}</ul>
    </div>
  )
}

export default function UpdateComments({ children }: { children: ReactNode }) {
  return (
    <>
      <section aria-labelledby="activity-title" className="mt-8 xl:mt-10">
        <div>
          <div className="divide-y divide-gray-200">
            <div className="pb-4">
              <h2
                id="activity-title"
                className="text-lg font-medium text-gray-900"
              >
                Comments
              </h2>
            </div>
            <div className="pt-6">{children}</div>
          </div>
        </div>
      </section>
    </>
  )
}
