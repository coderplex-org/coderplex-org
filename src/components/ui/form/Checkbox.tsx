import classNames from 'classnames'
import React, { ChangeEvent } from 'react'

export type CheckboxProps = {
  label?: string
  id?: string
  helpText?: string
  hideLabel?: boolean
  cornerHint?: string
  checked?: boolean
  onChange?: (e: ChangeEvent) => void
  className?: string
  inputClassName?: string
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const Checkbox = React.forwardRef(
  (
    {
      label,
      id,
      helpText,
      hideLabel = false,
      checked,
      className,
      onChange,
      inputClassName,
      ...rest
    }: CheckboxProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    let values = {}
    if (typeof checked === 'boolean') {
      values = { ...values, checked }
    }
    if (onChange) {
      values = { ...values, onChange }
    }
    return (
      <div className={classNames('relative flex items-start', className)}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={classNames(
              'focus:ring-brand-500 h-4 w-4 text-brand-600 border-gray-300 rounded',
              inputClassName
            )}
            {...values}
            {...rest}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={id}
            className={classNames(
              'font-medium text-gray-700',
              hideLabel && 'sr-only'
            )}
          >
            {label}
          </label>
          {helpText && <p className="text-gray-500">{helpText}</p>}
        </div>
      </div>
    )
  }
)

export default Checkbox
