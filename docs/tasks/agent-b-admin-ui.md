# Agent B: Admin UI Components

## Context

Baca file berikut sebelum memulai:

- `/docs/CONTEXT.md` - Project context
- `/types/database.types.ts` - Database types
- `/lib/theme-config.ts` - Theme colors
- `/components/vendor/vendor-header.tsx` - Contoh header component
- `/components/ui/` - Existing shadcn components

## Objective

Implement admin dashboard UI components dan layout. Meliputi:

1. Install shadcn components yang diperlukan
2. DataTable component (TanStack Table)
3. Status Badge component
4. Admin Layout (Sidebar + Header)
5. Dashboard stat cards
6. Coming Soon pages untuk Phase 2

## Tasks

### Task 1: Install Dependencies

Jalankan commands:

```bash
pnpm dlx shadcn@latest add sidebar avatar dropdown-menu skeleton badge table
pnpm add @tanstack/react-table
```

### Task 2: Create DataTable Component

**File**: `/components/ui/data-table.tsx` (NEW)

Buat generic DataTable dengan TanStack Table:

- Sorting
- Filtering (search)
- Pagination
- Column visibility toggle

Contoh implementasi:

```typescript
'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Button } from './button'
import { Input } from './input'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Cari...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
  })

  return (
    <div>
      {searchKey && (
        <div className="py-4">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          {/* Table headers and rows */}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}
```

### Task 3: Create Status Badge Component

**File**: `/components/ui/status-badge.tsx` (NEW)

Buat status badge untuk vendor registration status:

```typescript
import { Badge } from './badge'

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' },
  submitted: { label: 'Diajukan', variant: 'default' },
  under_review: { label: 'Ditinjau', variant: 'default' },
  approved: { label: 'Disetujui', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'destructive' },
  revision_requested: { label: 'Revisi', variant: 'warning' },
} as const

type VendorStatus = keyof typeof statusConfig

interface StatusBadgeProps {
  status: VendorStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
```

### Task 4: Create Admin Sidebar Component

**File**: `/components/admin/admin-sidebar.tsx` (NEW)

Buat sidebar dengan shadcn Sidebar component:

```typescript
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Building2, Users, FileText, UserCog } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Vendors', href: '/admin/vendors', icon: Building2 },
  { title: 'Clients', href: '/admin/clients', icon: Users, soon: true },
  { title: 'Tenders', href: '/admin/tenders', icon: FileText, soon: true },
  { title: 'Users', href: '/admin/users', icon: UserCog, soon: true },
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        {/* Logo */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.soon && <Badge variant="secondary">Phase 2</Badge>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Footer content */}
      </SidebarFooter>
    </Sidebar>
  )
}
```

### Task 5: Create Admin Header Component

**File**: `/components/admin/admin-header.tsx` (NEW)

Header dengan user dropdown:

```typescript
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'

// Placeholder untuk auth - akan diintegrate dengan Agent A
interface UserData {
  nama: string
  email: string
}

interface AdminHeaderProps {
  user?: UserData | null
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{user.nama.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.nama}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>{user.nama}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="text-muted-foreground">Loading...</div>
          )}
        </div>
      </div>
    </header>
  )
}
```

### Task 6: Create Admin Layout

**File**: `/components/admin/admin-layout.tsx` (NEW)

Layout wrapper dengan SidebarProvider:

```typescript
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

interface AdminLayoutProps {
  children: React.ReactNode
  user?: { nama: string; email: string } | null
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
```

### Task 7: Update Admin Route Layout

**File**: `/app/(admin)/layout.tsx` (UPDATE)

```typescript
import { AdminLayout } from '@/components/admin/admin-layout'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Integrate dengan getCurrentUser() dari Agent A
  // const user = await getCurrentUser()

  return (
    <AdminLayout user={null}>
      {children}
    </AdminLayout>
  )
}
```

### Task 8: Create Admin Redirect Page

**File**: `/app/(admin)/page.tsx` (UPDATE)

```typescript
import { redirect } from "next/navigation"

export default function AdminPage() {
  redirect("/admin/dashboard")
}
```

### Task 9: Create Stat Card Component

**File**: `/components/admin/stat-card.tsx` (NEW)

Dashboard stat card:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
```

### Task 10: Create Coming Soon Page Component

**File**: `/components/admin/coming-soon.tsx` (NEW)

```typescript
import { Construction } from 'lucide-react'

interface ComingSoonProps {
  title: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Construction className="h-16 w-16 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">
          Fitur ini akan tersedia di Phase 2
        </p>
      </div>
    </div>
  )
}
```

### Task 11: Create Coming Soon Pages

**File**: `/app/(admin)/admin/clients/page.tsx` (NEW)
**File**: `/app/(admin)/admin/tenders/page.tsx` (UPDATE)
**File**: `/app/(admin)/admin/users/page.tsx` (NEW)

```typescript
// /app/(admin)/admin/clients/page.tsx
import { ComingSoon } from '@/components/admin/coming-soon'

export const metadata = {
  title: 'Clients | Admin LPrecast',
  description: 'Manajemen klien LPrecast',
}

