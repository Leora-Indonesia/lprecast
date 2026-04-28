# Task Context: Admin Project Create V2

Session ID: 2026-04-28-admin-project-create-v2
Created: 2026-04-28T00:00:00Z
Status: in_progress

## Current Request
Upgrade admin create project flow so admin can create a fuller project foundation now, structured by sections that can later map into tabs and future client/SPV modules. Also fix create-time attachment handling and prepare detail-page section mapping for future tabbed UX.

## Context Files (Standards to Follow)
- /home/alv/code/lprecast/docs/modules/PROJECT.md
- /home/alv/code/lprecast/docs/architecture/design-system.md
- /home/alv/code/lprecast/docs/tasks/PROGRESS.md
- /home/alv/code/lprecast/docs/plans/ProjectUiSprint01.md
- /home/alv/code/lprecast/docs/CONTEXT.md
- /home/alv/code/lprecast/docs/FLOW.md

## Reference Files (Source Material to Look At)
- /home/alv/code/lprecast/app/(admin)/admin/projects/new/page.tsx
- /home/alv/code/lprecast/components/admin/project-form.tsx
- /home/alv/code/lprecast/app/(admin)/admin/projects/actions.ts
- /home/alv/code/lprecast/app/(admin)/admin/projects/actions/route.ts
- /home/alv/code/lprecast/lib/projects/repository.ts
- /home/alv/code/lprecast/lib/validations/project.ts
- /home/alv/code/lprecast/lib/projects/types.ts
- /home/alv/code/lprecast/components/admin/projects/project-detail.tsx
- /home/alv/code/lprecast/app/(admin)/admin/projects/[id]/edit/page.tsx
- /home/alv/code/lprecast/types/database.types.ts

## External Docs Fetched
- None

## Components
- Admin create project form
- Project validation contract
- Project repository create/update flow
- Attachment upload flow during create
- Project detail section mapping for future tabs

## Constraints
- Current flow handled by admin first; no client module implementation yet
- Payment remains project module, not create-form focus
- SPV pre-con remains separate from create form
- Use existing shadcn/ui patterns and current repository/action architecture
- Keep project status default to draft
- Prepare field grouping for future role split: client intake, admin review, SPV planning

## Exit Criteria
- [ ] Admin create form captures fuller project foundation fields required for internal-first workflow
- [ ] Create-time attachments persist correctly with project creation
- [ ] Repository + validation support new fields already present in database schema
- [ ] Detail experience is prepared with clear section mapping for future tabs
- [ ] Progress tracker reflects active work state
