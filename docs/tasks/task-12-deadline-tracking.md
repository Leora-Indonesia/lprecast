# Task 12: Deadline Tracking

## Objective

Buat logika tracking deadline upload progress dan flag keterlambatan.

## Requirements

### Business Rules

1. **Deadline Upload**: 09.00 WIB hari berikutnya
   - Contoh: Kerja hari Senin → upload max Selasa 09.00 WIB

2. **Late Upload**:
   - Upload setelah 09.00 WIB → flag "late"
   - Affect KPI (post-MVP)

3. **No Upload**:
   - Tidak upload dalam 24 jam → flag "missing"
   - Auto-notify SPV & admin

### Implementation

**Option 1: Client-side Check** (MVP)

- Saat vendor upload, check current time vs deadline
- Tandai sebagai "late" jika melewati deadline

**Option 2: Cron Job** (Better)

- Supabase Edge Function cron (daily at 09:00 WIB)
- Check semua project active
- Find vendors yang belum upload kemarin
- Send notifications

### Database

Table: `vendor_progress` (add field)

```typescript
{
  // ... existing fields
  is_late: boolean | null // true jika upload > deadline
  deadline: string // timestamp deadline
}
```

### Deadline Calculation

```typescript
function calculateDeadline(workDate: string): string {
  // workDate: tanggal kerja (00:00:00)
  // deadline: besoknya jam 09:00 WIB
  const deadline = new Date(workDate)
  deadline.setDate(deadline.getDate() + 1)
  deadline.setHours(9, 0, 0, 0) // 09:00 WIB
  return deadline.toISOString()
}

function isLate(uploadTime: string, deadline: string): boolean {
  return new Date(uploadTime) > new Date(deadline)
}
```

### Flagging Logic

**Saat Upload:**

```typescript
// Dalam uploadProgress action
const deadline = calculateDeadline(workDate)
const isLate = isLate(new Date(), deadline)

await supabase.from("vendor_progress").insert({
  // ... other fields
  deadline,
  is_late: isLate,
})
```

### Notifications

**Late Upload Warning:**

```typescript
{
  user_id: vendorId,
  type: "late_upload",
  title: "Upload Terlambat",
  message: `Progress tanggal ${date} diupload terlambat. Deadline: 09:00 WIB.`,
  category: "progress"
}
```

**Missing Upload (via cron):**

```typescript
{
  user_id: spvId,
  type: "missing_upload",
  title: "Vendor Belum Upload Progress",
  message: `${vendorName} belum upload progress untuk tanggal ${date}.`,
  category: "progress"
}
```

### UI Indicators

- **Late Badge**: Tampilkan "Terlambat" di progress card
- **Warning Color**: Warna merah/orange untuk late uploads
- **Dashboard Alert**: Show warning di dashboard vendor

## Files to Create/Modify

| File                                               | Action | Description                   |
| -------------------------------------------------- | ------ | ----------------------------- |
| `/actions/progress.ts`                             | UPDATE | Add deadline calculation      |
| `/supabase/functions/cron-check-deadlines/`        | CREATE | Edge Function cron (optional) |
| `/components/vendor/progress-deadline-warning.tsx` | CREATE | Warning component             |

## Testing Checklist

- [ ] Deadline calculated correctly (09:00 WIB next day)
- [ ] Late uploads flagged correctly
- [ ] Warning muncul untuk late uploads
- [ ] Notifications sent for missing uploads
- [ ] Timezone handled correctly (WIB)

## Notes

- Timezone: WIB (Asia/Jakarta)
- Weekend/holiday handling: define later
- Cron job: optional for MVP, bisa manual check dulu
- KPI calculation: post-MVP
