"use client"

import { useState } from "react"
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

import { useRegister } from "@/hooks/use-register"
import { PasswordRequirements } from "../password-requirements"
import { GoogleLoginButton } from "../login/google-login-button"


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, loading } = useRegister()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    register(name, email, password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <PasswordRequirements password={password} />
        </Field>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>

        <FieldSeparator>Or continue with</FieldSeparator>

        <GoogleLoginButton />

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Log in
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
