import { FC } from 'react'
import { AuthLinkProps } from './auth-link.types'
import { BoxLayout } from '@/components/atoms/box-layout/box-layout'
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
    <BoxLayout className={`${alignClasses[align]} text-sm ${className || ''}`}>
      <Link href={href} className="underline underline-offset-4">
        {text}
      </Link>
    </BoxLayout>
  )
}
