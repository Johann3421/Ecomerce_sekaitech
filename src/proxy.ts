import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin")
  const isAuthenticated = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"

  if (isAdminPath && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const isAccountPath = req.nextUrl.pathname.startsWith("/account")
  const isCheckoutPath = req.nextUrl.pathname.startsWith("/checkout")

  if ((isAccountPath || isCheckoutPath) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
}
