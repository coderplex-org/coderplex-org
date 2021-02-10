import { Markdown } from '..'

export default function GoalDescription({ children }: { children: string }) {
  return (
    <div className="py-3 xl:pt-6 xl:pb-0">
      <h2 className="sr-only">Description</h2>
      <div className="prose max-w-none">
        <Markdown>{children}</Markdown>
      </div>
    </div>
  )
}
