import { ComponentProps } from 'react'

export type FormHeaderProps = ComponentProps<'div'> & {
  title: string
  description?: string
}