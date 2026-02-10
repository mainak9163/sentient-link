"use client"

import { FC, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/atoms/loading-spinner/loading-spinner'
import { BoxLayout } from '@/components/atoms/box-layout/box-layout'
import { VerifyEmailContentProps } from './verify-email.types'

export const VerifyEmailContent: FC<VerifyEmailContentProps> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  // Prevent double execution (React Strict Mode)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (!token) {
      toast.error('Invalid verification link')
      router.replace('/login')
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token ?? '')}`,
          {
            method: 'GET',
          }
        )

        const data = await res.json()

        if (!res.ok) {
          switch (data.code) {
            case 'TOKEN_MISSING':
              toast.error('Verification token is missing')
              break

            case 'INVALID_OR_EXPIRED_TOKEN':
              toast.error('Verification link is invalid or expired')
              break

            default:
              toast.error(data.message || 'Email verification failed')
          }

          setTimeout(() => router.replace('/login'), 3000)
          return
        }

        toast.success('Email verified successfully! You can now log in 🎉')

        setTimeout(() => {
          router.replace('/login')
        }, 2500)
      } catch {
        toast.error('Network error while verifying email')

        setTimeout(() => {
          router.replace('/login')
        }, 3000)
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <BoxLayout className={`flex min-h-svh items-center justify-center px-6 ${className || ''}`}>
      <LoadingSpinner
        title="Verifying your email…"
        description="Please wait while we confirm your email address."
      />
    </BoxLayout>
  )
}
