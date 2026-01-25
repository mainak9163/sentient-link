"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForgotPassword } from "@/hooks/use-forgot-password"

export function ForgotPasswordForm() {
  const { send, loading } = useForgotPassword()
  const [email, setEmail] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        send(email)
      }}
      className="flex flex-col gap-4 min-w-80"
    >
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />

      <Button disabled={loading}>
        {loading ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  )
}
