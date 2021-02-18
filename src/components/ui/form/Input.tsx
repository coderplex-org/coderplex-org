import classNames from 'classnames'
import { Icon as PhoshphorIcon, WarningCircle } from 'phosphor-react'
import React, { ChangeEvent } from 'react'
import type { TablerIcon } from 'tabler-icons'

export type InputProps = {
  label?: string
  type?:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
  id?: string
  helpText?: string
  hideLabel?: boolean
  cornerHint?: string
  leadingIcon?: TablerIcon | PhoshphorIcon
  trailingIcon?: TablerIcon | PhoshphorIcon
  hasError?: boolean
  errorMessage?: string
  value?: any
  onChange?: (e: ChangeEvent) => void
  leadingAddon?: string
  isAddonInline?: boolean
  required?: boolean
  className?: string
  inputClassName?: string
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const Input = React.forwardRef(
  (
    {
      label,
      type,
      id = '',
      helpText,
      hideLabel = false,
      cornerHint,
      leadingIcon,
      trailingIcon,
      hasError = false,
      errorMessage,
      value,
      onChange,
      leadingAddon,
      isAddonInline = false,
      required = false,
      className = '',
      inputClassName = '',
      ...rest
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    let values = {}
    if (value || value === '') {
      values = { ...values, value }
    }
    if (onChange) {
      values = { ...values, onChange }
    }
    const LeadingIcon = leadingIcon
    const TrailingIcon = hasError ? WarningCircle : trailingIcon
    const help = hasError ? errorMessage ?? helpText : helpText
    return (
      <React.Fragment>
        <div className={className}>
          <div className="flex justify-between">
            <label
              htmlFor={id}
              className={
                hideLabel
                  ? 'sr-only'
                  : 'block text-sm font-medium text-gray-700'
              }
            >
              {label}
            </label>
            {cornerHint && (
              <span className="text-sm text-gray-500" id="email-optional">
                {cornerHint}
              </span>
            )}
          </div>
          <div
            className={classNames(
              'mt-1',
              (LeadingIcon || TrailingIcon || leadingAddon) &&
                'rounded-md shadow-sm',
              (LeadingIcon || TrailingIcon) && 'relative',
              leadingAddon && 'flex'
            )}
          >
            {LeadingIcon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LeadingIcon
                  className={classNames(
                    'w-5 h-5',
                    hasError ? 'text-red-500' : 'text-gray-400'
                  )}
                  aria-hidden="true"
                />
              </div>
            )}

            {leadingAddon &&
              (isAddonInline ? (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {leadingAddon}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm">
                  {leadingAddon}
                </span>
              ))}

            <input
              {...values}
              type={type}
              id={id}
              className={classNames(
                'block w-full sm:text-sm bg-white',
                hasError
                  ? `border-red-300 text-red-900 placeholder-red-900 
                      focus:ring-red-500 focus-within:border-red-500`
                  : 'border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500',
                LeadingIcon && 'pl-10',
                TrailingIcon && 'pr-10',
                leadingAddon
                  ? isAddonInline
                    ? 'pl-16 sm:pl-14 rounded-md'
                    : 'flex-1 px-3 py-2 rounded-none rounded-r-md'
                  : 'rounded-md shadow-sm',
                inputClassName
              )}
              required={required}
              {...rest}
              ref={ref}
            />
            {TrailingIcon && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <TrailingIcon
                  weight="fill"
                  className={classNames(
                    'w-5 h-5',
                    hasError ? 'text-red-500' : 'text-gray-400'
                  )}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          {help && (
            <p
              className={classNames(
                'mt-2 text-sm',
                hasError ? ' text-red-600' : ' text-gray-500'
              )}
              id={`${id}-${hasError ? 'error' : 'description'}`}
            >
              {help}
            </p>
          )}
        </div>
      </React.Fragment>
    )
  }
)

export default Input
