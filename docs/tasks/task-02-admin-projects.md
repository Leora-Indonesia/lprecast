# Task 02: Admin Create Project Manual

## Objective

Buat halaman untuk admin membuat proyek baru secara manual (tanpa client portal untuk MVP).

## Requirements

### Pages

1. **`/app/(admin)/admin/projects/page.tsx`**
   - List semua proyek (table view)
   - Button "Buat Proyek Baru"
   - Filter: status (active, completed, on_hold)

2. **`/app/(admin)/admin/projects/new/page.tsx`**
   - Form create project

### Form Fields

```typescript
interface CreateProjectForm {
  name: string // Nama proyek (required)
  customer_name: string // Nama customer/klien (required)
  description: string // Deskripsi proyek
  location: string // Lokasi proyek
  contract_value: number // Nilai kontrak (required)
  start_date: string // Tanggal mulai
  end_date: string // Tanggal selesai (estimasi)
  status: "planning" | "active" | "on_hold" | "completed"
}
```

### Server Actions

Buat `/actions/projects.ts`:

```typescript
"use server"

export async function createProject(data: CreateProjectForm) {
  // Insert ke table projects
  // Return { success: true, projectId } atau { error }
}

export async function getProjects(filters?: ProjectFilters) {
  // Query projects dengan filter
  // Return array of projects
}
```

### UI Components

- **Form**: React Hook Form + Zod validation
- **Fields**: shadcn Input, Textarea, DatePicker, Select
- **Submit**: Server Action dengan loading state
- **Validation**:
  - name: min 3 chars
  - customer_name: required
  - contract_value: number > 0
  - start_date: valid date
  - end_date: optional, harus setelah start_date

### Database

Table: `projects` (sudah exists)

```typescript
{
  id: string
  name: string
  customer_name: string
  description: string | null
  location: string | null
  contract_value: number
  start_date: string | null
  end_date: string | null
  status: "planning" | "active" | "on_hold" | "completed"
  client_id: string | null // NULL untuk MVP (manual input)
  created_at: string
  updated_at: string
}
```

## Files to Create/Modify

| File                                       | Action | Description             |
| ------------------------------------------ | ------ | ----------------------- |
| `/actions/projects.ts`                     | CREATE | Server actions CRUD     |
| `/app/(admin)/admin/projects/page.tsx`     | CREATE | List projects           |
| `/app/(admin)/admin/projects/new/page.tsx` | CREATE | Create form             |
| `/components/admin/project-form.tsx`       | CREATE | Reusable form component |
| `/components/admin/project-table.tsx`      | CREATE | DataTable for projects  |

## Sidebar Update

Tambahkan menu "Projects" di sidebar admin (setelah "Vendors").

## Testing Checklist

- [ ] List projects render dengan data
- [ ] Form validation bekerja
- [ ] Create project berhasil insert ke DB
- [ ] Redirect ke list setelah create
- [ ] Error handling (show error message)
- [ ] Filter by status berfungsi

## Notes

- Client field sementara kosong/null (MVP tanpa client portal)
- Customer_name diisi manual oleh admin
- Nanti akan ada link ke client setelah client portal dibuat
- Tender akan dibuat terpisah (task 3)
