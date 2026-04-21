import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = [
  "/",
  "/login",
  "/vendor/login",
  "/unauthorized",
  "/about",
  "/vendor/register",
  "/vendor/register/success",
  "/vendor/set-password",
  "/terms/vendor",
  "/terms/client",
  "/privacy",
  "/progress",
  "/auth/callback",
]

const isPublicRoute = (pathname: string) => {
  if (pathname.startsWith("/api/")) return true
  if (pathname.startsWith("/auth/")) return true
  return publicRoutes.includes(pathname)
}

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const publicRoute = isPublicRoute(pathname)
  const isAuthRoute = pathname.startsWith("/auth/")

  if (publicRoute || isAuthRoute) {
    return supabaseResponse
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stakeholder_type")
    .eq("id", user.id)
    .single()

  const stakeholderType = profile?.stakeholder_type

  if (pathname.startsWith("/vendor/")) {
    if (stakeholderType !== "vendor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    // Check vendor registration status for onboarding redirect
    const { data: profile, error: profileError } = await supabase
      .from("vendor_profiles")
      .select("status, registration_status")
      .eq("user_id", user.id)
      .single()

    const isOnboardingPage = pathname === "/vendor/onboarding"

    // Onboarding needed only if: no profile OR registration still editable
    const needsOnboarding =
      !profile ||
      profileError ||
      profile.registration_status === "draft" ||
      profile.registration_status === "revision_requested"

    // Redirect to onboarding if: not on onboarding page AND needs onboarding
    if (!isOnboardingPage && needsOnboarding) {
      return NextResponse.redirect(new URL("/vendor/onboarding", request.url))
    }

    // Redirect away from onboarding if: on onboarding page AND has submitted profile
    if (
      isOnboardingPage &&
      profile?.registration_status &&
      !["draft", "revision_requested"].includes(profile.registration_status)
    ) {
      return NextResponse.redirect(new URL("/vendor/dashboard", request.url))
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
