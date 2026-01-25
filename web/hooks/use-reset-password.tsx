"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useResetPassword(token: string | null) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function reset(password: string) {
    if (!token) {
      toast.error("Invalid reset link")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.code === "INVALID_OR_EXPIRED_TOKEN") {
          toast.error("Reset link expired or invalid")
        } else {
          toast.error("Password reset failed")
        }
        return
      }

      toast.success("Password reset successful")
      router.replace("/login")
    } catch {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  return { reset, loading }
}
