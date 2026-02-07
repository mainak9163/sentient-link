import { ComponentProps } from 'react'

export type FormFieldProps = ComponentProps<'input'> & {
  label: string
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
}