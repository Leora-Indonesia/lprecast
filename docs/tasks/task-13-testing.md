# Task 13: Testing & Bug Fixes

## Objective

Testing menyeluruh semua fitur MVP dan fix bugs.

## Testing Scope

### 1. Authentication & Authorization

- [ ] Login sebagai admin → redirect /admin/dashboard
- [ ] Login sebagai vendor → redirect /vendor/dashboard
- [ ] Login sebagai SPV → redirect /spv/dashboard
- [ ] Unauthorized access → redirect /unauthorized
- [ ] Logout → redirect /login

### 2. Vendor Registration Flow

- [ ] Vendor bisa register dengan lengkap
- [ ] Upload dokumen berhasil
- [ ] Admin bisa approve/reject/revisi
- [ ] Notifikasi terkirim ke vendor
- [ ] Approved vendor bisa login dan akses fitur

### 3. Project Management

- [ ] Admin bisa create project
- [ ] List projects menampilkan data
- [ ] Detail project accessible

### 4. Tender System

- [ ] Vendor bisa lihat list tender terbuka
- [ ] Vendor bisa submit penawaran
- [ ] Tidak bisa submit 2x untuk tender sama
- [ ] Admin bisa lihat semua submissions
- [ ] Admin bisa pilih pemenang
- [ ] Validasi minimal 2 vendor berfungsi
- [ ] SPK generated setelah pemenang dipilih
- [ ] Notifikasi ke pemenang & non-pemenang

### 5. Progress Upload & Verification

- [ ] Vendor bisa upload progress dengan foto
- [ ] Multiple foto upload works
- [ ] SPV bisa lihat list verifikasi
- [ ] SPV bisa approve/reject progress
- [ ] Notifikasi ke vendor setelah verifikasi
- [ ] Rejected progress bisa di-reupload

### 6. Dashboard

- [ ] Admin dashboard shows correct stats
- [ ] SPV dashboard shows assigned projects
- [ ] Vendor dashboard shows active projects
- [ ] Data updates correctly

### 7. Deadline Tracking

- [ ] Deadline calculated correctly (09:00 WIB next day)
- [ ] Late uploads flagged correctly
- [ ] Notifications sent for late uploads

### 8. UI/UX

- [ ] Responsive layout (desktop, tablet, mobile)
- [ ] Loading states work
- [ ] Error messages clear
- [ ] Navigation intuitive
- [ ] Consistent styling

### 9. Performance

- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] No unnecessary re-renders

### 10. Security

- [ ] RLS policies active
- [ ] No SQL injection vulnerabilities
- [ ] File upload restrictions (type, size)
- [ ] Sensitive data protected

## Testing Checklist Format

Create file: `/docs/testing/MVP-TESTING.md`

```markdown
## Test Case: [Feature Name]

### Scenario: [What to test]

**Steps:**

1. Step 1
2. Step 2

**Expected Result:**

- Expected 1
- Expected 2

**Actual Result:**

- Actual 1
- Actual 2

**Status:** ✅ Pass / ❌ Fail

**Notes:**

- Any issues found
```

## Bug Tracking

Track bugs di Notion/GitHub Issues:

- Bug description
- Steps to reproduce
- Expected vs actual
- Severity (Critical/High/Medium/Low)
- Assigned to
- Status (Open/In Progress/Fixed)

## Testing Environment

- **Local**: http://localhost:3000
- **Staging**: (setup if needed)
- **Production**: https://precast.leora.co.id

## Sign-off Criteria

MVP bisa di-launch jika:

- [ ] All critical tests pass
- [ ] No critical/high bugs
- [ ] Admin flow works end-to-end
- [ ] Vendor flow works end-to-end
- [ ] SPV flow works end-to-end
- [ ] Performance acceptable
- [ ] Security reviewed

## Files

| File                           | Description         |
| ------------------------------ | ------------------- |
| `/docs/testing/MVP-TESTING.md` | Testing checklist   |
| `/docs/testing/BUG-REPORT.md`  | Bug report template |

## Notes

- Do testing setelah setiap task selesai (continuous)
- Final comprehensive testing di akhir
- Get user feedback jika possible
- Document known issues
