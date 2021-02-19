import * as React from 'react'
import { ReactNode } from 'react'
import { IconCircleDotted, TablerIcon } from 'tabler-icons'
import type { Icon as PhosphorIcon } from 'phosphor-react'
import classNames from 'classnames'

const SIZE_VARIANT_STYLES: Record<ButtonSizeVariant, string> = {
  xs: 'px-2.5 py-1.5 text-xs rounded',
  sm: 'px-3 py-2 leading-4 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-4 py-2 text-base rounded-md',
  xl: 'px-6 py-3 text-base rounded-md',
}

const COLOR_VARIANT_MAPS = (variant: ButtonVariant) => {
  switch (variant) {
    case 'solid':
      return SOLID_COLOR_VARIANT_MAPS
    case 'outlined':
      return OUTLINED_COLOR_VARIANT_MAPS
    case 'link':
      return LINK_COLOR_VARIANT_MAPS
    case 'ghost':
      return GHOST_COLOR_VARIANT_MAPS
    case 'unstyled':
      return UNSTYLED_COLOR_VARIANT_MAPS
    default:
      return {}
  }
}

const SOLID_COLOR_VARIANT_MAPS: Record<ButtonVariantColor, string> = {
  normal: `border border-transparent text-white bg-normal-600 hover:bg-normal-700 
  focus:ring-2 focus:ring-offset-2 focus:ring-normal-500`,
  brand: `border border-transparent text-white bg-brand-600 hover:bg-brand-700 
  focus:ring-2 focus:ring-offset-2 focus:ring-brand-500`,
  success: `border border-transparent text-white bg-success-600 hover:bg-success-700 
  focus:ring-2 focus:ring-offset-2 focus:ring-success-500`,
  danger: `border border-transparent text-white bg-danger-600 hover:bg-danger-700 
  focus:ring-2 focus:ring-offset-2 focus:ring-danger-500`,
  warning: `border border-transparent text-white bg-warning-600 hover:bg-warning-700 
    focus:ring-2 focus:ring-offset-2 focus:ring-warning-500`,
  info: `border border-transparent text-white bg-info-600 hover:bg-info-700 
    focus:ring-2 focus:ring-offset-2 focus:ring-brand-500`,
}

const OUTLINED_COLOR_VARIANT_MAPS: Record<ButtonVariantColor, string> = {
  normal: `border border-normal-300 text-normal-700 bg-transparent 
    hover:bg-normal-600 hover:text-white focus:ring-2 focus:ring-offset-2 
    focus:ring-normal-500`,
  brand: `border border-brand-300 text-brand-700 bg-transparent 
    hover:bg-brand-600 hover:text-white focus:ring-2 focus:ring-offset-2 
    focus:ring-brand-500`,
  success: `border border-success-300 text-success-700 bg-transparent 
    hover:bg-success-600 hover:text-white focus:ring-2 focus:ring-offset-2 
    focus:ring-success-500`,
  danger: `border border-danger-300 text-danger-700 bg-transparent 
    hover:bg-danger-600 hover:text-white focus:ring-2 focus:ring-offset-2 
    focus:ring-danger-500`,
  warning: `border border-warning-300 text-warning-700 bg-transparent 
    hover:bg-warning-600 hover:text-white focus:ring-2 focus:ring-offset-2 
    focus:ring-warning-500`,
  info: `border border-info-300 text-info-700 bg-transparent 
    hover:bg-info-600 hover:text-white focus:ring-2 focus:ring-offset-2 
    focus:ring-info-500`,
}

const GHOST_COLOR_VARIANT_MAPS: Record<ButtonVariantColor, string> = {
  normal: `border border-transparent text-normal-700 bg-transparent 
    hover:text-normal-500 hover:bg-normal-100 focus:ring-2 focus:ring-offset-2 
    focus:ring-normal-500`,
  brand: `border border-transparent text-brand-700 bg-transparent 
    hover:text-brand-500 hover:bg-brand-100 focus:ring-2 focus:ring-offset-2 
    focus:ring-brand-500`,
  success: `border border-transparent text-success-700 bg-transparent 
    hover:text-success-500 hover:bg-success-100 focus:ring-2 focus:ring-offset-2 
    focus:ring-success-500`,
  danger: `border border-transparent text-danger-700 bg-transparent 
    hover:text-danger-500 hover:bg-danger-100 focus:ring-2 focus:ring-offset-2 
    focus:ring-danger-500`,
  warning: `border border-transparent text-warning-700 bg-transparent 
    hover:text-warning-500 hover:bg-warning-100 focus:ring-2 focus:ring-offset-2 
    focus:ring-warning-500`,
  info: `border border-transparent text-info-700 bg-transparent 
    hover:text-info-500 hover:bg-info-100 focus:ring-2 focus:ring-offset-2 
    focus:ring-info-500`,
}

