import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyEdgeToken } from "@/lib/jwt-edge"

// jwt does not work on edge functions(middleware), so we use 'jose' in lib/jwt-edge.ts
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  const isAuthPage = pathname === "/login" || pathname === "/register"
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/links")

  // 1️⃣ User is NOT logged in
  if (!token) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }

  // 2️⃣ User HAS token → verify it
  try {
    await verifyEdgeToken(token)

    // Logged-in user visiting login/register → redirect to dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  } catch {
    // Invalid token → clear cookie + redirect
    const response = NextResponse.redirect(new URL("/login", req.url))
    response.cookies.set("token", "", { maxAge: 0 })
    return response
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/links/:path*",
    "/login",
    "/register",
  ],
}
