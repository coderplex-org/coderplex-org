import classNames from 'classnames'
import React from 'react'
import { ChangeEvent, ReactNode } from 'react'

export type SelectProps = {
  label?: string
  id?: string
  helpText?: string
  hideLabel?: boolean
  value?: any
  onChange?: (e: ChangeEvent) => void
  className?: string
  selectClassName?: string
  children?: ReactNode
} & React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

const Select = React.forwardRef(
  (
    {
      label,
      id,
      helpText,
      hideLabel = false,
      className,
      selectClassName,
      value,
      onChange,
      children,
      ...rest
    }: SelectProps,
    ref: React.ForwardedRef<HTMLSelectElement>
  ) => {
    let values = {}
    if (value || value === '') {
      values = { ...values, value }
    }
    if (onChange) {
      values = { ...values, onChange }
    }
    return (
      <div className={className}>
        <label
          htmlFor={id}
          className={classNames(
            'block text-sm font-medium text-gray-700',
            hideLabel && 'sr-only'
          )}
        >
          {label}
        </label>
        <select
          id={id}
          className={classNames(
            'bg-white text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md',
            selectClassName
          )}
          ref={ref}
          {...values}
          {...rest}
        >
          {children}
        </select>
      </div>
    )
  }
)

export default Select
