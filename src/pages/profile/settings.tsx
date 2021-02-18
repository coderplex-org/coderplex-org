import { Gear, Lock, UserCircle } from 'phosphor-react'
import { useState } from 'react'
import { IconSocial } from 'tabler-icons'
import type { TablerIcon } from 'tabler-icons'
import type { Icon as PhosphorIcon } from 'phosphor-react'
import classNames from 'classnames'
import {
  OtherSettings,
  PrivateSettings,
  ProfileSettings,
  SocialMediaSettings,
} from '@/components'
import { PaddedLayout } from 'src/layouts'
import { Select } from '@/ui'

const tabValues = ['profile', 'private', 'social', 'other'] as const

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
    name: 'Private Details',
    value: tabValues[1],
    icon: Lock,
  },
  {
    name: 'Social Media',
    value: tabValues[2],
    icon: IconSocial,
  },
  {
    name: 'Other Details',
    value: tabValues[3],
    icon: Gear,
  },
]

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState<typeof tabValues[number]>(
    'profile'
  )

  return (
    <>
      <div className="py-4 lg:grid lg:grid-cols-12 lg:gap-x-5">
        <Select
          label="Select a tab"
          id="selectedTab"
          onChange={(e) =>
            setSelectedTab(e.target.value as typeof tabValues[number])
          }
          hideLabel={true}
          value={selectedTab}
          className="px-2 py-6 lg:hidden sm:px-6 lg:py-0 lg:px-0 lg:col-span-3"
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </Select>

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
          {selectedTab === 'private' && <PrivateSettings />}
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
