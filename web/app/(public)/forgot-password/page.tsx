"use client"

import { AuthLayout } from "@/components/molecules/auth/auth-layout/auth-layout"
import { ForgotPasswordForm } from "@/components/molecules/forgot-password-form/forget-password-form"
export default function ForgotPasswordPage() {

  return (
    <AuthLayout>
      <ForgotPasswordForm/>
    </AuthLayout>
  )
}
