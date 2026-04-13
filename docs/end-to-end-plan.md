END-TO-END SCENARIO LPrecast

Dari Client Register → Project → Tender → Execution → Payment → Completion

🟢 PHASE 1 — CLIENT REGISTRATION

📌 1. Form Registrasi Client

A. Data Identitas
    •    Nama lengkap / perusahaan
    •    Tipe client:
    •    Individu
    •    Developer
    •    Kontraktor
    •    Perusahaan
    •    Email
    •    No. WhatsApp
    •    Password

B. Data Lokasi Proyek
    •    Alamat lengkap
    •    Provinsi
    •    Kota/Kabupaten
    •    Koordinat (auto map pin)

C. Data Kebutuhan Awal
    •    Jenis pekerjaan:
    •    Pagar beton
    •    Panjang / luas (estimasi)
    •    Target waktu pengerjaan
    •    Budget range (opsional)

D. Upload Awal (Opsional tapi disarankan)
    •    Foto lokasi dan akses ke lokasi
    •    Gambar kerja (jika ada)

📌 2. Verifikasi Client

Auto Verification
    •    OTP WhatsApp
    •    Email verification

Manual Verification (Jika B2B / Nilai besar)

Checklist:
    •    validasi nomor
    •    validasi perusahaan
    •    validasi keseriusan

👉 Output:
    •    Verified / Need Review / Rejected

🟢 PHASE 2 — PROJECT INITIATION

📌 3. Kalkulator Biaya (System Generated)

Client input:
    •    panjang pagar (contoh: 250 m’)
    •    tipe pagar (berapa susun). Dan polos / motif
    •    lokasi

👉 Output:
    •    estimasi harga
    •    estimasi durasi
    •    range timeline

📌 4. Request Konsultasi / Deal

Form tambahan:
    •    detail spesifikasi:
    •    tinggi pagar
    •    jenis pondasi
    •    kondisi lokasi:
    •    tanah rata / miring
    •    akses alat

Jika klien masuk tahap ini. Perlu ditawarkan untuk klien deposit tanda jadi. Antara 500.000 - 1.000.000 untuk biaya survey awal

Penentuan harga tanda jadi diklasifikasikan berdasarkan jarak tempuh
- dalam provinsi (termasuk jabodetabek) Rp 500.000
- ⁠luar provinsi (Rp 1.000.000)

Jika proyek batal. Biaya survey hangus.
Jika deal. Biaya survey potong tagihan.

Setelah survey. Tim survey akan upload berita acara dan update biaya proyek

📌 5. Internal Qualification (System + Human)

Checklist sistem:
    •    nilai proyek
    •    margin
    •    vendor availability

👉 Output:
    •    APPROVED
    •    CONDITIONAL
    •    REJECT

📌 6. Deal & Digital Contract

Client setuju:
    •    harga final
    •    timeline
    •    metode pembayaran

Generate:
    •    kontrak digital
    •    e-signature

📌 7. Payment (Escrow)

Client bayar:
    •    DP (misal 30%)

Status:
👉 PROJECT ACTIVE

🟡 PHASE 3 — OPEN TENDER TO VENDOR

📌 8. Project Publish ke Vendor

Data yang ditampilkan ke vendor:
    •    jenis pekerjaan: pagar beton
    •    panjang: 250 m
    •    lokasi (tanpa detail sensitif). Hanya kecamatan dan kabupaten / kota
    •    timeline
    •    spesifikasi teknis
    •    estimasi volume kerja

⚠️ TANPA:
    •    data client lengkap
    •    kontak client

📌 9. Vendor Apply Tender

📄 Form Tender Vendor

A. Data Penawaran (kolom isian - wajib)
    •    harga per meter
    •    total harga
    •    durasi pengerjaan

B. Metode Kerja (kolom isian - opsional)
    •    metode instalasi
    •    jumlah tenaga kerja
    •    alat yang digunakan

C. Kapasitas (kolom isian - wajib)
    •    ketersediaan tim (jumlah pekerja yang akan ditugaskan)
    •    estimasi start date

D. Komitmen SLA

Checklist:
    •    sanggup sesuai timeline
    •    sanggup sesuai kualitas
    •    sanggup sesuai SOP

E. Upload Dokumen
    •    portofolio proyek serupa (bisa diambil dari database vendor)
    •    foto pekerjaan (bisa diambil dari database vendor)
    •    dokumen legal (bisa diambil dari database vendor)

📌 10. Sistem Evaluasi Tender

Scoring otomatis:
    •    harga (30%)
    •    SLA compliance (20%)
    •    performa historis (30%)
    •    kapasitas (20%)

📌 11. Shortlist Vendor

Output:
    •    Top 3 vendor

📌 12. Final Selection

Oleh:
    •    Vendor Management
    •    Project Manager

👉 Output:
    •    Vendor Assigned

🔵 PHASE 4 — PROJECT EXECUTION

📌 13. Project Kickoff
    •    penunjukan SPV (awal pakai penunjukan. Nantinya akan pakai open tender SPV)
    •    meeting internal
    •    timeline final

📌 14. Vendor Start Work

Status:
👉 IN PROGRESS

📌 15. Daily Progress Report (WAJIB)

📄 Form Harian SPV
    •    tanggal
    •    progress hari ini (meter)
    •    total progress (%)
    •    kendala
    •    cuaca
    •    tenaga kerja

📸 Upload:
    •    foto progress
    •    video
    •    (opsional) AI scan

📌 16. Monitoring System

System menampilkan:
    •    progress vs target
    •    delay warning
    •    performance vendor

🟣 PHASE 5 — PAYMENT & TERMIN

📌 17. Progress Validation
    •    SPV approve
    •    system validasi

📌 18. Termin Payment Trigger

Contoh:
    •    30% → saat material dan tukang diterima di lokasi proyek
    •    30% → saat 50% progress
    •    30% → saat 100% progress
    •    10% → after QC bersama dengan client


📌 19. Escrow Release

Flow:
    1.    progress approved
    2.    sistem trigger
    3.    dana cair ke vendor

🔴 PHASE 6 — PROJECT COMPLETION

📌 20. Final QC

Checklist:
    •    kualitas
    •    spesifikasi
    •    finishing

📌 21. BAST (Serah Terima)
    •    client approve
    •    dokumen ditandatangani

📌 22. Final Payment
    •    sisa pembayaran
    •    retensi (jika ada)

📌 23. Project Close

System update:
    •    status: COMPLETED
    •    vendor score update
    •    client rating

🔴 DATA YANG TERSIMPAN (KRITIKAL UNTUK SYSTEM)

Client Data
Project Data
Vendor Performance
Financial Flow
Progress Documentation

🎯 KEY SYSTEM DESIGN (IMPORTANT)

1. Event-Based Workflow
    •    setiap step trigger step berikutnya

1. Approval Layer
    •    client
    •    SPV
    •    system

1. Transparency Layer
    •    client lihat progress
    •    vendor tidak lihat client

1. Control Layer
    •    semua via sistem
    •    tidak bisa bypass
