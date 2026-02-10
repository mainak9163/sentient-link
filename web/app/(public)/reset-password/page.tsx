"use client"
import { Suspense } from "react"
import { AuthLayout } from "@/components/molecules/auth/auth-layout/auth-layout"
import { ResetPasswordForm } from "@/components/molecules/auth/reset-password-form/reset-password-form"
import { LoadingSpinner } from "@/components/atoms/loading-spinner/loading-spinner"

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<LoadingSpinner size="md" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
