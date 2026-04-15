# LPrecast MVP Implementation Plan

Plan implementasi fitur MVP untuk LPrecast Vendor Portal.

## Overview

Target: Menyelesaikan core functionality portal dalam 3 minggu.

**4 Role:**

- **Admin** - Full access, manajemen vendor, tender, proyek
- **SPV** - Verifikasi progress, monitoring (read-only data vendor)
- **Vendor** - Registrasi, tender, upload progress
- **Client** - View progress only (scaffold, post-MVP)

## Timeline

### Week 1 (14-18 Apr): Core Admin & Tender

- Day 1: Admin vendor actions + create project
- Day 2: Tender list vendor + submit penawaran
- Day 3: Admin evaluasi tender + generate SPK
- Day 4: Notifikasi + upload progress
- Day 5: SPV verifikasi + dashboard

### Week 2 (21-25 Apr): Progress Monitoring & SPV

- Day 1-2: SPV auth & layout + deadline tracking
- Day 3-5: Testing & bug fixes

### Week 3 (28-30 Apr): Polish & Launch

- Final testing, documentation, deployment

## Task List

| #   | Task                                | Assignee | Duration | Dependencies |
| --- | ----------------------------------- | -------- | -------- | ------------ |
| 1   | Admin: Approve/Reject/Revisi Vendor | AI       | 1 day    | -            |
| 2   | Admin: Create Project Manual        | AI       | 1 day    | Task 1       |
| 3   | Vendor: Tender List View            | AI       | 0.5 day  | Task 2       |
| 4   | Vendor: Submit Penawaran            | AI       | 1 day    | Task 3       |
| 5   | Admin: Evaluasi & Pilih Pemenang    | AI       | 1 day    | Task 4       |
| 6   | Generate SPK (Simple)               | AI       | 1 day    | Task 5       |
| 7   | Notifikasi Tender Result            | AI       | 0.5 day  | Task 6       |
| 8   | Vendor: Upload Progress Harian      | AI       | 1 day    | Task 7       |
| 9   | SPV: Verifikasi Progress            | AI       | 1 day    | Task 8       |
| 10  | Dashboard Monitoring                | AI       | 0.5 day  | Task 9       |
| 11  | SPV: Auth & Layout                  | AI       | 0.75 day | Task 10      |
| 12  | Deadline Tracking                   | AI       | 1 day    | Task 11      |
| 13  | Testing & Bug Fixes                 | AI       | 2 days   | Task 12      |
| 14  | Polish & Documentation              | AI       | 0.5 day  | Task 13      |

**Total: 98 jam (±3 minggu)**

## Key Decisions

1. **Project Input**: Manual oleh admin (tanpa client portal untuk MVP)
2. **Tender Detail**: Dibahas saat eksekusi task
3. **SPK Format**: Simple dulu, template formal nanti
4. **Blacklist**: Post-MVP
5. **Auto-nonaktif**: Soon/nanti

## Business Rules Applied

- Min. 2 vendor submit untuk tender valid
- Upload progress deadline: 09.00 WIB hari berikutnya
- Nilai SPK = Tender Price × Quantity
- Payment 2-level approval (Finance → Client)

## Post-MVP

- Client portal
- Payment Xendit integration
- KPI & evaluasi otomatis
- WhatsApp/email notifications
- Mobile app with push notification
- Blacklist vendor
- Auto-nonaktif 3×24 jam

## See Also

- `/docs/CONTEXT.md` - Project context & business rules
- `/docs/end-to-end-plan.md` - Complete business flow
- `/docs/tasks/` - Detailed task specifications
