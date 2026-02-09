"use client"

import { useEffect } from "react"
import { loadAccessToken } from "@/lib/auth-token"
import { Navbar } from "@/components/molecules/navbar/navbar"



export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Load access token from sessionStorage on mount
  useEffect(() => {
    loadAccessToken()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="p-6 flex-1 flex flex-col justify-center items-center">{children}</main>
    </div>
  )
}
