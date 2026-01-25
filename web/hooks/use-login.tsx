"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { setAccessToken } from "@/lib/auth-token"

type LoginErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_DISABLED"
  | "OAUTH_ONLY_ACCOUNT"

export function useLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function resendVerification(email: string) {
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      toast.info(
        "Your email is not verified. A new verification link has been sent."
      )
    } catch {
      toast.error("Failed to resend verification email")
    }
  }

  async function login(email: string, password: string) {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        const code = data.code as LoginErrorCode | undefined

        switch (code) {
          case "INVALID_INPUT":
            toast.error("Please enter a valid email and password")
            break

          case "INVALID_CREDENTIALS":
            toast.error("Incorrect email or password")
            break

          case "EMAIL_NOT_VERIFIED":
            toast.warning("Your email is not verified", {
              action: {
                label: "Resend",
                onClick: () => resendVerification(email),
              },
            })
            break

          case "ACCOUNT_DISABLED":
            toast.error("Your account has been disabled")
            break

          case "OAUTH_ONLY_ACCOUNT":
            toast.error("Please sign in using Google")
            break

          default:
            toast.error(data.message || "Login failed")
        }

        return
      }

      setAccessToken(data.accessToken)
      toast.success("Welcome back 👋")
      router.push("/dashboard")
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    loading,
  }
}
