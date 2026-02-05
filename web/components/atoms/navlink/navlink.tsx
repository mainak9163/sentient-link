import { FC } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavLinkProps } from './navlink.types'


export const NavLink: FC<NavLinkProps> = ({ 
  href, 
  variant = 'ghost', 
  icon,
  children,
  className 
}) => {
  if (variant === 'primary') {
    return (
      <Link href={href}>
        <Button
          className={`bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all ${className || ''}`}
        >
          {children}
          {icon}
        </Button>
      </Link>
    )
  }

  return (
    <Link href={href}>
      <Button variant="ghost" className={className}>
        {children}
        {icon}
      </Button>
    </Link>
  )
}