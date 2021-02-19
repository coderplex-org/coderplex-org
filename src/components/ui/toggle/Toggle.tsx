import { Switch } from '@headlessui/react'
import classNames from 'classnames'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Toggle() {
  const { theme, setTheme } = useTheme()
  const [enabled, setEnabled] = useState(theme === 'light' ? false : true)

  useEffect(() => {
    if (enabled) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [enabled, setTheme])
  return (
    <>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-brand-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500'
        )}
      >
        <span className="sr-only">Use dark mode</span>
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          )}
        ></span>
      </Switch>
    </>
  )
}
