# Task 10: Dashboard Monitoring

## Objective

Buat dashboard monitoring untuk overview proyek & progress (admin, SPV, vendor).

## Requirements

### Admin Dashboard (existing - update)

**`/app/(admin)/admin/dashboard/page.tsx`** (update)

Tambahkan section:
- **Projects Overview**: Total, active, completed
- **Pending Verifications**: Count & link
- **Recent Progress**: Last 5 progress uploads
- **Alerts**: Deadline warnings, late uploads

### SPV Dashboard (new)

**`/app/(spv)/dashboard/page.tsx`**

Stats:

- Projects assigned
- Pending verifications (today)
- Verified today
- Late verifications

List::

- Today's progress uploads
- Projects overview

### Vendor Dashboard (new)

**`/app/(vendor)/dashboard/page.tsx`**

Stats:

- Active projects
- Pending SPK (belum signed)
- Tender invitations
- Progress this month

List:

- Active projects with progress
- Recent tenders
- Notifications

### Dashboard Components

**Stat Cards** (sudah ada, reuse):

- Total/Active/Completed projects
- Pending verifications
- Uploads today/week

**Charts** (optional - simple dulu):

- Progress timeline per project
- Project status distribution

**Lists**:

- Recent activities
- Pending actions
- Alerts/notifications

### Data Queries

```typescript
// Admin
const stats = {
  totalProjects: await countProjects(),
  activeProjects: await countProjects({ status: "active" }),
  pendingVerifications: await countProgress({ status: "submitted" }),
  vendorCount: await countVendors({ status: "approved" }),
}

// SPV
const stats = {
  assignedProjects: await countAssignedProjects(spvId),
  pendingVerifications: await countPending(spvId),
  verifiedToday: await countVerifiedToday(spvId),
}

// Vendor
const stats = {
  activeProjects: await countActiveProjects(vendorId),
  pendingSpk: await countPendingSPK(vendorId),
  openTenders: await countOpenTenders(),
}
```

## Files to Create/Modify

| File                                    | Action | Description                |
| --------------------------------------- | ------ | -------------------------- |
| `/app/(admin)/admin/dashboard/page.tsx` | UPDATE | Add monitoring sections    |
| `/app/(spv)/dashboard/page.tsx`         | CREATE | SPV dashboard              |
| `/app/(vendor)/dashboard/page.tsx`      | CREATE | Vendor dashboard           |
| `/components/dashboard/*.tsx`           | CREATE | Reusable dashboard widgets |

## Testing Checklist

- [ ] Admin dashboard shows all relevant stats
- [ ] SPV dashboard shows assigned projects
- [ ] Vendor dashboard shows active projects
- [ ] Data updates in real-time (or on refresh)
- [ ] Navigation works correctly
- [ ] Responsive layout

## Notes

- Reuse existing stat-card component
- Keep it simple (charts: post-MVP)
- Focus on actionable data (what needs attention)
- Links to detail pages
- Mobile responsive
