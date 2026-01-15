import { transporter } from "./email"

export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `"URL Shortener" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in 30 minutes.</p>
    `,
  })
}
