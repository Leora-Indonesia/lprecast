# Task 11: SPV Auth & Layout

## Objective

Setup authentication dan layout khusus untuk role SPV.

## Requirements

### Auth Setup

**Role: `spv`**

- stakeholder_type = 'spv' di table users
- Login sama (shared auth)
- Redirect to /spv/dashboard setelah login

**Middleware Check** (if needed):

- `/spv/*` routes: check stakeholder_type === 'spv'
- Redirect ke /unauthorized jika bukan SPV

### Layout

**`/app/(spv)/layout.tsx`**

- Sidebar (simplified)
- Header dengan user info
- Similar to admin layout tapi menu lebih sedikit

### Sidebar Menu

```typescript
const spvMenuItems = [
  { title: "Dashboard", href: "/spv/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/spv/projects", icon: FileText },
  { title: "Verifikasi", href: "/spv/verifications", icon: CheckCircle },
]
```

### Routes

```
/spv/
├── layout.tsx           # SPV layout wrapper
├── page.tsx             # Redirect to /spv/dashboard
├── dashboard/
│   └── page.tsx         # SPV dashboard (task 10)
├── projects/
│   └── page.tsx         # List assigned projects (read-only)
└── verifications/
    ├── page.tsx         # List pending verifications (task 9)
    └── [id]/
        └── page.tsx     # Detail verifikasi
```

### Permission

SPV bisa:

- ✅ View assigned projects (read-only)
- ✅ View vendors (read-only, basic info)
- ✅ Verify progress (approve/reject)
- ❌ Create/edit projects
- ❌ Approve/reject vendors
- ❌ Create tenders

### Server Helper

Tambahkan ke `/lib/auth.ts`:

```typescript
export async function requireSPV() {
  const user = await requireAuth()
  if (user.profile?.stakeholder_type !== "spv") {
    redirect("/unauthorized")
  }
  return user
}
```

## Files to Create

| File                              | Description           |
| --------------------------------- | --------------------- |
| `/app/(spv)/layout.tsx`           | SPV layout wrapper    |
| `/app/(spv)/page.tsx`             | Redirect to dashboard |
| `/components/spv/spv-sidebar.tsx` | SPV sidebar           |
| `/components/spv/spv-header.tsx`  | SPV header            |
| `/components/spv/spv-layout.tsx`  | Layout component      |

## Testing Checklist

- [ ] SPV bisa login
- [ ] Redirect ke /spv/dashboard
- [ ] Sidebar menu sesuai permission
- [ ] Tidak bisa akses admin routes
- [ ] Unauthorized page muncul jika try akses admin
- [ ] Layout responsive

## Notes

- SPV assignment ke project: bisa manual oleh admin
- atau bisa dibuatkan page "Assign SPV" (optional)
- Sementara asumsikan SPV sudah di-assign ke project via DB
- Layout mirip admin tapi simplified
