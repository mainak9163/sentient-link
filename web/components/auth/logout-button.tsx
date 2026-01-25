"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { clearAccessToken } from "@/lib/auth-token"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      clearAccessToken()
      toast.success("Logged out successfully")

      router.replace("/login")
    } catch {
      toast.error("Failed to log out")
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  )
}
