"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GoogleLogin } from "@react-oauth/google"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { setAccessToken } from "@/lib/auth-token"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED") {
          await resendVerification(email)
          return
        }

        throw new Error(data.message || "Login failed")
      }

      setAccessToken(data.accessToken)

      toast.success("Login successful")
      router.push("/dashboard")
    } catch (err) {
      toast.error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to login
          </p>
        </div>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <FieldSeparator>Or continue with</FieldSeparator>

        <GoogleLogin
          onSuccess={async (res) => {
            try {
              setLoading(true)

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
            } catch (erry) {
              toast.error("Google login failed")
            } finally {
              setLoading(false)
            }
          }}
          onError={() => toast.error("Google Sign-In failed")}
        />

        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <a href="/register" className="underline underline-offset-4">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
