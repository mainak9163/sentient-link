import { AuthLayout } from "@/components/molecules/auth/auth-layout/auth-layout";
import { RegisterForm } from "@/components/molecules/auth/register-form/register-form";


export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}