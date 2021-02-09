import classNames from 'classnames'
import React from 'react'

export type StackedAvatarsProps = {
  avatars?: React.ReactNode[]
}

type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export default function StackedAvatars({ avatars = [] }: StackedAvatarsProps) {
  function getSize(): SizeVariant {
    let size
    if (avatars.length > 0) {
      size = ((avatars[0] as any).props as any).size || 'md'
    }
    return size
  }

  const SIZE_VARIANT_STYLES: Record<SizeVariant, string> = {
    xs: '-space-x-1',
    sm: '-space-x-2',
    md: '-space-x-2',
    lg: '-space-x-3',
    xl: '-space-x-3.5',
  }

  return (
    <React.Fragment>
      <div
        className={classNames(
          'flex overflow-hidden',
          SIZE_VARIANT_STYLES[getSize()]
        )}
      >
        {avatars.map((avatar, index) =>
          React.cloneElement(avatar as any, {
            className: 'shadow-solid',
            key: index,
          })
        )}
      </div>
    </React.Fragment>
  )
}