export default function ClientsPage() {
  return <ComingSoon title="Manajemen Klien" />
}
```

### Task 12: Update Dashboard Page (Placeholder)

**File**: `/app/(admin)/admin/dashboard/page.tsx` (UPDATE)

```typescript
import { Building2, Users, FileText, Clock } from 'lucide-react'
import { StatCard } from '@/components/admin/stat-card'

export const metadata = {
  title: 'Dashboard Admin | LPrecast',
  description: 'Kelola dan pantau seluruh aktivitas proyek konstruksi',
}

export default async function AdminDashboard() {
  // TODO: Fetch stats from database (integrate with Agent A's auth)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vendor"
          value="-"
          description="Vendor aktif"
          icon={Building2}
        />
        <StatCard
          title="Pending Approval"
          value="-"
          description="Menunggu verifikasi"
          icon={Clock}
        />
        <StatCard
          title="Total Klien"
          value="-"
          description="Total klien"
          icon={Users}
        />
        <StatCard
          title="Proyek Aktif"
          value="-"
          description="Proyek berjalan"
          icon={FileText}
        />
      </div>
    </div>
  )
}
```

### Task 13: Update Vendors List Page (Placeholder)

**File**: `/app/(admin)/admin/vendors/page.tsx` (UPDATE)

```typescript
import { DataTable } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'

export const metadata = {
  title: 'Kelola Vendor | LPrecast',
  description: 'Kelola dan verifikasi vendor mitra LPrecast',
}

// TODO: Define columns and fetch data (after Agent A completes auth)

export default function AdminVendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendor</h1>
      </div>

      <div className="rounded-md border p-8">
        <p className="text-center text-muted-foreground">
          Vendor list akan ditampilkan di sini setelah integrasi dengan database
        </p>
      </div>
    </div>
  )
}
```

## Files to Create/Modify

| File                                    | Action | Description                     |
| --------------------------------------- | ------ | ------------------------------- |
| `/components/ui/data-table.tsx`         | CREATE | Generic DataTable component     |
| `/components/ui/status-badge.tsx`       | CREATE | Status badge component          |
| `/components/admin/admin-sidebar.tsx`   | CREATE | Admin sidebar navigation        |
| `/components/admin/admin-header.tsx`    | CREATE | Admin header with user dropdown |
| `/components/admin/admin-layout.tsx`    | CREATE | Admin layout wrapper            |
| `/components/admin/stat-card.tsx`       | CREATE | Dashboard stat card             |
| `/components/admin/coming-soon.tsx`     | CREATE | Coming soon placeholder         |
| `/app/(admin)/layout.tsx`               | UPDATE | Use AdminLayout                 |
| `/app/(admin)/page.tsx`                 | UPDATE | Redirect to dashboard           |
| `/app/(admin)/admin/dashboard/page.tsx` | UPDATE | Dashboard with stats            |
| `/app/(admin)/admin/vendors/page.tsx`   | UPDATE | Vendor list placeholder         |
| `/app/(admin)/admin/clients/page.tsx`   | CREATE | Coming Soon page                |
| `/app/(admin)/admin/tenders/page.tsx`   | UPDATE | Coming Soon page                |
| `/app/(admin)/admin/users/page.tsx`     | CREATE | Coming Soon page                |

## Database Reference

### Table: vendor_registrations

```typescript
{
  id: string
  status: "draft" |
    "submitted" |
    "under_review" |
    "approved" |
    "rejected" |
    "revision_requested"
  created_at: string
  vendor_id: string
  // ... other fields
}
```

### Table: vendor_company_info

```typescript
{
  id: string
  registration_id: string
  nama_perusahaan: string
  nama_pic: string
  email: string
  // ... other fields
}
```

## Integration Notes

Setelah Agent A selesai, lakukan integrasi:

1. **AdminLayout** - Import `getCurrentUser` dari `/lib/auth`

   ```typescript
   import { getCurrentUser } from '@/lib/auth'

   export default async function AdminRootLayout({ children }) {
     const user = await getCurrentUser()
     return <AdminLayout user={user?.profile}>{children}</AdminLayout>
   }
   ```

2. **AdminHeader** - Gunakan real user data untuk avatar dan dropdown

3. **Dashboard** - Fetch stats dari database

   ```typescript
   const supabase = await createClient()
   const { count: vendorCount } = await supabase
     .from("vendor_profiles")
     .select("*", { count: "exact", head: true })
   ```

4. **VendorList** - Fetch vendor data
   ```typescript
   const { data: vendors } = await supabase
     .from("vendor_registrations")
     .select("*, vendor_company_info(*)")
   ```

## Testing Checklist

- [ ] Sidebar render dengan menu items
- [ ] Sidebar menu items clickable
- [ ] Header render dengan placeholder user
- [ ] DataTable component render
- [ ] StatusBadge component render dengan benar
- [ ] StatCard component render
- [ ] ComingSoon component render
- [ ] Admin layout wrap content dengan benar
- [ ] Redirect dari /admin ke /admin/dashboard bekerja
- [ ] Coming Soon pages render
- [ ] Dashboard page render dengan placeholder stats
- [ ] Vendors page render dengan placeholder

## Notes

- Gunakan primary color dari theme-config.ts (#16a34a)
- Semua komponen harus RSC-friendly (use 'use client' hanya jika perlu)
- Placeholder data untuk user - akan integrate dengan Agent A
- Gunakan Bahasa Indonesia untuk UI text
