import { ComponentProps } from 'react'

export type NavLinkProps = ComponentProps<'a'> & {
  href: string
  variant?: 'ghost' | 'primary'
  icon?: React.ReactNode
}