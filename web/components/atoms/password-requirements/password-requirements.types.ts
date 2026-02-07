import { ComponentProps } from 'react'

export type PasswordRequirementsProps = ComponentProps<'ul'> & {
  password: string
}

export type PasswordRule = {
  label: string
  test: (value: string) => boolean
}