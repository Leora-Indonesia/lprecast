# Task 07: Notifikasi Tender Result

## Objective

Kirim notifikasi ke vendor pemenang dan non-pemenang setelah tender ditutup.

## Requirements

### Notification Events

1. **Vendor Menang Tender**
   - Title: "Selamat! Anda Terpilih sebagai Pemenang Tender"
   - Message: Detail project & next steps (SPK)
   - Action: Lihat SPK

2. **Vendor Kalah Tender**
   - Title: "Tender Telah Ditutup"
   - Message: Terima kasih atas partisipasi
   - Action: - (opsional: lihat tender lain)

3. **Vendor Rejected/Need Revision**
   - (Sudah ada di task 1)

### Implementation

Gunakan existing notification system:

- Table: `notifications`
- Trigger: Edge Function atau Server Action

### Server Actions

Tambahkan ke `/actions/notifications.ts`:

```typescript
"use server"

export async function notifyWinner(
  vendorId: string,
  tenderId: string,
  projectName: string
) {
  // Insert notification ke winner
}

export async function notifyLosers(
  tenderId: string,
  winnerId: string // exclude winner
) {
  // Insert notifications ke semua non-winner submissions
}
```

### Notification Content

**Winner:**

```typescript
{
  user_id: winnerUserId,
  type: "tender_won",
  title: "Selamat! Anda Terpilih sebagai Pemenang Tender",
  message: `Anda terpilih untuk proyek "${projectName}". Silakan lihat SPK untuk langkah selanjutnya.`,
  category: "tender",
  reference_type: "vendor_spk",
  reference_id: spkId
}
```

**Losers:**

```typescript
{
  user_id: loserUserId,
  type: "tender_closed",
  title: "Tender Telah Ditutup",
  message: `Tender untuk proyek "${projectName}" telah ditutup. Terima kasih atas partisipasi Anda.`,
  category: "tender",
  reference_type: "tender",
  reference_id: tenderId
}
```

### UI Updates

- **NotificationBell**: Sudah ada, pastikan muncul notifikasi baru
- **TenderResultCard**: Display di vendor dashboard (winner/loser)

### Integration

Trigger di `/actions/tenders.ts`:

```typescript
export async function selectWinner(...) {
  // ... existing logic

  // Send notifications
  await notifyWinner(winnerVendorId, tenderId, projectName)
  await notifyLosers(tenderId, winnerVendorId)
}
```

## Files to Create/Modify

| File                        | Action | Description                           |
| --------------------------- | ------ | ------------------------------------- |
| `/actions/notifications.ts` | UPDATE | Add tender notification functions     |
| `/actions/tenders.ts`       | UPDATE | Trigger notifications on selectWinner |

## Testing Checklist

- [ ] Winner receives winner notification
- [ ] Losers receive loser notification
- [ ] Notification appears in bell icon
- [ ] Click notification navigates correctly
- [ ] Unread count updates
- [ ] No duplicate notifications

## Notes

- Gunakan existing notification infrastructure
- Notifikasi real-time via Supabase Realtime (sudah setup)
- Bisa tambah email notification: post-MVP
- Mark as read: sudah ada fungsi
# tes Tue Apr 21 12:35:40 +07 2026
