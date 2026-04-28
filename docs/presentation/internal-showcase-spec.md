# Internal Showcase Spec

## Purpose

Dokumen ini menjadi source of truth untuk halaman presentasi internal LPrecast dalam format 1 halaman web dengan beberapa section yang berperan sebagai slide.

Goal utama:

- menjelaskan apa yang sudah benar-benar ada di app
- merangkum alur produk lintas role dengan cepat
- membantu tim internal present ke stakeholder internal tanpa bikin deck terpisah dari source code
- menjadi guideline yang cukup jelas agar AI agent bisa generate halaman presentasi secara konsisten

## Audience

- internal product team
- internal ops / business team
- management internal

Presentasi ini tidak ditulis untuk audiens eksternal atau sales pitch publik.

## Output Shape

- 1 route Next.js tunggal, contoh: `/presentasi` atau `/internal-showcase`
- 1 halaman scroll dengan beberapa section
- setiap section berperan sebagai 1 slide logis
- layout web harus nyaman untuk scroll biasa dan present live
- layout print harus membuat 1 section = 1 halaman PDF

## Core Message

Halaman harus menunjukkan bahwa LPrecast sudah punya fondasi kuat untuk vendor onboarding, admin operations, notifications, dashboard, dan client foundation ringan, sambil tetap jujur bahwa area project execution, bidding penuh, progress verification, payment, dan KPI belum menjadi fokus presentasi ini.

## Showcase Scope

Fokus utama presentasi:

- vendor registration dan onboarding
- vendor dashboard, profile, notifications, dan tender visibility yang relevan
- admin dashboard, vendor management, approval flow, dan notifications
- client dashboard foundation sebagai context ringan
- architecture, delivery status, dan next build focus

Di luar fokus presentasi fase ini:

- project pages lintas role
- project detail walkthrough
- project intake/project management walkthrough mendalam

Area di luar fokus masih boleh disebut singkat di section roadmap atau delivery status, tapi tidak menjadi demo surface utama.

## Visual Direction

- tone: corporate clean
- kesan: credible, operational, concise, high-trust
- jangan terasa seperti landing page marketing publik
- jangan terlalu ramai, glossy, atau cinematic berlebihan
- harus konsisten dengan visual language existing app dan `shadcn/ui`

## Required Content Rules

- semua klaim fitur harus bisa diverifikasi dari code repo atau `docs/tasks/PROGRESS.md`
- semua modul besar wajib diberi status yang eksplisit: `Done`, `In Progress`, atau `Planned`
- fitur roadmap tidak boleh ditulis atau divisualkan seolah sudah live
- screenshot real pages diprioritaskan di atas ilustrasi generik
- jika screenshot belum ada atau data kosong, gunakan placeholder factual yang menandai screenshot pending

## Required Technical Rules

- gunakan Next.js App Router
- server components by default
- tambahkan client components hanya jika butuh interactivity lokal seperti progress nav atau print button
- semua styling mengikuti design system repo dan theme existing
- warna harus tetap mengacu ke `lib/theme-config.ts` dan token existing
- print CSS wajib ada
- setiap section harus punya break rule untuk print/PDF
- nav, controls, dan ornamental UI harus bisa disembunyikan saat print

## Layout Rules

- setiap section harus punya headline tunggal yang kuat
- supporting copy singkat, bukan paragraf panjang
- satu section fokus pada satu pesan utama
- screenshot dan status cards boleh digabung, tapi hierarchy harus jelas
- hindari dense table besar kecuali section status/roadmap memang butuh ringkasan status
- desktop first, tapi tetap aman di mobile

## Non-Goals

- bukan presenter-mode full seperti Reveal.js
- bukan export PDF otomatis dari backend pada fase awal
- bukan deck eksternal dengan claim komersial berlebihan
- bukan pengganti dokumen flow, context, atau progress tracker

## Success Criteria

Halaman dianggap berhasil jika:

- internal team bisa scroll dari atas ke bawah dan memahami scope produk saat ini tanpa buka banyak route
- tiap role utama dan modul onboarding/vendor-admin utama terwakili
- pembaca langsung tahu mana yang live, mana yang fondasi, mana yang next
- halaman bisa diprint ke PDF dengan 1 section per page tanpa layout rusak
- AI agent lain bisa membaca doc ini lalu generate implementasi tanpa banyak asumsi tambahan

## Source Of Truth Priority

Saat ada konflik informasi, urutan acuan:

1. code dan route di repo
2. `docs/tasks/PROGRESS.md`
3. `docs/CONTEXT.md`
4. `docs/FLOW.md`
5. `docs/modules/*.md`

## Do

- do gunakan bahasa ringkas dan faktual
- do tampilkan lane separation saat menjelaskan role
- do tandai scope delivery dengan jelas
- do jaga layout print-friendly
- do gunakan screenshot real pages bila tersedia
- do prioritaskan walkthrough vendor-admin dibanding project walkthrough

## Don't

- don't overstate readiness fitur payment, SPV, KPI, atau milestone bila belum live penuh
- don't masukkan project pages ke showcase utama fase ini
- don't gunakan mock device berlebihan yang mengurangi kepadatan informasi
- don't isi section dengan bullet dump panjang
- don't tambahkan animasi berat yang mengganggu print dan maintainability
- don't bikin visual language yang bertabrakan dengan app utama
