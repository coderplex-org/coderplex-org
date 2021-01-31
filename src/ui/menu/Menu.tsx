import React, { ReactNode } from 'react'
import { Menu as TMenu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { TablerIcon } from 'tabler-icons'
import { Icon as PhosphorIcon } from 'phosphor-react'

export type MenuProps = {
  children: ReactNode
  className?: string
  as?: any
  trigger: ReactNode
  placement?: 'left' | 'right'
}

const Menu = ({
  children,
  className = '',
  trigger,
  placement = 'right',
}: MenuProps) => {
  return (
    <div
      className={classNames(
        'inline-flex items-center justify-center',
        className
      )}
    >
      <div className="relative inline-block text-left">
        <TMenu>
          {({ open }) => (
            <React.Fragment>
              <Menu.Button>{trigger}</Menu.Button>
              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-in"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <TMenu.Items
                  static
                  className={classNames(
                    'absolute w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10',
                    placement === 'right' ? 'right-0' : 'left-0'
                  )}
                >
                  <div className="py-1">{children}</div>
                </TMenu.Items>
              </Transition>
            </React.Fragment>
          )}
        </TMenu>
      </div>
    </div>
  )
}

const MenuButton = ({ children }: { children: ReactNode; as?: any }) => {
  return <TMenu.Button as={'span'}>{children}</TMenu.Button>
}

type MenuItemProps = {
  children: ReactNode
  isDisabled?: boolean
  icon?: TablerIcon | PhosphorIcon
} & React.AllHTMLAttributes<HTMLAnchorElement>

const MenuItem = React.forwardRef(
  (
    { children, isDisabled = false, icon, ...rest }: MenuItemProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const Icon = icon
    return (
      <TMenu.Item disabled={isDisabled}>
        {({ active }) => (
          <a
            className={classNames(
              'group flex items-center w-full px-4 py-2 text-sm cursor-pointer',
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              isDisabled && 'opacity-50 cursor-not-allowed group'
            )}
            {...rest}
            ref={ref}
          >
            {Icon && (
              <Icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500" />
            )}
            {children}
          </a>
        )}
      </TMenu.Item>
    )
  }
)

const MenuDivider = () => <div className="h-1 my-1 border-b border-gray-100" />

Menu.Button = MenuButton
Menu.Item = MenuItem
Menu.Divider = MenuDivider
export default Menu
