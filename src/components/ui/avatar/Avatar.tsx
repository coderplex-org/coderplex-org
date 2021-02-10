import classNames from 'classnames'
import React from 'react'

type SizeVariant = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type AvatarProps = {
  className?: string
  size?: SizeVariant
  src?: string
  name?: string
  squared?: boolean
}

const SIZE_VARIANT_STYLES: Record<SizeVariant, string> = {
  '2xs': 'h-5 w-5',
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
}

export default function Avatar({
  className,
  size = 'md',
  src,
  name,
  squared = false,
}: AvatarProps) {
  const getInitials = () => {
    if (!name) {
      return ''
    }
    const splits = name.split(' ')
    if (splits.length === 1) {
      return splits[0][0]
    }
    return `${splits[0][0]}${splits[1][0]}`
  }
  return (
    <React.Fragment>
      {src ? (
        <img
          className={classNames(
            SIZE_VARIANT_STYLES[size],
            squared ? 'rounded-md' : 'rounded-full',
            'inline-block text-white focus:ring',
            className
          )}
          src={src}
          alt=""
          tabIndex={0}
        />
      ) : name ? (
        <span
          className={classNames(
            SIZE_VARIANT_STYLES[size],
            squared ? 'rounded-md' : 'rounded-full',
            `inline-flex items-center justify-center text-white 
            bg-gray-500 focus:outline-none focus:ring`,
            className
          )}
          tabIndex={0}
        >
          <span className="text-xs font-medium leading-none text-white">
            {getInitials()}
          </span>
        </span>
      ) : (
        <span
          className={classNames(
            SIZE_VARIANT_STYLES[size],
            squared ? 'rounded-md' : 'rounded-full',
            `inline-block overflow-hidden text-white 
            bg-gray-100 focus:outline-none focus:ring`,
            className
          )}
          tabIndex={0}
        >
          <svg
            className="w-full h-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      )}
    </React.Fragment>
  )
}
