import { ComponentProps } from 'react'

export type LogoProps = ComponentProps<'div'> & {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
}