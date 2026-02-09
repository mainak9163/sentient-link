"use client"

import Link from "next/link"
import { useAuthStatus } from "@/hooks/use-auth-status"
import { Link2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "./auth/logout-button"
import { ThemeToggle } from "./ui/theme-toggle"

export function Navbar() {
  const isAuthenticated = useAuthStatus()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center subtle-shadow
group-hover:card-hover transition-all">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">SentientLink</span>
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/links">
                  <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
                    <User className="h-4 w-4 mr-2" />
                    My Links
                  </Button>
                </Link>
                <ThemeToggle />
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
