"use client"
import { AuthLayout } from "@/components/molecules/auth/auth-layout/auth-layout"
import { ResetPasswordForm } from "@/components/molecules/auth/reset-password-form/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm/>
    </AuthLayout>
  )
}
