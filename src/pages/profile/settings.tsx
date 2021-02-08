import { UserCircle } from 'phosphor-react'
import { useState } from 'react'
import type { TablerIcon } from 'tabler-icons'
import type { Icon as PhosphorIcon } from 'phosphor-react'
import classNames from 'classnames'
import {
  OtherSettings,
  ProfileSettings,
  SocialMediaSettings,
} from '@/components'
import { PaddedLayout } from 'src/layouts'

const tabValues = ['profile', 'social', 'other'] as const

type Tab = {
  name: string
  value: typeof tabValues[number]
  icon: PhosphorIcon | TablerIcon
}

const tabs: Tab[] = [
  {
    name: 'Profile',
    value: tabValues[0],
    icon: UserCircle,
  },
  {
    name: 'Social Media',
    value: tabValues[1],
    icon: UserCircle,
  },
  {
    name: 'Other Details',
    value: tabValues[2],
    icon: UserCircle,
  },
]

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState<typeof tabValues[number]>(
    'profile'
  )

  return (
    <>
      <div className="py-4 lg:grid lg:grid-cols-12 lg:gap-x-5">
        <div className="px-2 py-6 lg:hidden sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <label htmlFor="selectedTab" className="sr-only">
            Select a tab
          </label>
          <select
            id="selectedTab"
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            onChange={(e) =>
              setSelectedTab(e.target.value as typeof tabValues[number])
            }
            value={selectedTab}
          >
            {tabs.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>

        <aside className="hidden px-2 py-6 lg:block sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab: Tab) => (
              <a
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={classNames(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md group cursor-pointer',
                  tab.value === selectedTab
                    ? 'text-brand-700 bg-gray-50 hover:text-brand-700 hover:bg-white'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                )}
                aria-current="page"
              >
                <tab.icon
                  className={
                    tab.value === selectedTab
                      ? 'flex-shrink-0 w-6 h-6 mr-3 -ml-1 text-brand-500 group-hover:text-brand-500'
                      : 'flex-shrink-0 w-6 h-6 mr-3 -ml-1 text-gray-400 group-hover:text-gray-500'
                  }
                />
                <span className="truncate">{tab.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {selectedTab === 'profile' && <ProfileSettings />}
          {selectedTab === 'social' && <SocialMediaSettings />}
          {selectedTab === 'other' && <OtherSettings />}
        </div>
      </div>
    </>
  )
}

Settings.layoutProps = {
  meta: {
    title: 'Profile Settings',
  },
  Layout: PaddedLayout,
}
