"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useRegister() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function register(
    name: string,
    email: string,
    password: string
  ) {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Registration failed")
        return
      }

      toast.success(
        "Account created! Please check your email to verify your account."
      )

      setTimeout(() => {
        router.push("/login")
      }, 2500)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    loading,
  }
}
