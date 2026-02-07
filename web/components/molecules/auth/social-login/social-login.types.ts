import { ComponentProps } from 'react'

export type SocialLoginProps = ComponentProps<'div'> & {
  redirectTo?: string
}