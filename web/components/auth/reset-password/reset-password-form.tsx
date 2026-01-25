"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useResetPassword } from "@/hooks/use-reset-password"
import { PasswordRequirements } from "../password-requirements"

export function ResetPasswordForm() {
  const token = useSearchParams().get("token")
  const { reset, loading } = useResetPassword(token)

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (password !== confirm) return
        reset(password)
      }}
      className="flex flex-col gap-4 min-w-96"
    >
      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      <PasswordRequirements password={password} />

      <Input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        disabled={loading}
        required
      />

      <Button disabled={loading || password !== confirm}>
        {loading ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  )
}
