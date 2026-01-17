import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyRefreshToken } from "./lib/jwt"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const refreshToken = req.cookies.get("refreshToken")?.value

  const isAuthPage =
    pathname === "/login" || pathname === "/register"

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/links")

  /* =========================
     NO TOKEN PRESENT
  ========================= */

  if (!refreshToken) {
    if (isProtectedRoute) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      )
    }
    return NextResponse.next()
  }

  /* =========================
     TOKEN PRESENT → VERIFY
  ========================= */

  try {
    await verifyRefreshToken(refreshToken)

    // Logged-in user trying to access login/register
    if (isAuthPage) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      )
    }

    return NextResponse.next()
  } catch {
    // Invalid / expired token → clear + redirect
    // const response = NextResponse.redirect(
    //   new URL("/login", req.url)
    // )

    // response.cookies.set("edge_token", "", {
    //   maxAge: 0,
    //   path: "/",
    // })

    // return response
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
