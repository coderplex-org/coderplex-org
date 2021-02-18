import classNames from 'classnames'
import { List, X } from 'phosphor-react'
import React, { ReactNode, useState } from 'react'

export type NavBarProps = {
  leftDesktopItems?: ReactNode
  rightDesktopItems?: ReactNode
  rightDesktopOnlyItems?: ReactNode
  mobileItems?: ReactNode
  className?: string
  logo?: ReactNode
} & React.HTMLAttributes<HTMLElement>

const NavBar = ({
  leftDesktopItems,
  rightDesktopItems,
  rightDesktopOnlyItems,
  mobileItems,
  logo,
  className = '',
  ...rest
}: NavBarProps) => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false)
  return (
    <nav
      className={classNames('bg-white shadow sticky top-0 z-10', className)}
      {...rest}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center mr-2 -ml-2 md:hidden">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsNavBarOpen(!isNavBarOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isNavBarOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed. */}
                <List
                  className={classNames(
                    'w-6 h-6',
                    isNavBarOpen ? 'hidden' : 'block'
                  )}
                  aria-hidden="true"
                />
                {/* Icon when menu is open. */}
                <X
                  className={classNames(
                    'w-6 h-6',
                    isNavBarOpen ? 'block' : 'hidden'
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="flex items-center flex-shrink-0">{logo}</div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {leftDesktopItems}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex flex-shrink-0 space-x-4 items-center">
              {rightDesktopItems}
            </div>
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              {rightDesktopOnlyItems}
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames('md:hidden', isNavBarOpen ? 'block' : 'hidden')}
      >
        {mobileItems}
      </div>
    </nav>
  )
}

type NavBarLeftItemProps = {
  isSelected?: boolean
  children: ReactNode
  className?: string
} & React.HTMLAttributes<HTMLAnchorElement>

const NavBarMobileLeftItem = React.forwardRef(
  (
    { isSelected, children, className, ...rest }: NavBarLeftItemProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <a
        ref={ref}
        className={classNames(
          `block py-2 pl-3 pr-4 text-base font-medium border-l-4 sm:pl-5 sm:pr-6
          cursor-pointer`,
          isSelected
            ? 'text-indigo-700 border-indigo-500 bg-indigo-50'
            : `text-gray-600 border-transparent hover:text-gray-800
           hover:bg-gray-50 hover:border-gray-300`,
          className
        )}
        {...rest}
      >
        {children}
      </a>
    )
  }
)

const NavBarDesktopLeftItem = React.forwardRef(
  (
    { isSelected, children, className, ...rest }: NavBarLeftItemProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <a
        ref={ref}
        className={classNames(
          `inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 
            border-b-2 cursor-pointer`,
          isSelected
            ? 'border-indigo-500'
            : 'border-transparent hover:text-gray-700 hover:border-gray-300',
          className
        )}
        {...rest}
      >
        {children}
      </a>
    )
  }
)

NavBar.Item = {
  Mobile: {
    Left: NavBarMobileLeftItem,
  },
  Desktop: {
    Left: NavBarDesktopLeftItem,
  },
}

export default NavBar
