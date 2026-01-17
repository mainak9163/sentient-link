"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link")
      router.replace("/login")
      return
    }

    async function verifyEmail() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Verification failed")
        }

        toast.success("Email verified successfully! You can now log in.")

        setTimeout(() => {
          router.replace("/login")
        }, 2500)
      } catch (err) {
        toast.error("Verification link is invalid or expired")
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
