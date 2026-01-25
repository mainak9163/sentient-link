import { transporter } from "./email"

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.WEB_URL}/verify-email?token=${token}`

  await transporter.sendMail({
    from: `"URL Shortener" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Welcome 👋</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 30 minutes.</p>
    `,
  })
}
