import classNames from 'classnames'

type Tab = {
  name: string
  value: string
  isSelected: boolean
  onClick: () => void
}

export default function Tabs({
  tabs,
  className = '',
}: {
  tabs: Tab[]
  className?: string
}) {
  return (
    <div className={className}>
      <div>
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              className={classNames(
                'px-2 py-1 font-medium text-sm rounded-md',
                tab.isSelected
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              key={tab.value}
              onClick={(e) => {
                e.preventDefault()
                tab.onClick()
              }}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
