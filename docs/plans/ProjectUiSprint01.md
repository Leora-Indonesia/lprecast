---
plan name: ProjectUiSprint01
plan description: Project module UI-first phase 1
plan status: pending
---

## Idea

Bangun full flow module project untuk admin internal sebelum masuk fase tender dan vendor execution. Fokus sprint ini: UI-first, route-final, repository-mock, action-contract-ready. Semua tombol submit/save sudah pakai route final. Kontrak data dan BE actions sudah disiapkan supaya nanti tinggal sambung ke Supabase tanpa rewrite besar.

Target akhir sprint: user bisa create, view, edit project; manage status dan milestone; lihat lampiran; tanpa masuk tender atau vendor lane.

## Scope In

1. **Project List**
   - tampil nama, lokasi, periode, status, created_at
   - search by nama/lokasi
   - filter status
   - row action: "Lihat", "Edit"
   - summary cards: count total/draft/open/in_progress/completed

2. **Project Create**
   - reuse existing form di `components/admin/project-form.tsx`
   - route: `/admin/projects/new`
   - submit -> redirect ke project detail

3. **Project Detail**
   - route: `/admin/projects/[id]`
   - section:
     - header: nama, status badge, created/updated timestamps
     - info utama: lokasi, periode kerja
     - customer info: customer_name, client_id (kalau ada)
     - contract value
     - deskripsi
     - lampiran list + download
     - milestone list section
   - action bar:
     - "Edit Project"
     - "Ubah Status" (via dropdown/dialog)
     - "Tambah Milestone" (inline section)
   - back link ke list

4. **Project Edit**
   - route: `/admin/projects/[id]/edit`
   - reuse/create form component
   - save -> redirect ke detail

5. **Status Management**
   - status enum: draft | open | in_progress | completed | cancelled
   - guard transisi dasar:
     - draft -> open | cancelled
     - open -> in_progress | cancelled
     - in_progress -> completed | cancelled
     - completed| cancelled: final, tidak bisa ubah
   - UI: dropdown di detail page, atau dialog konfirmasi

6. **Attachment Management**
   - lihat list lampiran di detail
   - download per file
   - upload lampiran tambahan saat edit
   - delete lampiran (DB metadata + storage)

7. **Milestone Basic**
   - inline section di detail page
   - CRUD minimal:
     - add milestone
     - edit milestone
     - mark completed
     - delete milestone
   - fields: title, description, due_date, status
   - pakai tabel `project_milestones`

## Scope Out

1. **Create Tender** - belum masuk tender
2. **Vendor Bidding** - belum masuk vendor lane
3. **Award Winner** - belum masuk selection flow
4. **Vendor SPK** - belum masuk vendor project assignment
5. **Daily Progress Upload** - belum masuk progress lane
6. **Payment Lane** - belum masuk invoice/payment
7. **Full Activity Audit Trail** - belum ada dedicated table, cukup timestamps UI
8. **SPV Verification** - belum masuk SPV lane
9. **Client View** - belum masuk client scaffold

## Route Flow

```
/admin/projects (list + search + filter + summary cards)
    │
    ├── /admin/projects/new (create form)
    │       │
    │       └── POST OK → redirect → /admin/projects/[id]
    │
    └── /admin/projects/[id] (detail page + status + milestones)
            │
            ├── /admin/projects/[id]/edit (edit form)
            │       │
            │       └── POST OK → redirect → /admin/projects/[id]
            │
            └── [status action]
            └── [milestone actions]
```

## UI Sections Detail Page

### Header Section
- project name (h1)
- status badge (dari enum)
- created_at, updated_at timestamps

### Info Section
- lokasi
- start_date - end_date
- customer_name
- contract_value

### Description Section
- deskripsi text

### Attachments Section
- title: "Lampiran"
- list: filename, size, uploaded_at
- action per row: download
- edit mode: add, delete

### Milestones Section
- title: "Target milestone"
- list: title, due_date, status, action
- action: add, edit, delete, toggle status
- status badge per item

### Actions Bar
- "Edit Project" button → navigasi ke /edit
- "Ubah Status" dropdown → modal/dropdown with guard
- "Tambah Milestone" → inline add form

## Component Split

1. **Pages**
   - `app/(admin)/admin/projects/page.tsx` (list - existing)
   - `app/(admin)/admin/projects/new/page.tsx` (create - existing)
   - `app/(admin)/admin/projects/[id]/page.tsx` (detail - NEW)
   - `app/(admin)/admin/projects/[id]/edit/page.tsx` (edit - NEW)

2. **Shared Components**
   - `components/admin/projects/project-form.tsx` (reuse dari create)
   - `components/admin/projects/project-detail.tsx` (NEW - detail sections)
   - `components/admin/projects/project-status.tsx` (NEW - status badge + action)
   - `components/admin/projects/project-attachments.tsx` (NEW - attachment list + management)
   - `components/admin/projects/project-milestones.tsx` (NEW - milestone CRUD)
   - `components/admin/projects/project-summary-cards.tsx` (NEW - summary stats)

3. **Data Layer**
   - `lib/validations/project.ts` (existing - extend untuk edit/milestone)
   - `lib/projects/types.ts` (NEW - view models)
   - `lib/projects/repository.ts` (NEW - interface, implementation mock)
   - `lib/projects/mock.ts` (NEW - mock data)

