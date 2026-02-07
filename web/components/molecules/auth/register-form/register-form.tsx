"use client"

import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldDescription, FieldSeparator } from '@/components/ui/field'
import { useRegister } from '@/hooks/use-register'
import { FormHeader } from '@/components/atoms/form-header/form-header'
import { FormField } from '@/components/atoms/form-field/form-field'
import { PasswordRequirements } from '@/components/atoms/password-requirements/password-requirements'
import { RegisterFormProps } from './register-form.types'
import { SocialLogin } from '../social-login/social-login'


export const RegisterForm: FC<RegisterFormProps> = ({ className, ...props }) => {
  const { register, loading } = useRegister()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(name, email, password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      <FieldGroup>
        <FormHeader
          title="Create an account"
          description="Enter your details below to create your account"
        />

        <FormField
          label="Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
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

        <div>
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <PasswordRequirements password={password} />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>

        <FieldSeparator>Or continue with</FieldSeparator>

        <SocialLogin/>

        <FieldDescription className="text-center">
          Already have an account?{' '}
          <a href="/login" className="underline underline-offset-4">
            Log in
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}