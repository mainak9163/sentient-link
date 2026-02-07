import { ComponentProps } from 'react'

export type AuthLinkProps = ComponentProps<'a'> & {
  href: string
  text: string
  align?: 'left' | 'center' | 'right'
}