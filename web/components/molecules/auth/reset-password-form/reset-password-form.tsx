"use client"

import { FC, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useResetPassword } from '@/hooks/use-reset-password'
import { FormHeader } from '@/components/atoms/form-header/form-header'
import { PasswordRequirements } from '@/components/atoms/password-requirements/password-requirements'
import { ResetPasswordFormProps } from './reset-password-form.types'

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ className, ...props }) => {
  const token = useSearchParams().get('token')
  const { reset, loading } = useResetPassword(token)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return
    reset(password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-4 min-w-96', className)}
      {...props}
    >
      <FormHeader
        title="Reset Password"
        description="Enter your new password below"
      />

      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      <PasswordRequirements password={password} />

      <Input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        disabled={loading}
        required
      />

      <Button type="submit" disabled={loading || password !== confirm}>
        {loading ? 'Resetting…' : 'Reset password'}
      </Button>
    </form>
  )
}