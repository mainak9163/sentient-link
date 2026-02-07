"use client"

import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForgotPassword } from '@/hooks/use-forgot-password'
import { FormHeader } from '@/components/atoms/form-header/form-header'
import { ForgotPasswordFormProps } from './forgot-password-form.types'

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ className, ...props }) => {
  const { send, loading } = useForgotPassword()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(email)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-4 min-w-80', className)}
      {...props}
    >
      <FormHeader
        title="Forgot Password"
        description="Enter your email to receive a reset link"
      />

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  )
}