"use client"

import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldDescription, FieldSeparator } from '@/components/ui/field'
import { useLogin } from '@/hooks/use-login'
import { FormHeader } from '@/components/atoms/form-header/form-header'
import { FormField } from '@/components/atoms/form-field/form-field'
import { AuthLink } from '@/components/atoms/auth-link/auth-link'
import { LoginFormProps } from './login-form.types'
import { SocialLogin } from '../social-login/social-login'

export const LoginForm: FC<LoginFormProps> = ({ className, ...props }) => {
  const { login, loading } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <FormHeader
          title="Login to your account"
          description="Enter your email below to login"
        />

        <FormField
          label="Email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <AuthLink
          href="/forgot-password"
          text="Forgot password?"
          align="right"
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <FieldSeparator>Or continue with</FieldSeparator>

        <SocialLogin />

        <FieldDescription className="text-center">
          Don&apos;t have an account?{' '}
          <a href="/register" className="underline underline-offset-4">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}