4. **Actions**
   - `app/(admin)/admin/projects/actions.ts` (NEW - server actions)

## Action Contracts (Siap Supabase)

### getProjectList
```typescript
async function getProjectList(filters?: {
  search?: string
  status?: ProjectStatus[]
}): Promise<ProjectListItem[]>
```

### getProjectDetail
```typescript
async function getProjectDetail(id: string): Promise<ProjectDetail | null>
```

### createProject
```typescript
async function createProject(input: ProjectCreateInput): Promise<{
  success: boolean, projectId?: string, error?: string
}>
```

### updateProject
```typescript
async function updateProject(id: string, input: Partial<ProjectUpdateInput>): Promise<{
  success: boolean, error?: string
}>
```

### updateProjectStatus
```typescript
async function updateProjectStatus(id: string, newStatus: ProjectStatus): Promise<{
  success: boolean, error?: string
}>
```

### addProjectAttachment
```typescript
async function addProjectAttachment(projectId: string, file: File): Promise<{
  success: boolean, attachment?: ProjectAttachment, error?: string
}>
```

### deleteProjectAttachment
```typescript
async function deleteProjectAttachment(projectId: string, attachmentPath: string): Promise<{
  success: boolean, error?: string
}>
```

### listProjectMilestones
```typescript
async function listProjectMilestones(projectId: string): Promise<ProjectMilestone[]>
```

### createProjectMilestone
```typescript
async function createProjectMilestone(projectId: string, input: MilestoneInput): Promise<{
  success: boolean, milestoneId?: string, error?: string
}>
```

### updateProjectMilestone
```typescript
async function updateProjectMilestone(id: string, input: Partial<MilestoneInput>): Promise<{
  success: boolean, error?: string
}>
```

### deleteProjectMilestone
```typescript
async function deleteProjectMilestone(id: string): Promise<{
  success: boolean, error?: string
}>
```

## Schema Mapping (Supabase Ready)

### projects table
| UI Field | DB Column | Type |
|--------|----------|------|
| name | name | text |
| location | location | text |
| start_date | start_date | date |
| end_date | end_date | date |
| description | description | text |
| customer_name | customer_name | text |
| client_id | client_id | uuid |
| contract_value | contract_value | numeric |
| status | status | enum |
| attachments | attachments | json |

### project_milestones table
| UI Field | DB Column | Type |
|--------|----------|------|
| title | title | text |
| description | description | text |
| due_date | due_date | date |
| status | status | enum |

### Status Enum Reference
- draft → open → in_progress → completed
- cancelled adalah terminal state
- completed adalah terminal state

## Execution Order

1. **Phase 1: Setup foundation**
   - buat `lib/projects/types.ts` - view models
   - buat `lib/projects/mock.ts` - mock data
   - buat `lib/projects/repository.ts` - interface + mock impl

2. **Phase 2: Project List enhancement**
   - update list page dengan search, filter, summary cards
   - buat `components/admin/projects/project-summary-cards.tsx`

3. **Phase 3: Detail page**
   - buat `components/admin/projects/project-detail.tsx`
   - buat page `/admin/projects/[id]`
   - konek ke repository (mock)

4. **Phase 4: Edit page**
   - buat/edit form component reuse
   - buat page `/admin/projects/[id]/edit`
   - konek ke repository (mock)

5. **Phase 5: Status management**
   - buat `components/admin/projects/project-status.tsx`
   - tambah logic guard transisi
   - konek ke action contract

6. **Phase 6: Attachment management**
   - buat `components/admin/projects/project-attachments.tsx`
   - konek ke add/delete actions

7. **Phase 7: Milestone basic**
   - buat `components/admin/projects/project-milestones.tsx`
   - konek ke CRUD actions

8. **Phase 8: Server actions**
   - buat `app/(admin)/admin/projects/actions.ts`
   - implementasi real (Supabase insert/update/delete)

9. **Phase 9: Repository switch**
   - ubah repository impl dari mock ke Supabase
   - tanpa ubah UI

## Mock Data Requirements

Minimal 3 project mock untuk validasi UI:
- 1 project status draft
- 1 project status open
- 1 project status in_progress

Milestone mock per project: 2-3 items dengan berbagai status.

## Validation Notes

- form validation reuse `lib/validations/project.ts`
- extend schema untuk edit (semua field optional)
- milestone validation: title wajib, due_date wajib
- status guard dicek di UI dan server action

## Future Supabase Migration

Kalau schema kurang:

1. `contract_value` - sudah ada
2. `attachments` JSON - sudah ada
3. milestone `project_id` FK - sudah ada
4. status enum - sudah ada
5. timestamps - sudah ada

Gap yang perlu diasses saat migration:
- apakah `client_id` FK ke users?
- apakah perlu kolom baru untuk milestone?
- apakah perlu activity log table terpisah?

## Notes

- Semua route menggunakan path final (bukan /prototype之类)
- Submit/save sudah redirect ke route final
- Repository pattern memudahkan switch mock → Supabase
- Kontrak actions sudah align dengan future server actions
- Status guard mencegah invalid transition
- Milestone basic belum include approval/payment trigger