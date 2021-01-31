import * as React from 'react'
import classNames from 'classnames'

export type ButtonGroupProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export default function ButtonGroup({
  children,
  className = '',
  ...rest
}: ButtonGroupProps) {
  return (
    <div className={classNames('px-4 py-8 bg-white', className)} {...rest}>
      <div className="flex flex-col items-center justify-start max-w-3xl mx-auto space-y-4 sm:space-y-0 sm:flex-row sm:items-end sm:justify-around">
        {children}
      </div>
    </div>
  )
}
