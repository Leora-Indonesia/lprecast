# Internal Showcase Structure

## Structure Rules

- satu section = satu slide logis
- satu section = satu headline utama
- satu section idealnya muat dalam satu halaman print
- copy pendek, visual dominan, status eksplisit

## Section 1 - Cover

Purpose:
Menetapkan konteks presentasi dan posisi produk saat ini.

Required blocks:

- nama produk: `LPrecast Vendor Portal`
- one-line positioning tentang portal vendor onboarding dan internal vendor operations visibility
- current phase label, contoh: `MVP Foundation Delivered`
- short summary 2-3 poin: vendor onboarding, admin ops, client foundation

Preferred visual:

- clean hero panel
- ringkas metric strip atau capability badges

Screenshot:

- optional

## Section 2 - Business Problem

Purpose:
Menjelaskan masalah operasional yang app ini rapikan.

Required blocks:

- procurement/tender coordination problem
- vendor verification and onboarding problem
- status monitoring and notification coordination problem
- approval/payment lane complexity as future structured lane

Preferred visual:

- 3-4 problem cards
- before vs after operational framing

Screenshot:

- not required

## Section 3 - Product Scope Today

Purpose:
Memetakan role dan batas scope saat ini.

Required blocks:

- roles: admin, vendor, client, SPV
- lane separation singkat
- note that SPV/payment lanes are partially planned, not fully delivered

Preferred visual:

- role map
- lane diagram ringan

Screenshot:

- not required

## Section 4 - What Already Works

Purpose:
Merangkum capability utama yang sudah benar-benar ada.

Required blocks:

- vendor registration and onboarding
- admin vendor review and approval flow
- notifications dasar
- vendor dashboard, profile, and tender visibility foundation
- admin dashboard and vendor operations foundation
- client dashboard scaffold
- PWA foundation

Preferred visual:

- capability grid with status badges

Screenshot:

- optional secondary thumbnails

## Section 5 - Vendor Experience

Purpose:
Menunjukkan surface area vendor yang sudah bisa didemokan.

Required blocks:

- register account
- onboarding/profile completion
- dashboard overview
- tenders list/detail visibility
- notifications

Status framing:

- akses dan visibility bisa `Done`
- submit bid atau daily progress jika belum live penuh harus `Planned` atau `In Progress`

Preferred visual:

- 1-2 screenshot utama
- side notes tentang value operasional vendor

Screenshot:

- required

## Section 6 - Admin Experience

Purpose:
Menunjukkan capability admin yang paling matang.

Required blocks:

- admin dashboard
- vendor list and filtering
- vendor detail and approval actions
- tender list/detail foundation
- notifications

Status framing:

- capability approval vendor biasanya `Done`
- tender publish/compare/winner flow harus mengikuti progress doc aktual

Preferred visual:

- screenshot dashboard + vendor detail/approval page

Screenshot:

- required

## Section 7 - Client Experience

Purpose:
Menjelaskan bahwa client lane sudah punya fondasi, belum full journey.

Required blocks:

- dashboard
- client profile/intake foundation status only
- note on future milestone approval and funding lane

Preferred visual:

- scaffold/foundation framing card
- screenshot dashboard only

Screenshot:

- recommended

## Section 8 - Architecture Snapshot

Purpose:
Meringkas fondasi teknis dan governance aplikasi.

Required blocks:

- Next.js App Router
- Supabase
- RLS
- shadcn/ui + Tailwind
- PWA via Serwist
- middleware role checks via `proxy.ts`

Preferred visual:

- architecture chips/cards
- simple stack diagram

Screenshot:

- not required

## Section 9 - Delivery Status

Purpose:
Membuat pembaca tahu mana yang selesai, aktif, dan berikutnya.

Required blocks:

- done now
- in progress now
- next build focus

Status source:

- wajib sinkron dengan `docs/tasks/PROGRESS.md`

Preferred visual:

- 3-column status board
- short timeline or milestone row

Screenshot:

- not required

## Section 10 - Next Build Focus

Purpose:
Menutup dengan prioritas implementasi berikutnya.

Required blocks:

- tender publish and bid flow maturity
- project module maturity
- daily progress and SPV verification
- milestone/payment/funding lane
- KPI and monitoring expansion

Preferred visual:

- roadmap cards
- dependency note singkat

Screenshot:

- not required

## Section 11 - Closing

Purpose:
Memberi ringkasan nilai internal dan readiness.

Required blocks:

- apa yang sudah siap dipakai/demo
- kenapa fondasi ini penting
- apa milestone internal berikutnya

Preferred visual:

- concise closing panel

Screenshot:

- optional

## Status Label Rules

Gunakan label berikut secara konsisten:

- `Done` - feature/page/flow sudah ada dan bisa didemokan dengan jujur
- `In Progress` - foundation ada atau pengerjaan aktif, tapi belum pantas dianggap complete
- `Planned` - belum delivered atau masih roadmap menurut progress tracker

## Copy Rules

- 1 headline per section
- 1 supporting paragraph maksimum 2-3 kalimat pendek
- bullet seperlunya, bukan bullet wall
- hindari jargon berlebihan
- tone factual, internal, credible
