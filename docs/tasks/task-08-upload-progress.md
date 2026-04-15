# Task 08: Vendor Upload Progress Harian

## Objective

Buat halaman untuk vendor upload laporan progress harian dengan foto dan deskripsi.

## Requirements

### Page

**`/app/(vendor)/projects/[id]/progress/page.tsx`**

- Form upload progress harian
- History progress sebelumnya

### Form Fields

```typescript
interface DailyProgress {
  project_id: string
  date: string // Tanggal progress (default: today)
  description: string // Deskripsi pekerjaan
  progress_percentage: number // % progress hari ini (0-100)
  total_percentage: number // Total progress kumulatif
  workers_count: number // Jumlah pekerja
  weather: string // Cuaca (optional)
  obstacles: string // Kendala (optional)
  photos: File[] // Multiple foto upload
}
```

### Upload Flow

1. **Form Input**: Isi deskripsi, progress, jumlah pekerja
2. **Photo Upload**: Multiple file input
   - Max 5 foto per hari
   - Format: JPG, PNG
   - Max size: 5MB per file
3. **Save**: Upload foto ke Supabase Storage
4. **Insert Record**: Save progress data ke DB

### Server Actions

Buat `/actions/progress.ts`:

```typescript
"use server"

export async function uploadProgress(data: DailyProgress, photos: File[]) {
  // 1. Upload photos to Supabase Storage
  //    - Path: progress/{project_id}/{date}/{filename}
  // 2. Get photo URLs
  // 3. Insert ke vendor_progress
  // 4. Return success/error
}

export async function getProgressHistory(projectId: string) {
  // Get all progress records untuk project
  // Order by date desc
}
```

### Database

Table: `vendor_progress`

```typescript
{
  id: string
  project_id: string
  vendor_id: string
  report_date: string
  description: string
  daily_progress_percent: number
  total_progress_percent: number
  workers_count: number
  weather: string | null
  obstacles: string | null
  photo_urls: string[]        // Array of storage URLs
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  verified_by: string | null  // SPV id
  verified_at: string | null
  notes: string | null        // Catatan SPV
  created_at: string
  updated_at: string
}
```

### UI Components

- **ProgressForm**: Form input progress
- **PhotoUpload**: Multiple file upload with preview
- **ProgressHistory**: List progress sebelumnya
- **ProgressCard**: Display single progress entry
- **PhotoGallery**: Grid foto progress

### Validation

- Date: tidak bisa future date
- Progress percentage: 0-100
- Photos: max 5 files, 5MB each
- Description: min 10 characters

## Files to Create

| File                                            | Description    |
| ----------------------------------------------- | -------------- |
| `/app/(vendor)/projects/[id]/progress/page.tsx` | Progress page  |
| `/actions/progress.ts`                          | Server actions |
| `/components/vendor/progress-form.tsx`          | Form component |
| `/components/vendor/photo-upload.tsx`           | Photo upload   |
| `/components/vendor/progress-history.tsx`       | History list   |

## Testing Checklist

- [ ] Form validation bekerja
- [ ] Photos upload successfully
- [ ] Progress record inserted
- [ ] History displays correctly
- [ ] Multiple photos handled
- [ ] Error handling (upload fail, etc)

## Notes

- Photos stored in Supabase Storage (public bucket)
- Daily progress = progress hari itu (bukan kumulatif)
- Total progress = kumulatif dari awal project
- Status default: "submitted" (menunggu verifikasi SPV)
- Deadline: 09.00 WIB hari berikutnya (task 12)
