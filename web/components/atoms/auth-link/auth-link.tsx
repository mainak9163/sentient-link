import { FC } from 'react'
import { AuthLinkProps } from './auth-link.types'
import Link from 'next/link'

export const AuthLink: FC<AuthLinkProps> = ({ 
  href, 
  text, 
  align = 'left',
  className 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <div className={`${alignClasses[align]} text-sm ${className || ''}`}>
      <Link href={href} className="underline underline-offset-4">
        {text}
      </Link>
    </div>
  )
}