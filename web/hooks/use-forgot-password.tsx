"use client"

import { useState } from "react"
import { toast } from "sonner"

export function useForgotPassword() {
  const [loading, setLoading] = useState(false)

  async function send(email: string) {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok && data.code === "EMAIL_REQUIRED") {
        toast.error("Email is required")
        return
      }

      toast.success(
        "If an account exists, a password reset link has been sent"
      )
    } catch {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  return { send, loading }
}
