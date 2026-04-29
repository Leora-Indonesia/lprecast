# Task Context: Tender Publish UX

Session ID: 2026-04-29-tender-publish-ux
Created: 2026-04-29T00:00:00+07:00
Status: in_progress

## Current Request
Implement UX pengajuan project ke tender: project draft masuk tender langsung publish open, route `/admin/projects/[id]/tender/new`, vendor-facing data aman, project status DB tetap `open` dengan UI label Tendering.

## Context Files (Standards to Follow)
- docs/architecture/design-system.md
- docs/FLOW.md
- docs/modules/PROJECT.md
- docs/modules/TENDER.md
- docs/modules/VENDOR.md
- docs/tasks/PROGRESS.md

## Reference Files (Source Material to Look At)
- app/(admin)/admin/projects/new/page.tsx
- components/admin/project-form.tsx
- lib/projects/repository.ts
- lib/validations/project.ts
- types/database.types.ts

## External Docs Fetched
None.

## Components
- Project detail CTA to start tender publish
- Tender publish page from existing project
- Tender metadata and dynamic item form
- Vendor-facing preview and publish action
- Project status update to `open` after tender publish

## Constraints
- DB `project_status` enum has no `tendering`; use `open` and UI label Tendering.
- Tender status publishes directly as `open`; no tender draft.
- Hide client/internal sensitive fields from vendor-facing preview.
- Use shadcn/ui components and semantic theme classes.
- Stop on validation failure; report before any auto-fix.

## Exit Criteria
- [ ] Admin can access `/admin/projects/[id]/tender/new` from draft project.
- [ ] Admin can publish tender with metadata and at least one item.
- [ ] Tender persists as `open` and project becomes `open`.
- [ ] Vendor preview excludes client/internal sensitive data.
- [ ] Typecheck passes or failures are reported.
