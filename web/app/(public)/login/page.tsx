import { AuthLayout } from "@/components/molecules/auth/auth-layout/auth-layout";
import { LoginForm } from "@/components/molecules/auth/login-form/login-form";


export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}