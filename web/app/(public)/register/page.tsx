import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"
import { RegisterForm } from "@/components/auth/register/register-form"

export default function RegisterPage() {
  return (
    <div className="grid max-h-screen overflow-y-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      </div>
    </div>
  )
}
