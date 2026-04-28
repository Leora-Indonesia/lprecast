# Internal Showcase AI Prompt Contract

Gunakan prompt contract ini saat meminta AI agent menggenerate halaman presentasi internal LPrecast.

## Prompt Contract

```text
Build a single Next.js App Router page for an internal LPrecast product showcase.

Requirements:
- Output must be one scrolling page with multiple sections that behave like slides.
- Each major section must be printable as one PDF page using print CSS.
- Audience is internal only: product, ops, and management.
- Tone must be corporate, clean, concise, and credible.
- Use the existing app visual language, shadcn/ui patterns, and theme tokens.
- Prefer real page screenshots over generic illustrations.
- Every major module must be labeled explicitly as Done, In Progress, or Planned.
- Do not present roadmap items as if they are already live.
- Keep current showcase focus on vendor onboarding, admin vendor operations, notifications, dashboards, and light client foundation.
- Do not use project pages as primary showcase content in this phase.
- Use only capabilities that can be verified from repo routes, code, and docs/tasks/PROGRESS.md.
- Use server components by default; add client boundaries only when needed for local interactivity.
- Hide controls/navigation in print mode.
- Keep each section focused on one main message with short supporting copy.

Source-of-truth order:
1. Code and routes in repo
2. docs/tasks/PROGRESS.md
3. docs/CONTEXT.md
4. docs/FLOW.md
5. docs/modules/*.md

Required section sequence:
1. Cover
2. Business Problem
3. Product Scope Today
4. What Already Works
5. Vendor Experience
6. Admin Experience
7. Client Experience
8. Architecture Snapshot
9. Delivery Status
10. Next Build Focus
11. Closing

Visual guardrails:
- No heavy marketing style
- No fake metrics
- No oversized device mockups
- No dense text walls
- No animation dependence for understanding core content
```

## Usage Notes

- pair this prompt with `internal-showcase-spec.md`
- use `internal-showcase-structure.md` for section-level content planning
- use `internal-showcase-assets.md` before selecting screenshots or placeholders
- validate all feature claims against repo and progress tracker before implementation
