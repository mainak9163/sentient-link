"use client"

import { FC } from 'react'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { setAccessToken } from '@/lib/auth-token'
import { BoxLayout } from '@/components/atoms/box-layout/box-layout'
import { SocialLoginProps } from './social-login.types'

export const SocialLogin: FC<SocialLoginProps> = ({ redirectTo = '/dashboard', className }) => {
  const router = useRouter()

  const handleGoogleSuccess = async (res: CredentialResponse) => {
    try {
      if (!res.credential) {
        throw new Error('No credential received')
      }

      const apiRes = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: res.credential,
        }),
      })

      const data = await apiRes.json()

      if (!apiRes.ok) {
        throw new Error(data.message)
      }

      setAccessToken(data.accessToken)
      toast.success('Logged in with Google')
      router.push(redirectTo)
    } catch {
      toast.error('Google login failed')
    }
  }

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed')
  }

  return (
    <BoxLayout className={className}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
    </BoxLayout>
  )
}
