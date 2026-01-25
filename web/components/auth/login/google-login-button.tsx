"use client"

import { GoogleLogin } from "@react-oauth/google"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { setAccessToken } from "@/lib/auth-token"

export function GoogleLoginButton() {
  const router = useRouter()

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        try {
          const apiRes = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: res.credential,
            }),
          })

          const data = await apiRes.json()

          if (!apiRes.ok) {
            throw new Error(data.message)
          }

          setAccessToken(data.accessToken)
          toast.success("Logged in with Google")
          router.push("/dashboard")
        } catch {
          toast.error("Google login failed")
        }
      }}
      onError={() => toast.error("Google Sign-In failed")}
    />
  )
}
