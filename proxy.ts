import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { CookieOptions } from "@supabase/ssr"

const publicRoutes = [
  "/",
  "/login",
  "/unauthorized",
  "/about",
  "/vendor/register",
  "/vendor/register/success",
  "/terms/vendor",
  "/terms/client",
  "/privacy",
]

export default async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = pathname.startsWith("/auth/")

  if (isPublicRoute || isAuthRoute) {
    return supabaseResponse
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("stakeholder_type")
    .eq("id", user.id)
    .single()

  const stakeholderType = profile?.stakeholder_type

  if (pathname.startsWith("/vendor/")) {
    if (stakeholderType !== "vendor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  } else if (pathname.startsWith("/client/")) {
    if (stakeholderType !== "client") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  } else if (pathname.startsWith("/admin/")) {
    if (stakeholderType !== "internal") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  if (stakeholderType === "vendor" && !pathname.startsWith("/vendor/")) {
    return NextResponse.redirect(new URL("/vendor/dashboard", request.url))
  } else if (stakeholderType === "client" && !pathname.startsWith("/client/")) {
    return NextResponse.redirect(new URL("/client/dashboard", request.url))
  } else if (
    stakeholderType === "internal" &&
    !pathname.startsWith("/admin/")
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
