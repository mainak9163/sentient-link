"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { clearAccessToken } from "@/lib/auth-token"
import { BoxLayout } from "@/components/atoms/box-layout/box-layout"
import type { LogoutButtonProps } from "./logout-button.types"

export function LogoutButton({ className, ...props }: LogoutButtonProps) {
  const router = useRouter()

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Check if the response was successful
      if (!response.ok) {
        // Server returned an error (500, 404, etc.)
        console.error("Logout failed with status:", response.status)
        
        // Still clear local token (fail-safe)
        clearAccessToken()
        
        toast.warning("Sign out unsuccesful", {
          description: "Server error - session may not be revoked",
        })
        
        router.replace("/login")
        return
      }

      // Success case
      clearAccessToken()
      toast.success("Logged out successfully")
      router.replace("/login")
    } catch (error) {
      // Network error (offline, no connection, etc.)
      console.error("Logout network error:", error)
      
      clearAccessToken()
      toast.error("Network error - logged out locally")
      router.replace("/login")
    }
  }

  return (
    <BoxLayout className={className}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        aria-label="Logout"
        {...props}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </BoxLayout>
  )
}
