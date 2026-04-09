# Agent A: Auth Infrastructure

## Context

Baca file berikut sebelum memulai:

- `/docs/CONTEXT.md` - Project context
- `/types/database.types.ts` - Database types
- `/proxy.ts` - Middleware auth
- `/lib/supabase.ts` - Existing Supabase client

## Objective

Implement authentication infrastructure untuk admin dashboard. Meliputi:

1. Server-side Supabase client
2. Auth helper functions
3. Server actions untuk login/logout
4. Redesign login page dengan shadcn components

## Tasks

### Task 1: Create Server-Side Supabase Client

**File**: `/lib/supabase/server.ts` (NEW)

Buat file dengan implementasi berikut:

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie error in Server Component
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Handle cookie error in Server Component
          }
        },
      },
    }
  )
}
```

### Task 2: Create Auth Helper Functions

**File**: `/lib/auth.ts` (NEW)

Buat helper functions:

1. `getSession()` - Get current Supabase session
2. `getCurrentUser()` - Get user dengan profile data (join user_profiles)
3. `requireAuth()` - Require authentication, throw/redirect jika tidak authenticated
4. `requireRole(role: stakeholder_type)` - Require specific role

Contoh implementasi:

```typescript
import { createClient } from "./supabase/server"
import { redirect } from "next/navigation"

export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getUser()
  return session
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return { ...user, profile }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireRole(role: "internal" | "vendor" | "client") {
  const user = await requireAuth()
  if (user.profile?.stakeholder_type !== role) {
    redirect("/unauthorized")
  }
  return user
}
```

### Task 3: Install shadcn Form Components

Jalankan command:

```bash
pnpm dlx shadcn@latest add form
```

### Task 4: Create Auth Server Actions

**File**: `/actions/auth.ts` (NEW)

Buat server actions:

1. `loginAction(email, password)` - Login dengan Supabase auth
2. `logoutAction()` - Logout user

Contoh implementasi:

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user profile to determine redirect
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("stakeholder_type")
    .eq("id", data.user.id)
    .single()

  const stakeholderType = profile?.stakeholder_type

  // Redirect based on role
  if (stakeholderType === "internal") {
    redirect("/admin/dashboard")
  } else if (stakeholderType === "vendor") {
    redirect("/vendor/dashboard")
  } else if (stakeholderType === "client") {
    redirect("/client/dashboard")
  }

  redirect("/")
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
```

### Task 5: Redesign Login Page

**File**: `/app/(auth)/login/page.tsx` (UPDATE)

Requirements:

1. Gunakan shadcn components: Form, Input, Button
2. Primary color sudah di-set di theme (Green #16a34a)
3. Gunakan React Hook Form + Zod untuk validation
4. Gunakan Server Action untuk submit
5. Loading state dan error handling
6. Redirect sesuai stakeholder_type

Struktur:

```tsx
"use client"

import { loginAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// ... imports

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export default function LoginPage() {
  // Form dengan React Hook Form
  // Submit ke loginAction
  // Handle error dan loading
}
```

## Database Reference

### Table: user_profiles

```typescript
{
  id: string
  nama: string
  email: string
  stakeholder_type: "internal" | "vendor" | "client"
  role_id: string
  department_id: string | null
  // ... other fields
}
```

### Table: users

```typescript
{
  id: string
  email: string
  nama: string
  stakeholder_type: "internal" | "vendor" | "client"
  role_id: string
  // ... other fields
}
```

## Files to Create/Modify

| File                         | Action | Description                 |
| ---------------------------- | ------ | --------------------------- |
| `/lib/supabase/server.ts`    | CREATE | Server-side Supabase client |
| `/lib/auth.ts`               | CREATE | Auth helper functions       |
| `/actions/auth.ts`           | CREATE | Auth server actions         |
| `/app/(auth)/login/page.tsx` | UPDATE | Redesign login page         |

## Testing Checklist

- [ ] Server client bisa read cookies
- [ ] `getCurrentUser()` return null untuk unauthenticated user
- [ ] `getCurrentUser()` return user dengan profile untuk authenticated user
- [ ] `requireAuth()` redirect ke /login jika tidak authenticated
- [ ] `requireRole('internal')` redirect ke /unauthorized jika bukan admin
- [ ] Login page render dengan benara
- [ ] Login dengan kredensial valid redirect ke dashboard yang benar
- [ ] Login dengan kredensial invalid show error
- [ ] Logout redirect ke /login

## Notes

- Jangan modify `/proxy.ts` - sudah handle auth check untuk routes
- Pastikan import path benar untuk Server Components
- Gunakan `'use server'` directive untuk server actions
- Handle edge cases: user profile tidak ada, role tidak valid
