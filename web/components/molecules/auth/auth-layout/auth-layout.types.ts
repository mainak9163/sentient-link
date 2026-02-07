import { ComponentProps, ReactNode } from 'react'

export type AuthLayoutProps = ComponentProps<'div'> & {
  children: ReactNode
  showImage?: boolean
  imageSrc?: string
  imageAlt?: string
  showThemeToggle?: boolean
}