const LINK_COLOR_VARIANT_MAPS: Record<ButtonVariantColor, string> = {
  normal: `text-normal-700 hover:text-normal-500 active:text-normal-800 
    hover:underline focus:ring-2 focus:ring-offset-2 focus:ring-normal-500`,
  brand: `text-brand-700 hover:text-brand-500 active:text-brand-800
    hover:underline focus:ring-2 focus:ring-offset-2 focus:ring-brand-500`,
  success: `text-success-700 hover:text-success-500 active:text-success-800 
    hover:underline focus:ring-2 focus:ring-offset-2 focus:ring-success-500`,
  danger: `text-danger-700 hover:text-danger-500 active:text-danger-800 
    hover:underline focus:ring-2 focus:ring-offset-2 focus:ring-danger-500`,
  warning: `text-warning-700 hover:text-warning-500 active:text-warning-800 
    hover:underline focus:ring-2 focus:ring-offset-2 focus:ring-warning-500`,
  info: `text-info-700 bg-white hover:text-info-500 active:text-info-800 
    hover:underline focus:ring-2 focus:ring-offset-2 focus:ring-info-500`,
}

const UNSTYLED_COLOR_VARIANT_MAPS: Record<ButtonVariantColor, string> = {
  normal: `border focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 
    text-normal-700 bg-white border-normal-300 hover:bg-normal-50`,
  brand: `border focus:ring-2 focus:ring-offset-2 focus:ring-brand-500
    text-brand-700 bg-white border-brand-300 hover:bg-brand-50`,
  success: `border focus:ring-2 focus:ring-offset-2 focus:ring-success-500
    text-success-700 bg-white border-success-300 hover:bg-success-50`,
  danger: `border focus:ring-2 focus:ring-offset-2 focus:ring-danger-500
    text-danger-700 bg-white border-danger-300 hover:bg-danger-50`,
  warning: `border focus:ring-2 focus:ring-offset-2 focus:ring-warning-500
    text-warning-700 bg-white border-warning-300 hover:bg-warning-50`,
  info: `border focus:ring-2 focus:ring-offset-2 focus:ring-info-500
    text-info-700 bg-white border-info-300 hover:bg-info-50`,
}

const LEADING_ICON_SIZE_VARIANT_STYLES: Record<ButtonSizeVariant, string> = {
  xs: '-ml-0.5 mr-1.5 h-4 w-4',
  sm: '-ml-0.5 mr-2 h-4 w-4',
  md: '-ml-1 mr-2 h-5 w-5',
  lg: '-ml-1 mr-3 h-5 w-5',
  xl: '-ml-1 mr-3 h-5 w-5',
}

const TRAILING_ICON_SIZE_VARIANT_STYLES: Record<ButtonSizeVariant, string> = {
  xs: '-mr-0.5 ml-1.5 h-4 w-4',
  sm: '-mr-0.5 ml-2 h-4 w-4',
  md: '-mr-1 ml-2 h-5 w-5',
  lg: '-mr-1 ml-3 h-5 w-5',
  xl: '-mr-1 ml-3 h-5 w-5',
}

type ButtonSizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonVariantColor =
  | 'normal'
  | 'brand'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
type ButtonVariant = 'outlined' | 'ghost' | 'unstyled' | 'link' | 'solid'

export type ButtonProps = {
  /**
   * The button is in loading state
   */
  isLoading?: boolean

  /**
   * The button label text
   */
  children?: ReactNode

  /**
   * If `true`, the button will be disabled
   */
  isDisabled?: boolean

  /**
   * The html button type to use
   */
  type?: 'button' | 'submit' | 'reset'

  /**
   * The size of the button
   */
  size?: ButtonSizeVariant

  /**
   * The color of the button
   */
  variantColor?: ButtonVariantColor

  /**
   * The variant of the button style to use
   */
  variant?: ButtonVariant

  /**
   * The classname of the button
   */
  className?: string

  /**
   * leading icon type
   */
  leadingIcon?: PhosphorIcon | TablerIcon

  /**
   * trailing icon type
   */
  trailingIcon?: PhosphorIcon | TablerIcon

  /**
   * If `true`, the button will take up the full width of its container.
   */
  isFullWidth?: boolean
} & React.HTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  type = 'button',
  size = 'md',
  variant = 'unstyled',
  variantColor = 'normal',
  isDisabled = false,
  isLoading = false,
  className = '',
  leadingIcon,
  trailingIcon,
  isFullWidth = false,
  ...rest
}: ButtonProps) {
  const LeadingIcon = isLoading ? IconCircleDotted : leadingIcon
  const TrailingIcon = !isLoading && trailingIcon

  const isButtonDisabled = isDisabled || isLoading
  return (
    <button
      type={type}
      className={classNames(
        `inline-flex items-center font-medium shadow-sm focus:outline-none`,
        SIZE_VARIANT_STYLES[size],
        COLOR_VARIANT_MAPS(variant)[variantColor],
        (variant === 'ghost' || variant === 'link') && 'shadow-none',
        isButtonDisabled && 'cursor-not-allowed opacity-50',
        isFullWidth && 'w-full justify-center items-center',
        className
      )}
      {...rest}
    >
      {LeadingIcon && (
        <LeadingIcon
          className={classNames(
            LEADING_ICON_SIZE_VARIANT_STYLES[size],
            isLoading && 'animate-spin'
          )}
        />
      )}
      {children}
      {TrailingIcon && (
        <TrailingIcon
          className={classNames(TRAILING_ICON_SIZE_VARIANT_STYLES[size])}
        />
      )}
    </button>
  )
}
