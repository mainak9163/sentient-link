"use client"

import { FC } from "react"
import { ArrowRight, User } from "lucide-react"
import { Logo } from "@/components/atoms/logo/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NavbarProps } from "./navbar.types"
import { NavLink } from "@/components/atoms/navlink/navlink"
import { LogoutButton } from "@/components/molecules/auth/logout-button/logout-button"
import { useAuthStatus } from "@/hooks/use-auth-status"

export const Navbar: FC<NavbarProps> = ({ className }) => {
  const isAuthenticated = useAuthStatus()

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NavLink href="/dashboard" variant="ghost">
                  Dashboard
                </NavLink>
                <NavLink href="/links" variant="ghost" icon={<User className="ml-2 h-4 w-4" />}>
                  My Links
                </NavLink>
                <ThemeToggle />
                <LogoutButton />
              </>
            ) : (
              <>
                <NavLink href="/login" variant="ghost">
                  Log In
                </NavLink>
                <NavLink
                  href="/register"
                  variant="primary"
                  icon={<ArrowRight className="ml-2 h-4 w-4" />}
                >
                  Get Started
                </NavLink>
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
