import Link from "next/link"

export const metadata = {
  title: "Syarat & Ketentuan Vendor | LPrecast",
  description: "Syarat dan ketentuan kerja sama vendor dengan LPrecast",
}
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function TnCVendorPage() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-lg font-bold">LPrecast</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Syarat & Ketentuan Vendor
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="mt-8">
            <p className="mb-6 text-muted-foreground">
              Selamat datang di LPrecast. Dengan mengakses dan menggunakan
              platform LPrecast sebagai Vendor, Anda setuju untuk terikat dengan
              Syarat & Ketentuan berikut. Silakan baca dengan seksama.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="definisi">
                <AccordionTrigger>A. Definisi</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Dalam kerja sama melalui platform LPrecast, istilah-istilah
                    berikut memiliki arti sebagaimana dijelaskan di bawah ini.
                    Definisi ini bertujuan untuk memastikan tidak terjadi
                    perbedaan pemahaman antara LPrecast dan Vendor dalam
                    pelaksanaan proyek.
                  </p>

                  <p>
                    LPrecast adalah platform digital milik PT Leora Konstruksi
                    Indonesia yang berfungsi sebagai agregator vendor beton
                    pracetak di seluruh Indonesia, sekaligus sebagai sistem
                    terintegrasi untuk pengelolaan proyek konstruksi,
                    pengendalian kualitas, serta pengaturan transaksi. Dalam
                    operasionalnya, LPrecast memiliki kewenangan penuh dalam
                    mengatur penugasan proyek, alur kerja, serta hubungan antara
                    Client dan Vendor.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Perusahaan / Leora
                    </h4>
                    <p>
                      PT Leora Konstruksi Indonesia sebagai pemilik dan
                      pengelola LPrecast. Dalam komunikasi kepada Client,
                      seluruh pekerjaan direpresentasikan sebagai pekerjaan oleh
                      &quot;Tim Leora&quot; atau &quot;Leora & Rekan&quot;.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Vendor / Rekan
                    </h4>
                    <p>
                      Individu atau badan usaha yang telah terdaftar dan
                      disetujui oleh LPrecast untuk melaksanakan proyek.
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Internal: disebut Vendor / Rekan</li>
                      <li>
                        Eksternal (Client): bagian dari Tim Leora (white-label)
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Client</h4>
                    <p>
                      Pihak yang menggunakan layanan LPrecast untuk melakukan
                      pemesanan proyek. Vendor memahami bahwa hubungan
                      kontraktual hanya terjadi antara Client dan LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Proyek</h4>
                    <p>
                      Pekerjaan konstruksi yang ditugaskan oleh LPrecast kepada
                      Vendor, termasuk:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Pagar beton</li>
                      <li>Paving block</li>
                      <li>U-ditch / box culvert</li>
                      <li>Dan pekerjaan precast lainnya</li>
                    </ul>
                    <p>
                      Seluruh ruang lingkup proyek ditentukan dan dikendalikan
                      oleh LPrecast.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="status-hubungan">
                <AccordionTrigger>B. Status Hubungan</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor memahami dan menyetujui bahwa hubungan dengan
                    LPrecast adalah hubungan kemitraan (partnership), bukan
                    hubungan kerja. Vendor tidak dianggap sebagai karyawan,
                    pegawai tetap, maupun bagian dari struktur organisasi
                    internal LPrecast.
                  </p>

                  <p>
                    Dalam pelaksanaan proyek, Vendor bertindak sebagai pihak
                    independen yang bertanggung jawab atas seluruh aspek
                    operasional. Namun demikian, seluruh proyek tetap berada di
                    bawah kendali dan koordinasi LPrecast, sehingga Vendor wajib
                    mengikuti seluruh standar, arahan, dan kebijakan yang
                    ditetapkan.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Bukan hubungan kerja
                    </h4>
                    <p>
                      Vendor tidak berhak atas: gaji tetap bulanan, tunjangan
                      karyawan, fasilitas perusahaan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Tanggung jawab mandiri Vendor
                    </h4>
                    <p>
                      Vendor bertanggung jawab atas: tenaga kerja, peralatan,
                      metode kerja, operasional lapangan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Kontrol oleh LPrecast
                    </h4>
                    <p>
                      Meskipun mitra, Vendor wajib: mengikuti SOP, mengikuti
                      arahan SPV, serta menerima intervensi operasional jika
                      diperlukan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Larangan hubungan langsung dengan Client
                    </h4>
                    <p>
                      Vendor dilarang: berkomunikasi langsung dengan Client,
                      melakukan negosiasi langsung, menerima pembayaran dari
                      Client.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Representasi White Label
                    </h4>
                    <p>
                      Vendor wajib memahami bahwa: semua pekerjaan adalah atas
                      nama Leora, Vendor tidak boleh menampilkan identitas
                      sendiri, Vendor harus mengikuti standar branding LPrecast.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="kewajiban-vendor">
                <AccordionTrigger>C. Kewajiban Vendor</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor wajib melaksanakan seluruh pekerjaan dengan standar
                    profesional, sesuai spesifikasi teknis, serta memenuhi
                    target kualitas dan waktu yang telah ditentukan oleh
                    LPrecast. Kewajiban ini bersifat mengikat dan menjadi dasar
                    evaluasi kinerja serta keberlanjutan kerja sama.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Kualitas Pekerjaan
                    </h4>
                    <p>Vendor wajib:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Melaksanakan pekerjaan sesuai standar teknis LPrecast
                      </li>
                      <li>Memastikan hasil pekerjaan sesuai spesifikasi</li>
                      <li>
                        Melakukan perbaikan tanpa biaya tambahan apabila terjadi
                        kesalahan dari pihak Vendor
                      </li>
                    </ul>
                    <p>
                      Vendor bertanggung jawab penuh atas mutu pekerjaan dan
                      hasil akhir proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Kepatuhan terhadap SLA (Service Level Agreement)
                    </h4>
                    <p>
                      Vendor wajib memenuhi standar kinerja, meliputi: ketepatan
                      waktu pelaksanaan, pencapaian target progress, respons
                      terhadap arahan tim LPrecast.
                    </p>
                    <p>
                      Kegagalan memenuhi SLA dapat mengakibatkan: penalti,
                      penurunan performa, pembatasan proyek berikutnya.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Kepatuhan terhadap SOP
                    </h4>
                    <p>
                      Vendor wajib mematuhi seluruh SOP yang berlaku, termasuk:
                      SOP pelaksanaan proyek, SOP keselamatan kerja (K3), SOP
                      pelaporan dan dokumentasi, SOP komunikasi.
                    </p>
                    <p>
                      Pelanggaran terhadap SOP dapat berakibat: teguran, sanksi,
                      penghentian kerja sama.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Kewajiban Pelaporan
                    </h4>
                    <p>
                      Vendor wajib: memberikan laporan progress secara berkala,
                      menyertakan dokumentasi (foto/video), menyampaikan data
                      yang akurat dan tepat waktu.
                    </p>
                    <p>
                      Laporan ini menjadi dasar evaluasi dan pencairan
                      pembayaran.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Koordinasi dengan SPV
                    </h4>
                    <p>
                      Vendor wajib: mengikuti arahan SPV sebagai perwakilan
                      LPrecast, menjaga komunikasi yang profesional, tidak
                      menolak instruksi terkait kualitas dan progress.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      6. Tanggung Jawab Operasional
                    </h4>
                    <p>
                      Vendor bertanggung jawab atas: tenaga kerja, keselamatan
                      kerja, peralatan, kerusakan akibat pekerjaan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      7. Larangan Vendor
                    </h4>
                    <p>
                      Vendor dilarang untuk: menghubungi Client secara langsung,
                      melakukan transaksi di luar platform, menggunakan proyek
                      untuk kepentingan pribadi, membocorkan informasi proyek
                      atau sistem LPrecast.
                    </p>
                    <p>
                      Pelanggaran terhadap ketentuan ini dapat berakibat:
                      blacklist, pemutusan kerja sama, tuntutan hukum.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="white-label">
                <AccordionTrigger>D. White Label Policy</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor memahami dan menyetujui bahwa seluruh proyek yang
                    diperoleh melalui LPrecast dilaksanakan dengan sistem white
                    label, dimana seluruh pekerjaan direpresentasikan sebagai
                    pekerjaan oleh Leora / Tim Leora di hadapan Client. Dalam
                    hal ini, Vendor berperan sebagai pelaksana internal yang
                    tidak ditampilkan sebagai pihak independen.
                  </p>

                  <p>
                    Kebijakan ini bersifat mengikat dan kritikal, serta menjadi
                    dasar utama dalam menjaga integritas bisnis, brand, dan
                    hubungan dengan Client.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Larangan Kontak Langsung dengan Client
                    </h4>
                    <p>Vendor secara tegas dilarang untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Menghubungi Client secara langsung dalam bentuk apa pun
                      </li>
                      <li>Melakukan komunikasi di luar jalur resmi LPrecast</li>
                      <li>
                        Melakukan negosiasi atau diskusi proyek tanpa
                        persetujuan LPrecast
                      </li>
                      <li>
                        Menerima instruksi langsung dari Client tanpa melalui
                        LPrecast/SPV
                      </li>
                    </ul>
                    <p>
                      Seluruh komunikasi wajib melalui tim LPrecast atau SPV
                      yang ditunjuk sebagai perwakilan resmi.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Larangan Branding Sendiri
                    </h4>
                    <p>Vendor tidak diperkenankan untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Menggunakan nama perusahaan sendiri di lokasi proyek
                      </li>
                      <li>Memasang logo, atribut, atau identitas Vendor</li>
                      <li>
                        Memperkenalkan diri sebagai pihak utama pelaksana proyek
                      </li>
                      <li>
                        Melakukan dokumentasi publik dengan identitas Vendor
                        tanpa izin
                      </li>
                    </ul>
                    <p>
                      Vendor wajib: menggunakan identitas dan standar branding
                      LPrecast, mengikuti arahan komunikasi yang ditetapkan oleh
                      LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Larangan Pengambilalihan Client (Non-Circumvention)
                    </h4>
                    <p>Vendor dilarang untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Menawarkan jasa langsung kepada Client yang diperoleh
                        dari LPrecast
                      </li>
                      <li>
                        Menjalin kerja sama di luar platform dengan Client yang
                        sama
                      </li>
                      <li>
                        Menggunakan informasi Client untuk kepentingan pribadi
                        atau bisnis lain
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Kerahasiaan Informasi
                    </h4>
                    <p>
                      Vendor wajib menjaga kerahasiaan seluruh informasi yang
                      diperoleh, termasuk: data Client, nilai proyek, sistem
                      kerja LPrecast, serta strategi bisnis.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Sanksi Pelanggaran
                    </h4>
                    <p>
                      Pelanggaran terhadap White Label Policy akan dikenakan
                      sanksi tegas, berupa: pemutusan kerja sama secara sepihak,
                      blacklist permanen dari sistem LPrecast, penahanan atau
                      pembatalan pembayaran, kewajiban ganti rugi atas kerugian
                      yang timbul, serta kemungkinan tindakan hukum sesuai
                      peraturan yang berlaku.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sistem-tender">
                <AccordionTrigger>
                  E. Sistem Tender & Penugasan Proyek
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast menerapkan sistem tender dan penugasan proyek untuk
                    memastikan bahwa setiap proyek dikerjakan oleh Vendor yang
                    paling sesuai dari sisi harga, kualitas, dan kapasitas.
                    Vendor memahami bahwa seluruh proses penunjukan proyek
                    sepenuhnya berada di bawah kewenangan LPrecast.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Mekanisme Tender (Bidding System)
                    </h4>
                    <p>
                      Untuk proyek tertentu, LPrecast dapat membuka sistem
                      bidding, dimana:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Vendor akan menerima informasi proyek secara terbatas
                      </li>
                      <li>
                        Vendor dapat mengajukan penawaran harga dan metode kerja
                      </li>
                      <li>
                        LPrecast akan melakukan evaluasi terhadap seluruh
                        penawaran yang masuk
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Kriteria Penilaian Vendor
                    </h4>
                    <p>
                      Penentuan Vendor tidak hanya berdasarkan harga, tetapi
                      juga mempertimbangkan:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Performa historis (quality & SLA)</li>
                      <li>Kapasitas produksi dan tenaga kerja</li>
                      <li>Lokasi dan efisiensi logistik</li>
                      <li>Kepatuhan terhadap SOP</li>
                      <li>Serta reputasi Vendor dalam sistem LPrecast</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Hak Penunjukan oleh LPrecast
                    </h4>
                    <p>
                      LPrecast memiliki hak penuh untuk: memilih Vendor tanpa
                      harus memilih penawaran terendah, menunjuk Vendor secara
                      langsung tanpa tender (direct assignment), serta mengganti
                      Vendor jika dianggap tidak memenuhi standar.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Kewajiban Vendor dalam Tender
                    </h4>
                    <p>
                      Vendor wajib: memberikan penawaran yang realistis dan
                      dapat dipertanggungjawabkan, tidak melakukan manipulasi
                      harga, serta siap melaksanakan pekerjaan sesuai penawaran
                      yang diajukan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Komitmen setelah Penunjukan
                    </h4>
                    <p>
                      Setelah ditunjuk, Vendor wajib: menerima dan menjalankan
                      proyek sesuai kesepakatan, tidak mengundurkan diri tanpa
                      alasan yang sah, serta mematuhi seluruh ketentuan yang
                      telah disepakati.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="harga-pembayaran">
                <AccordionTrigger>F. Harga & Pembayaran</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor memahami bahwa seluruh sistem harga dan pembayaran
                    dalam LPrecast diatur secara terpusat untuk menjaga
                    stabilitas harga, margin perusahaan, serta keberlanjutan
                    bisnis.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Sistem Margin
                    </h4>
                    <p>
                      Harga yang diberikan kepada Client merupakan harga yang
                      telah ditentukan oleh LPrecast dengan mempertimbangkan
                      margin perusahaan.
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Vendor hanya menerima nilai pekerjaan yang telah
                        disepakati dengan LPrecast
                      </li>
                      <li>
                        Vendor tidak memiliki hak untuk mengetahui atau
                        mengintervensi harga jual ke Client
                      </li>
                      <li>
                        Selisih antara harga Vendor dan harga Client merupakan
                        hak LPrecast sebagai pengelola platform
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Penetapan Harga Vendor
                    </h4>
                    <p>
                      Vendor wajib: memberikan harga dasar (base cost) yang
                      wajar dan kompetitif, tidak melakukan mark-up di luar
                      kesepakatan, serta menjaga konsistensi harga sesuai
                      kondisi pasar dan kualitas pekerjaan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Sistem Pembayaran (Escrow)
                    </h4>
                    <p>
                      Seluruh pembayaran proyek dilakukan melalui sistem escrow
                      yang dikelola oleh LPrecast, dimana: dana dari Client
                      ditahan terlebih dahulu oleh LPrecast, pembayaran kepada
                      Vendor dilakukan secara bertahap berdasarkan progress
                      pekerjaan, serta pencairan dilakukan setelah verifikasi
                      oleh LPrecast atau SPV.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Mekanisme Pembayaran Vendor
                    </h4>
                    <p>
                      Pembayaran kepada Vendor dilakukan berdasarkan: progress
                      pekerjaan yang telah disetujui, laporan dan dokumentasi
                      yang valid, serta hasil verifikasi lapangan oleh SPV.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Syarat Pencairan Dana
                    </h4>
                    <p>
                      Vendor berhak menerima pembayaran apabila: pekerjaan
                      sesuai dengan standar kualitas, progress sesuai dengan
                      target, serta tidak terdapat pelanggaran terhadap SOP atau
                      perjanjian.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      6. Penundaan atau Pemotongan Pembayaran
                    </h4>
                    <p>
                      LPrecast berhak untuk: menunda pembayaran jika terdapat
                      ketidaksesuaian pekerjaan, melakukan pemotongan jika
                      terjadi keterlambatan, cacat pekerjaan, atau pelanggaran
                      SLA.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      7. Larangan Transaksi di Luar Sistem
                    </h4>
                    <p>
                      Vendor dilarang untuk: menerima pembayaran langsung dari
                      Client, melakukan transaksi di luar platform, atau membuat
                      kesepakatan pembayaran di luar sistem LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      8. Konsekuensi Pelanggaran
                    </h4>
                    <p>
                      Pelanggaran terhadap sistem pembayaran akan berakibat:
                      penahanan pembayaran, pemutusan kerja sama, blacklist
                      Vendor, serta tindakan hukum apabila diperlukan.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sla-kpi">
                <AccordionTrigger>
                  G. SLA & KPI (Standar Performa Vendor)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor wajib menjaga standar performa yang telah ditetapkan
                    oleh LPrecast sebagai dasar evaluasi keberlanjutan kerja
                    sama. Penilaian performa dilakukan secara berkala
                    berdasarkan indikator Service Level Agreement (SLA) dan Key
                    Performance Indicator (KPI) yang terukur, objektif, dan
                    terdokumentasi.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Komponen SLA (Service Level Agreement)
                    </h4>
                    <p>Vendor wajib memenuhi standar layanan berikut:</p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>
                        <span className="font-medium">
                          Ketepatan Waktu (On-Time Delivery):
                        </span>{" "}
                        Pekerjaan harus diselesaikan sesuai timeline yang telah
                        disepakati.
                      </li>
                      <li>
                        <span className="font-medium">
                          Progress Harian / Mingguan:
                        </span>{" "}
                        Target progress harus tercapai sesuai rencana kerja.
                      </li>
                      <li>
                        <span className="font-medium">Responsivitas:</span>{" "}
                        Vendor wajib merespons arahan atau komunikasi dari
                        LPrecast/SPV dalam waktu yang wajar.
                      </li>
                      <li>
                        <span className="font-medium">
                          Kehadiran & Konsistensi Tim:
                        </span>{" "}
                        Tenaga kerja harus tersedia sesuai kebutuhan proyek.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Komponen KPI (Key Performance Indicator)
                    </h4>
                    <p>
                      Kinerja Vendor akan diukur berdasarkan indikator berikut:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Kualitas Pekerjaan (hasil akhir & kesesuaian
                        spesifikasi)
                      </li>
                      <li>Kepatuhan terhadap SOP & K3</li>
                      <li>Tingkat Rework / Perbaikan</li>
                      <li>Kedisiplinan terhadap jadwal</li>
                      <li>Kualitas komunikasi & koordinasi</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Sistem Penilaian Vendor
                    </h4>
                    <p>
                      LPrecast berhak: memberikan skor performa Vendor per
                      proyek, mengklasifikasikan Vendor berdasarkan performa
                      (Tier A/B/C), menggunakan hasil penilaian sebagai dasar
                      penugasan proyek berikutnya, prioritas dalam tender, atau
                      pembatasan kerja sama.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="penalti-sanksi">
                <AccordionTrigger>H. Penalti & Sanksi</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor memahami bahwa setiap pelanggaran terhadap ketentuan,
                    SLA, atau SOP akan dikenakan sanksi sesuai tingkat
                    pelanggaran. Sistem penalti ini bertujuan untuk menjaga
                    kualitas layanan, disiplin operasional, serta kepercayaan
                    Client terhadap LPrecast.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Jenis Pelanggaran
                    </h4>
                    <p>
                      Pelanggaran yang dapat dikenakan sanksi meliputi:
                      keterlambatan pekerjaan, kualitas pekerjaan di bawah
                      standar, pelanggaran SOP atau K3, ketidakpatuhan terhadap
                      arahan LPrecast/SPV, serta pelanggaran terhadap White
                      Label Policy.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Jenis Sanksi
                    </h4>
                    <p>
                      Sanksi dapat diberikan secara bertahap atau langsung,
                      tergantung tingkat pelanggaran:
                    </p>
                    <ul className="list-disc space-y-3 pl-6">
                      <li>
                        <span className="font-medium">
                          Denda (Financial Penalty):
                        </span>{" "}
                        Dikenakan untuk keterlambatan atau kegagalan memenuhi
                        SLA, dapat berupa pemotongan pembayaran atau biaya
                        tambahan atas perbaikan pekerjaan.
                      </li>
                      <li>
                        <span className="font-medium">Downgrade Vendor:</span>{" "}
                        Vendor dapat diturunkan levelnya (misalnya dari Tier A
                        ke B atau C), yang berdampak pada penurunan prioritas
                        proyek, pembatasan akses tender, serta pengurangan
                        volume pekerjaan.
                      </li>
                      <li>
                        <span className="font-medium">Suspensi Sementara:</span>{" "}
                        Vendor dapat dihentikan sementara dari sistem apabila
                        performa menurun secara signifikan, terdapat pelanggaran
                        berulang, atau diperlukan evaluasi lebih lanjut.
                      </li>
                      <li>
                        <span className="font-medium">
                          Blacklist (Pemutusan Permanen):
                        </span>{" "}
                        Vendor akan masuk daftar hitam apabila melakukan
                        pelanggaran berat (misalnya bypass, fraud, atau
                        manipulasi), merugikan LPrecast atau Client secara
                        signifikan, atau tidak menunjukkan perbaikan setelah
                        diberikan peringatan.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Hak LPrecast
                    </h4>
                    <p>
                      LPrecast berhak untuk: menentukan jenis dan besaran
                      sanksi, melakukan pemotongan pembayaran, serta mengambil
                      tindakan lain yang dianggap perlu untuk melindungi bisnis.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="terminasi">
                <AccordionTrigger>
                  I. Terminasi (Pemutusan Kerja Sama)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor memahami bahwa kerja sama dapat dihentikan oleh
                    LPrecast apabila Vendor tidak memenuhi standar atau
                    melanggar ketentuan yang berlaku.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Terminasi oleh LPrecast
                    </h4>
                    <p>
                      LPrecast berhak melakukan pemutusan kerja sama secara
                      sepihak apabila: Vendor melanggar Terms & Conditions,
                      Vendor tidak memenuhi SLA/KPI secara berulang, Vendor
                      melakukan pelanggaran White Label atau Non-Circumvention,
                      atau Vendor tidak kooperatif dalam pelaksanaan proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Terminasi oleh Vendor
                    </h4>
                    <p>
                      Vendor dapat mengajukan penghentian kerja sama dengan
                      ketentuan: menyelesaikan seluruh proyek yang sedang
                      berjalan, tidak meninggalkan kewajiban yang belum
                      diselesaikan, serta memberikan pemberitahuan terlebih
                      dahulu kepada LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Konsekuensi Terminasi
                    </h4>
                    <p>
                      Setelah terminasi: seluruh akses Vendor ke sistem LPrecast
                      akan dihentikan, pembayaran akan diselesaikan sesuai
                      kondisi terakhir proyek, serta Vendor tidak diperkenankan
                      menggunakan data atau relasi dari LPrecast.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="non-circumvention">
                <AccordionTrigger>
                  J. Non-Circumvention (Anti Bypass)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor secara tegas dilarang untuk melakukan tindakan yang
                    bertujuan mengambil alih Client atau menghindari sistem
                    LPrecast.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Larangan Utama
                    </h4>
                    <p>Vendor dilarang untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Menawarkan jasa langsung kepada Client yang diperoleh
                        melalui LPrecast
                      </li>
                      <li>
                        Melakukan kerja sama di luar platform dengan Client yang
                        sama
                      </li>
                      <li>
                        Menggunakan data atau informasi Client untuk kepentingan
                        pribadi
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Cakupan Berlaku
                    </h4>
                    <p>
                      Ketentuan ini berlaku selama kerja sama berlangsung dan
                      dalam jangka waktu tertentu setelah kerja sama berakhir.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Sanksi Pelanggaran
                    </h4>
                    <p>
                      Pelanggaran terhadap ketentuan ini akan dikenakan:
                      blacklist permanen, kewajiban ganti rugi, serta tindakan
                      hukum sesuai peraturan yang berlaku.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="kerahasiaan">
                <AccordionTrigger>
                  K. Kerahasiaan (Confidentiality)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Vendor wajib menjaga kerahasiaan seluruh informasi yang
                    diperoleh selama bekerja sama dengan LPrecast, baik selama
                    masa kerja sama maupun setelahnya.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Ruang Lingkup Informasi Rahasia
                    </h4>
                    <p>
                      Informasi yang wajib dijaga meliputi: data Client, nilai
                      dan detail proyek, sistem operasional LPrecast, strategi
                      bisnis, serta informasi lain yang tidak bersifat publik.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Kewajiban Vendor
                    </h4>
                    <p>
                      Vendor wajib: tidak membocorkan informasi kepada pihak
                      ketiga, tidak menggunakan informasi untuk kepentingan
                      pribadi, serta menjaga keamanan data yang diterima.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Pengecualian
                    </h4>
                    <p>
                      Informasi dapat dibuka hanya apabila diwajibkan oleh
                      hukum, atau atas persetujuan tertulis dari LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Konsekuensi Pelanggaran
                    </h4>
                    <p>
                      Pelanggaran terhadap kerahasiaan akan dikenakan: sanksi
                      administratif, pemutusan kerja sama, serta tuntutan hukum
                      atas kerugian yang timbul.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 md:py-12">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LPrecast. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms/client" className="hover:text-foreground">
                TnC Client
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
