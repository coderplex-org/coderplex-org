import * as React from 'react'
import classNames from 'classnames'
import Markdown from 'src/components/Markdown'

export type TextAreaProps = {
  label?: string
  hideLabel?: boolean
  id?: string
  rows?: number
  helpText?: string
  className?: string
  textAreaClassName?: string
  value?: string
  hasError?: boolean
  errorMessage?: string
  onChange?: (e: React.ChangeEvent) => void
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

const TextArea = React.forwardRef(
  (
    {
      label,
      hideLabel = false,
      id,
      rows,
      helpText,
      className = '',
      textAreaClassName = '',
      value,
      hasError = false,
      onChange,
      errorMessage,
      ...rest
    }: TextAreaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ) => {
    let values = {}
    if (value || value === '') {
      values = { ...values, value }
    }
    if (onChange) {
      values = { ...values, onChange }
    }
    const help = hasError ? errorMessage ?? helpText : helpText
    return (
      <div className={className}>
        <label
          htmlFor={id}
          className={classNames(
            'block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2',
            hideLabel && 'sr-only'
          )}
        >
          {label}
        </label>
        <div className="mt-1 sm:col-span-2">
          <textarea
            {...values}
            id={id}
            rows={rows}
            className={classNames(
              'block w-full rounded-md shadow-sm sm:text-sm bg-white',
              hasError
                ? `border-red-300 text-red-900 placeholder-red-900 
                      focus:ring-red-500 focus-within:border-red-500`
                : 'border-gray-300 text-black focus:ring-brand-500 focus:border-brand-500',
              textAreaClassName
            )}
            {...rest}
            ref={ref}
          ></textarea>
          {help && (
            <p
              className={classNames(
                'mt-2 text-sm prose prose-sm',
                hasError ? ' text-red-600' : ' text-gray-500'
              )}
              id={`${id}-${hasError ? 'error' : 'description'}`}
            >
              <Markdown>{help}</Markdown>
            </p>
          )}
        </div>
      </div>
    )
  }
)

export default TextArea
