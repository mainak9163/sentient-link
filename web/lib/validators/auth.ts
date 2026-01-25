import { z } from "zod"

/* -------------------------------------------------------------------------- */
/*                                REGISTER                                    */
/* -------------------------------------------------------------------------- */

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
})

export type RegisterInput = z.infer<typeof registerSchema>

/* -------------------------------------------------------------------------- */
/*                                  LOGIN                                     */
/* -------------------------------------------------------------------------- */

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>

/* -------------------------------------------------------------------------- */
/*                             RESET PASSWORD                                  */
/* -------------------------------------------------------------------------- */

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
