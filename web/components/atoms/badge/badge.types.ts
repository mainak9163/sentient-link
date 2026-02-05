import { ComponentProps, ReactNode } from 'react'

export type BadgeProps = ComponentProps<'div'> & {
  icon?: ReactNode
  text: string
}