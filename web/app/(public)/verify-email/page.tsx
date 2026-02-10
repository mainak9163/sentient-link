import { Suspense } from "react"
import { VerifyEmailContent } from "@/components/molecules/auth/verify-email/verify-email"
import { LoadingSpinner } from "@/components/atoms/loading-spinner/loading-spinner"


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="md" />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
