import { ComponentProps } from 'react'

export type LoadingSpinnerProps = ComponentProps<'div'> & {
  size?: 'sm' | 'md' | 'lg'
  title?: string
  description?: string
}