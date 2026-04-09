# Admin Dashboard Implementation Plan

## Overview

Implementasi admin dashboard untuk LPrecast dengan 2 agents yang bekerja paralel.

## Agents

### Agent A: Auth Infrastructure

**File**: `docs/tasks/agent-a-auth.md`

Focus:

- Server-side Supabase client
- Auth helper functions
- Login/logout server actions
- Login page redesign

Estimated files: 4 files (3 new, 1 modify)

### Agent B: Admin UI Components

**File**: `docs/tasks/agent-b-admin-ui.md`

Focus:

- Install shadcn components
- DataTable component
- Admin layout (sidebar + header)
- Dashboard stats
- Coming Soon pages

Estimated files: 13 files (10 new, 3 modify)

## Parallel Execution

Kedua agent bisa bekerja paralel karena:

1. **File tidak overlap** - Files yang dibuat oleh masing-masing agent berbeda
2. **Minimal dependency** - Agent B pakai placeholder untuk auth integration
3. **Integration point jelas** - Setelah kedua agent selesai, lakukan integrasi

## Execution Order

### Start Both Agents (Parallel)

```bash
# Terminal 1 - Agent A
# Read: docs/tasks/agent-a-auth.md
# Execute tasks in order

# Terminal 2 - Agent B
# Read: docs/tasks/agent-b-admin-ui.md
# Execute tasks in order
```

### After Both Agents Complete (Integration)

1. Update `/app/(admin)/layout.tsx` to use `getCurrentUser()`
2. Update `/app/(admin)/admin/dashboard/page.tsx` to fetch real stats
3. Update `/app/(admin)/admin/vendors/page.tsx` to fetch vendor data

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Framework | Next.js 16 (App Router)       |
| Auth      | Supabase Auth + @supabase/ssr |
| UI        | shadcn/ui (radix-vega)        |
| Tables    | TanStack Table v8             |
| Styling   | Tailwind CSS v4               |
| Theme     | Green Primary (#16a34a)       |
| Icons     | Lucide React                  |
| Forms     | React Hook Form + Zod         |
| Toast     | Sonner                        |

## File Structure

```
/app/(admin)/
├── layout.tsx                    → AdminLayout
├── page.tsx                      → redirect('/admin/dashboard')
├── admin/
│   ├── dashboard/page.tsx        → Stats + Recent Activity
│   ├── vendors/
│   │   ├── page.tsx              → DataTable + filters
│   │   └── [id]/page.tsx         → Detail + approval form
│   ├── clients/page.tsx          → Coming Soon
│   ├── tenders/page.tsx          → Coming Soon
│   └── users/page.tsx            → Coming Soon

/components/admin/
├── admin-layout.tsx
├── admin-sidebar.tsx
├── admin-header.tsx
├── stat-card.tsx
└── coming-soon.tsx

/components/ui/
├── data-table.tsx
├── status-badge.tsx
└── [existing components]

/lib/
├── supabase/
│   ├── client.ts                 → [existing]
│   └── server.ts                 → NEW
├── auth.ts                       → NEW
└── [existing files]

/actions/
├── auth.ts                       → NEW
└── vendor.ts                     → NEW (later)
```

## Dependencies to Install

```bash
# shadcn components
pnpm dlx shadcn@latest add form sidebar avatar dropdown-menu skeleton badge table

# TanStack Table
pnpm add @tanstack/react-table
```

## Database Tables Used

| Table                    | Usage                                |
| ------------------------ | ------------------------------------ |
| `users`                  | Auth user data                       |
| `user_profiles`          | User profile dengan stakeholder_type |
| `vendor_registrations`   | Vendor registration status           |
| `vendor_company_info`    | Company information                  |
| `vendor_legal_documents` | Legal documents (verification)       |
| `clients`                | Client data                          |

## Vendor Registration Status

| Status               | Label     |
| -------------------- | --------- |
| `draft`              | Draft     |
| `submitted`          | Diajukan  |
| `under_review`       | Ditinjau  |
| `approved`           | Disetujui |
| `rejected`           | Ditolak   |
| `revision_requested` | Revisi    |

## Stakeholder Types

| Type       | Redirect          |
| ---------- | ----------------- |
| `internal` | /admin/dashboard  |
| `vendor`   | /vendor/dashboard |
| `client`   | /client/dashboard |

## Testing Checklist

### Agent A

- [ ] Server client read cookies
- [ ] `getCurrentUser()` return user with profile
- [ ] `requireAuth()` redirect to /login
- [ ] `requireRole('internal')` redirect to /unauthorized
- [ ] Login page render
- [ ] Login redirect based on role
- [ ] Logout redirect to /login

### Agent B

- [ ] Sidebar render with menu items
- [ ] Header render with user dropdown
- [ ] DataTable component render
- [ ] StatusBadge component render
- [ ] StatCard component render
- [ ] Coming Soon pages render
- [ ] Admin layout wrap content
- [ ] Redirect /admin → /admin/dashboard

### Integration

- [ ] Dashboard fetch real stats
- [ ] Vendor list display real data
- [ ] Header display real user data
- [ ] Auth flow end-to-end

## Notes

- Read `/docs/CONTEXT.md` before starting
- Primary color: Green (#16a34a) - already set in theme
- Use Indonesian for UI text
- Use Server Components by default
- Use 'use client' only when needed
- Follow shadcn/ui patterns
