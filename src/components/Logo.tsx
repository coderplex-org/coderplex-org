import Image from 'next/image'
import classNames from 'classnames'
import { A } from '@/components'

export default function Logo({
  className = '',
  size = 32,
}: {
  className?: string
  size?: number
}) {
  return (
    <A href="/" className="flex items-center cursor-pointer">
      <Image src="/logo.svg" width={size} height={size} alt="Coderplex Logo" />
      <span className={classNames('ml-2 text-xl font-semibold', className)}>
        Coderplex
      </span>
    </A>
  )
}
