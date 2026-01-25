"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  //  Prevent double execution (React Strict Mode)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (!token) {
      toast.error("Invalid verification link")
      router.replace("/login")
      return
    }

    async function verifyEmail() {
      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token?? "")}`,
          {
            method: "GET",
          }
        )

        const data = await res.json()

        if (!res.ok) {
          switch (data.code) {
            case "TOKEN_MISSING":
              toast.error("Verification token is missing")
              break

            case "INVALID_OR_EXPIRED_TOKEN":
              toast.error("Verification link is invalid or expired")
              break

            default:
              toast.error(data.message || "Email verification failed")
          }

          setTimeout(() => router.replace("/login"), 3000)
          return
        }

        toast.success("Email verified successfully! You can now log in 🎉")

        setTimeout(() => {
          router.replace("/login")
        }, 2500)
      } catch {
        toast.error("Network error while verifying email")

        setTimeout(() => {
          router.replace("/login")
        }, 3000)
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <h1 className="text-xl font-semibold">Verifying your email…</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we confirm your email address.
        </p>
      </div>
    </div>
  )
}
