import Link from "next/link"

export const metadata = {
  title: "Syarat & Ketentuan | LPrecast",
  description: "Syarat dan ketentuan penggunaan platform LPrecast",
}
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function TnCClientPage() {
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
            Syarat & Ketentuan Client
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
              platform LPrecast sebagai Client, Anda setuju untuk terikat dengan
              Syarat & Ketentuan berikut. Silakan baca dengan seksama.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="definisi">
                <AccordionTrigger>A. Definisi</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Untuk tujuan penggunaan platform LPrecast, istilah-istilah
                    berikut memiliki arti sebagaimana dijelaskan di bawah ini:
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. LPrecast atau Platform
                    </h4>
                    <p>
                      LPrecast adalah platform digital yang dimiliki dan
                      dikelola oleh PT Leora Konstruksi Indonesia, yang
                      berfungsi sebagai sistem terintegrasi untuk: pemasaran
                      produk dan jasa beton pracetak (precast), perhitungan
                      estimasi biaya proyek konstruksi, pengelolaan transaksi,
                      serta pengawasan dan pelaksanaan proyek konstruksi secara
                      menyeluruh. LPrecast tidak hanya berfungsi sebagai
                      marketplace, tetapi juga sebagai pengendali operasional
                      proyek melalui sistem supervisi dan manajemen terpusat.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Perusahaan
                    </h4>
                    <p>
                      Yang dimaksud dengan Perusahaan adalah PT Leora Konstruksi
                      Indonesia, selaku pemilik dan pengelola resmi platform
                      LPrecast yang bertanggung jawab atas seluruh operasional,
                      sistem, dan layanan yang tersedia di dalamnya.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Client atau Pengguna
                    </h4>
                    <p>
                      Client adalah setiap individu atau badan usaha yang:
                      mendaftarkan diri pada platform LPrecast, menggunakan
                      layanan yang tersedia, serta melakukan pemesanan produk
                      atau jasa melalui platform LPrecast. Client bertindak
                      sebagai pihak yang membutuhkan dan menerima layanan
                      konstruksi yang difasilitasi oleh LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Tim Leora dan Rekan
                    </h4>
                    <p>
                      Tim Leora dan Rekan adalah pihak ketiga yang telah bekerja
                      sama dengan LPrecast dan bertugas untuk: menyediakan
                      produk beton pracetak, melaksanakan pekerjaan konstruksi
                      di lapangan, serta memenuhi standar kualitas yang
                      ditetapkan oleh LPrecast. Tim Leora dan Rekan bekerja di
                      bawah koordinasi LPrecast dan tidak memiliki hubungan
                      kontraktual langsung dengan Client.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">5. Proyek</h4>
                    <p>
                      Proyek adalah seluruh kegiatan pekerjaan konstruksi yang
                      dilakukan melalui platform LPrecast, termasuk namun tidak
                      terbatas pada: pemasangan pagar beton, pekerjaan paving
                      block, instalasi sistem drainase seperti u-ditch dan box
                      culvert, serta pekerjaan beton pracetak lainnya. Ruang
                      lingkup proyek ditentukan berdasarkan kesepakatan antara
                      Client dan LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      6. SPV (Site Project Supervisor)
                    </h4>
                    <p>
                      SPV adalah perwakilan resmi LPrecast di lapangan yang
                      memiliki tugas untuk: mengawasi pelaksanaan pekerjaan oleh
                      tim Leora dan Rekan, memastikan kualitas pekerjaan sesuai
                      standar, serta memonitor dan melaporkan progress proyek
                      secara berkala.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">7. Harga</h4>
                    <p>
                      Harga adalah nilai biaya proyek yang ditentukan melalui
                      sistem LPrecast, yang dapat berupa: estimasi awal
                      berdasarkan kalkulator sistem maupun harga final yang
                      telah disepakati antara Client dan LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      8. Pembayaran
                    </h4>
                    <p>
                      Pembayaran adalah seluruh transaksi keuangan yang
                      dilakukan oleh Client melalui platform LPrecast, termasuk:
                      pembayaran awal (deposit / DP), pembayaran bertahap
                      (termin), serta pelunasan proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">9. Escrow</h4>
                    <p>
                      Escrow adalah sistem penahanan dana sementara oleh
                      LPrecast, dimana: dana dari Client tidak langsung
                      diteruskan kepada tim Leora dan Rekan, dana hanya
                      dicairkan sesuai progress pekerjaan yang telah
                      diverifikasi.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="layanan-platform">
                <AccordionTrigger>B. Layanan Platform</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Peran LPrecast sebagai Platform Terintegrasi
                    </h4>
                    <p>
                      LPrecast berfungsi sebagai platform agregator yang
                      menghubungkan Client dengan tim Leora dan Rekan, sekaligus
                      sebagai pengelola dan pengendali seluruh proses proyek
                      konstruksi. Dalam hal ini, LPrecast tidak hanya
                      menyediakan akses ke produk dan jasa, tetapi juga:
                      mengatur jalannya proyek, memastikan kualitas pelaksanaan,
                      serta mengelola sistem pembayaran dan supervisi.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Jenis Layanan yang Disediakan
                    </h4>
                    <p className="font-medium">
                      2.1. LPrecast menyediakan layanan yang terintegrasi,
                      meliputi:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>
                        <span className="font-medium">
                          Marketplace Produk & Jasa:
                        </span>{" "}
                        Client dapat mencari dan memilih berbagai produk dan
                        layanan beton pracetak sesuai kebutuhan proyek melalui
                        platform LPrecast.
                      </li>
                      <li>
                        <span className="font-medium">
                          Kalkulator Biaya (Cost Calculator):
                        </span>{" "}
                        Client dapat menggunakan fitur kalkulator untuk
                        memperoleh estimasi biaya proyek dan memahami gambaran
                        awal anggaran yang dibutuhkan. Estimasi ini bersifat
                        indikatif dan dapat berubah setelah dilakukan verifikasi
                        teknis.
                      </li>
                      <li>
                        <span className="font-medium">
                          Konsultasi & Negosiasi:
                        </span>{" "}
                        LPrecast menyediakan layanan konsultasi untuk membantu
                        Client memahami kebutuhan teknis, menyesuaikan
                        spesifikasi proyek, serta melakukan negosiasi harga dan
                        ruang lingkup pekerjaan.
                      </li>
                      <li>
                        <span className="font-medium">
                          Pelaksanaan Proyek (Execution):
                        </span>{" "}
                        Setelah kesepakatan tercapai, tim Leora dan Rekan akan
                        ditunjuk oleh LPrecast, pekerjaan akan dilaksanakan oleh
                        tim Leora dan Rekan, serta seluruh proses tetap berada
                        di bawah kendali LPrecast.
                      </li>
                      <li>
                        <span className="font-medium">
                          Supervisi & Monitoring:
                        </span>{" "}
                        LPrecast akan melakukan pengawasan melalui penugasan SPV
                        di lapangan, monitoring progress proyek, serta
                        penyampaian laporan berkala kepada Client.
                      </li>
                    </ul>

                    <p className="mt-4 font-medium">
                      2.2. Sistem Pembayaran (Escrow)
                    </p>
                    <p>
                      LPrecast menyediakan sistem pembayaran yang aman melalui
                      mekanisme escrow untuk memastikan dana digunakan sesuai
                      progress, serta memberikan perlindungan bagi Client dan
                      kelancaran proyek.
                    </p>

                    <p className="mt-4 font-medium">2.3. Sistem White Label</p>
                    <p>Client memahami dan menyetujui bahwa:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Seluruh pekerjaan dilakukan atas nama LPrecast</li>
                      <li>
                        Identitas tim Leora dan Rekan tidak ditampilkan kepada
                        Client
                      </li>
                      <li>
                        Seluruh komunikasi dan koordinasi dilakukan melalui
                        LPrecast
                      </li>
                    </ul>

                    <p className="mt-4 font-medium">2.4. Batasan Layanan</p>
                    <p>
                      LPrecast tidak menjamin: hasil pekerjaan yang identik 100%
                      dengan referensi visual, kondisi lapangan yang tidak dapat
                      diprediksi, perubahan harga akibat faktor eksternal. Namun
                      demikian, LPrecast berkomitmen untuk memberikan layanan
                      terbaik sesuai standar yang berlaku.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="akun-pengguna">
                <AccordionTrigger>C. Akun Pengguna</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Registrasi Akun
                    </h4>
                    <p>
                      Untuk dapat menggunakan layanan LPrecast, Client wajib:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Membuat akun dengan data yang benar, lengkap, dan akurat
                      </li>
                      <li>
                        Menggunakan identitas yang sah serta memastikan
                        informasi yang diberikan dapat dipertanggungjawabkan
                      </li>
                    </ul>
                    <p>
                      LPrecast berhak untuk menolak, menangguhkan, atau
                      menghapus akun yang tidak memenuhi ketentuan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Keamanan Akun
                    </h4>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Client bertanggung jawab penuh atas keamanan akun,
                        kerahasiaan password, serta seluruh aktivitas yang
                        dilakukan melalui akun tersebut
                      </li>
                      <li>
                        Client wajib menjaga kerahasiaan data akses dan tidak
                        memberikan akses akun kepada pihak lain tanpa izin
                      </li>
                      <li>
                        Segala risiko yang timbul akibat kelalaian dalam menjaga
                        keamanan akun menjadi tanggung jawab Client
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Tanggung Jawab Pengguna
                    </h4>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Client wajib menggunakan platform LPrecast secara sah
                        dan sesuai hukum, bertanggung jawab, serta tidak
                        merugikan pihak lain
                      </li>
                      <li>
                        Client juga wajib memberikan informasi yang benar,
                        mengikuti seluruh prosedur yang ditetapkan, serta
                        mematuhi seluruh Terms & Conditions yang berlaku
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Larangan Penggunaan Akun
                    </h4>
                    <p>
                      Client dilarang untuk: menggunakan akun untuk tujuan
                      ilegal atau merugikan, menyalahgunakan fitur platform,
                      melakukan manipulasi data atau transaksi, atau melakukan
                      tindakan yang dapat mengganggu sistem LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Penangguhan dan Penghapusan Akun
                    </h4>
                    <p>
                      LPrecast berhak untuk menangguhkan, membatasi, atau
                      menghapus akun Client, apabila ditemukan: pelanggaran
                      terhadap Terms & Conditions, aktivitas mencurigakan, atau
                      penyalahgunaan platform.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="proses-pemesanan">
                <AccordionTrigger>D. Proses Pemesanan</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Alur Pemesanan
                    </h4>
                    <p>
                      Client memahami dan menyetujui bahwa seluruh proses
                      pemesanan di LPrecast dilakukan melalui tahapan berikut:
                    </p>
                    <p className="py-2 text-center font-medium">
                      Browse → Kalkulator → Konsultasi/Negosiasi → Deal →
                      Kontrak → Eksekusi Proyek
                    </p>
                    <p>
                      Pada tahap awal, Client dapat melakukan pencarian produk
                      atau layanan konstruksi melalui platform LPrecast
                      (browse). Selanjutnya, Client dapat menggunakan fitur
                      kalkulator biaya untuk memperoleh estimasi awal nilai
                      proyek berdasarkan kebutuhan yang diinput. Setelah
                      memperoleh estimasi, Client akan diarahkan untuk melakukan
                      konsultasi dengan tim LPrecast guna memvalidasi kebutuhan
                      proyek, menyesuaikan spesifikasi teknis, serta melakukan
                      negosiasi harga dan ruang lingkup pekerjaan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Penyesuaian & Finalisasi Scope
                    </h4>
                    <p>Client memahami bahwa:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Estimasi awal yang ditampilkan sistem bersifat indikatif
                      </li>
                      <li>
                        Harga dan ruang lingkup pekerjaan dapat berubah setelah
                        dilakukan verifikasi lapangan atau diskusi teknis
                      </li>
                      <li>
                        Kesepakatan akhir terkait harga, spesifikasi, volume
                        pekerjaan, serta jadwal pelaksanaan akan dituangkan
                        dalam bentuk kesepakatan final (deal) sebelum masuk ke
                        tahap kontrak
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Pembentukan Kontrak
                    </h4>
                    <p>
                      Setelah terjadi kesepakatan (deal), LPrecast akan
                      menerbitkan kontrak kerja atau dokumen kesepakatan digital
                      (e-contract), yang wajib disetujui oleh Client sebelum
                      proyek dimulai. Kontrak tersebut akan menjadi dasar hukum
                      yang mengikat kedua belah pihak, termasuk namun tidak
                      terbatas pada: ruang lingkup pekerjaan, nilai proyek,
                      jadwal pelaksanaan, serta mekanisme pembayaran.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Persetujuan & Aktivasi Proyek
                    </h4>
                    <p>
                      Proyek dinyatakan aktif apabila seluruh kondisi berikut
                      telah terpenuhi: Client telah menyetujui kontrak, Client
                      telah melakukan pembayaran sesuai ketentuan awal
                      (deposit/DP), serta seluruh data teknis yang dibutuhkan
                      telah lengkap. Tanpa pemenuhan kondisi di atas, LPrecast
                      berhak menunda pelaksanaan proyek.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="harga-pembayaran">
                <AccordionTrigger>E. Harga & Pembayaran</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Sistem Harga (Dynamic Pricing)
                    </h4>
                    <p>
                      Client memahami bahwa harga pada platform LPrecast
                      menggunakan sistem dynamic pricing, yang berarti: harga
                      dapat berubah berdasarkan kondisi proyek. Faktor yang
                      mempengaruhi meliputi: lokasi proyek, volume pekerjaan,
                      tingkat kesulitan, kondisi lapangan, ketersediaan tim
                      Leora dan Rekan, serta faktor eksternal lainnya. Harga
                      yang ditampilkan pada kalkulator merupakan estimasi awal,
                      dan harga final akan ditentukan setelah proses konsultasi
                      dan kesepakatan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Sistem Pembayaran (Escrow)
                    </h4>
                    <p>
                      Seluruh pembayaran yang dilakukan oleh Client akan
                      menggunakan sistem escrow (rekening bersama) yang dikelola
                      oleh LPrecast. Dalam sistem ini:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Dana yang dibayarkan oleh Client tidak langsung
                        diteruskan kepada tim Leora dan Rekan
                      </li>
                      <li>Dana akan ditahan sementara oleh LPrecast</li>
                      <li>
                        Dana hanya akan dicairkan kepada tim Leora dan Rekan
                        berdasarkan progress pekerjaan yang telah diverifikasi
                      </li>
                    </ul>
                    <p>
                      Tujuan sistem escrow adalah untuk melindungi kepentingan
                      Client, memastikan pekerjaan berjalan sesuai progres,
                      serta menjaga kualitas pelaksanaan proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Mekanisme Termin Pembayaran
                    </h4>
                    <p>
                      Pembayaran proyek dilakukan secara bertahap (termin), yang
                      umumnya terdiri dari:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Deposit / Down Payment (DP) sebelum proyek dimulai
                      </li>
                      <li>Pembayaran termin berdasarkan progress pekerjaan</li>
                      <li>
                        Pelunasan setelah pekerjaan selesai atau sesuai
                        kesepakatan
                      </li>
                    </ul>
                    <p>
                      Setiap pencairan dana kepada tim Leora dan Rekan akan
                      dilakukan setelah progress diverifikasi oleh tim LPrecast
                      / SPV, serta sesuai dengan milestone yang telah
                      disepakati.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Kewajiban Pembayaran Client
                    </h4>
                    <p>Client wajib:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Melakukan pembayaran tepat waktu sesuai jadwal yang
                        telah disepakati
                      </li>
                      <li>
                        Menggunakan metode pembayaran resmi yang disediakan oleh
                        LPrecast
                      </li>
                      <li>Tidak melakukan transaksi di luar sistem platform</li>
                    </ul>
                    <p>
                      Keterlambatan pembayaran dapat mengakibatkan penundaan
                      pekerjaan, penghentian sementara proyek, atau konsekuensi
                      lainnya sesuai kontrak.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Larangan Pembayaran di Luar Sistem
                    </h4>
                    <p>
                      Client dilarang untuk: melakukan pembayaran langsung
                      kepada tim Leora dan Rekan, melakukan transaksi di luar
                      platform LPrecast, atau melakukan kesepakatan pribadi
                      dengan pihak pelaksana proyek. Segala risiko yang timbul
                      akibat pelanggaran ketentuan ini menjadi tanggung jawab
                      penuh Client.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pembatalan-refund">
                <AccordionTrigger>F. Pembatalan & Refund</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Pembatalan oleh Client
                    </h4>
                    <p>
                      Client dapat mengajukan pembatalan proyek dengan ketentuan
                      sebagai berikut:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>
                        <span className="font-medium">
                          Sebelum Proyek Dimulai:
                        </span>{" "}
                        Jika pembatalan dilakukan sebelum proyek dimulai,
                        sebagian dana dapat dikembalikan dengan mempertimbangkan
                        biaya yang telah timbul, seperti biaya survei, biaya
                        administrasi, dan biaya persiapan lainnya.
                      </li>
                      <li>
                        <span className="font-medium">
                          Setelah Proyek Dimulai:
                        </span>{" "}
                        Jika pembatalan dilakukan setelah proyek berjalan, dana
                        yang telah digunakan untuk pekerjaan tidak dapat
                        dikembalikan. Sisa dana dapat dikembalikan setelah
                        dikurangi biaya pekerjaan yang telah dilakukan, biaya
                        material yang sudah digunakan, serta biaya operasional
                        lainnya.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Pembatalan oleh LPrecast
                    </h4>
                    <p>
                      LPrecast berhak membatalkan proyek apabila: Client tidak
                      memenuhi kewajiban pembayaran, terdapat informasi yang
                      tidak valid atau menyesatkan, kondisi lapangan tidak
                      memungkinkan untuk dilanjutkan, atau terjadi keadaan kahar
                      (force majeure). Dalam hal ini, pengembalian dana akan
                      dilakukan sesuai kondisi aktual proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Kebijakan Refund
                    </h4>
                    <p>
                      Refund (pengembalian dana) hanya dapat dilakukan apabila:
                      terdapat kelebihan pembayaran, proyek tidak dapat
                      dilanjutkan karena alasan yang sah, atau sesuai keputusan
                      hasil evaluasi LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Proses Refund
                    </h4>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Permintaan refund harus diajukan secara resmi melalui
                        platform atau tim LPrecast
                      </li>
                      <li>
                        Proses verifikasi dilakukan dalam waktu tertentu sesuai
                        kebijakan internal
                      </li>
                      <li>
                        Pengembalian dana dilakukan melalui metode pembayaran
                        yang sama atau metode lain yang disepakati
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Ketentuan Non-Refundable
                    </h4>
                    <p>
                      Beberapa biaya bersifat tidak dapat dikembalikan
                      (non-refundable), termasuk: biaya survei lapangan, biaya
                      administrasi, biaya mobilisasi awal, serta biaya lain yang
                      telah terealisasi.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pelaksanaan-proyek">
                <AccordionTrigger>G. Pelaksanaan Proyek</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Model Pelaksanaan Proyek
                    </h4>
                    <p>
                      Client memahami dan menyetujui bahwa seluruh pelaksanaan
                      proyek dilakukan melalui sistem terintegrasi LPrecast,
                      dimana: pekerjaan fisik di lapangan dilaksanakan oleh tim
                      Leora dan Rekan yang telah bekerja sama dengan LPrecast,
                      tim Leora dan Rekan tersebut bertindak atas nama LPrecast,
                      serta seluruh koordinasi, pengendalian, dan komunikasi
                      proyek berada di bawah kendali LPrecast. Dengan demikian,
                      Client tidak memiliki hubungan kerja langsung dengan tim
                      Leora dan Rekan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Sistem White Label
                    </h4>
                    <p>
                      LPrecast menerapkan sistem white label, dimana: seluruh
                      pekerjaan yang dilakukan oleh tim Leora dan Rekan
                      ditampilkan sebagai pekerjaan LPrecast, identitas tim
                      Leora dan Rekan tidak disampaikan kepada Client, serta
                      seluruh komunikasi proyek dilakukan melalui LPrecast.
                      Client menyetujui untuk tidak: mencari atau menghubungi
                      tim Leora dan Rekan secara langsung, atau melakukan kerja
                      sama di luar platform dengan pihak pelaksana proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Penunjukan Tim Leora dan Rekan
                    </h4>
                    <p>
                      Tim Leora dan Rekan yang melaksanakan proyek akan: dipilih
                      dan ditunjuk sepenuhnya oleh LPrecast, disesuaikan dengan
                      kebutuhan proyek, lokasi, dan kapasitas, serta telah
                      melalui proses seleksi dan evaluasi internal LPrecast.
                      LPrecast berhak untuk mengganti tim Leora dan Rekan
                      apabila diperlukan, serta melakukan penyesuaian sumber
                      daya demi kelancaran proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Peran SPV (Site Project Supervisor)
                    </h4>
                    <p>
                      Dalam setiap proyek, LPrecast akan menugaskan SPV yang
                      bertindak sebagai perwakilan resmi LPrecast di lapangan,
                      pengawas pekerjaan tim Leora dan Rekan, serta pengendali
                      kualitas dan progress proyek. SPV bertanggung jawab untuk
                      memastikan pekerjaan berjalan sesuai rencana, memonitor
                      progress harian, dan menyampaikan laporan kepada LPrecast
                      dan Client.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Monitoring & Pelaporan
                    </h4>
                    <p>
                      Selama pelaksanaan proyek, LPrecast akan menyediakan:
                      monitoring progress proyek secara berkala, laporan
                      pekerjaan dalam bentuk dokumentasi (foto/video/laporan),
                      serta update kondisi lapangan sesuai kebutuhan. Client
                      memahami bahwa laporan yang diberikan bersifat
                      representatif dan tidak semua detail teknis dapat
                      ditampilkan secara real-time.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      6. Penyesuaian di Lapangan
                    </h4>
                    <p>
                      Client memahami bahwa dalam pelaksanaan proyek, dapat
                      terjadi penyesuaian yang disebabkan oleh: kondisi tanah
                      atau lokasi yang berbeda dari asumsi awal, kendala teknis
                      di lapangan, faktor cuaca atau lingkungan, serta kondisi
                      lain di luar kendali. Dalam kondisi tersebut, LPrecast
                      berhak melakukan penyesuaian metode kerja, dan perubahan
                      biaya atau waktu akan dikomunikasikan kepada Client untuk
                      disepakati.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tanggung-jawab">
                <AccordionTrigger>
                  H. Tanggung Jawab & Limitasi
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Tanggung Jawab LPrecast
                    </h4>
                    <p>
                      LPrecast bertanggung jawab untuk: mengoordinasikan
                      pelaksanaan proyek, memastikan pekerjaan dilakukan sesuai
                      standar yang berlaku, melakukan pengawasan melalui SPV,
                      serta mengelola alur pembayaran melalui sistem escrow.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Batasan Tanggung Jawab
                    </h4>
                    <p>
                      Client memahami dan menyetujui bahwa tanggung jawab
                      LPrecast terbatas pada: ruang lingkup pekerjaan yang telah
                      disepakati dalam kontrak dan nilai proyek yang telah
                      dibayarkan oleh Client. LPrecast tidak bertanggung jawab
                      atas: kerugian tidak langsung (indirect loss), kehilangan
                      keuntungan (loss of profit), dampak lanjutan dari
                      keterlambatan atau perubahan proyek, serta keputusan atau
                      tindakan pihak ketiga di luar kendali LPrecast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Ketergantungan pada Data Client
                    </h4>
                    <p>
                      LPrecast tidak bertanggung jawab atas kesalahan yang
                      timbul akibat: data atau informasi yang tidak akurat dari
                      Client, perubahan kebutuhan yang tidak dikomunikasikan
                      dengan jelas, atau keputusan Client yang bertentangan
                      dengan rekomendasi teknis.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Force Majeure (Keadaan Kahar)
                    </h4>
                    <p>
                      Yang dimaksud dengan force majeure adalah kondisi di luar
                      kendali manusia, termasuk namun tidak terbatas pada:
                      bencana alam (banjir, gempa, longsor), cuaca ekstrem,
                      kebakaran, gangguan sosial atau politik, pandemi,
                      kebijakan pemerintah, serta kondisi lain yang tidak dapat
                      diprediksi. Dalam kondisi force majeure, pelaksanaan
                      proyek dapat tertunda atau dihentikan sementara, LPrecast
                      tidak dapat dikenakan penalti, dan jadwal proyek akan
                      disesuaikan secara wajar.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Keterbatasan Hasil Pekerjaan
                    </h4>
                    <p>
                      Client memahami bahwa: hasil pekerjaan konstruksi memiliki
                      toleransi teknis, tidak selalu dapat identik 100% dengan
                      visual referensi, serta variasi kecil dalam hasil
                      pekerjaan merupakan hal yang wajar dalam industri
                      konstruksi.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="komplain-dispute">
                <AccordionTrigger>I. Komplain & Dispute</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Mekanisme Komplain
                    </h4>
                    <p>
                      Client dapat mengajukan komplain apabila terdapat:
                      ketidaksesuaian pekerjaan, keterlambatan signifikan, atau
                      masalah lain terkait proyek. Komplain harus diajukan
                      melalui platform LPrecast atau kontak resmi LPrecast.
                      Komplain wajib disertai deskripsi yang jelas, bukti
                      pendukung (foto/video/dokumen), serta waktu kejadian.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Batas Waktu Pengajuan Komplain
                    </h4>
                    <p>
                      Client wajib mengajukan komplain selama proyek
                      berlangsung, atau maksimal dalam waktu tertentu setelah
                      pekerjaan selesai (sesuai ketentuan internal). Komplain
                      yang diajukan di luar batas waktu dapat tidak diproses.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Proses Penanganan Komplain
                    </h4>
                    <p>
                      Setelah komplain diterima, LPrecast akan: melakukan
                      verifikasi data dan bukti, melakukan evaluasi internal
                      bersama tim terkait, serta menentukan tindakan yang
                      diperlukan. Tindakan yang dapat diambil antara lain
                      perbaikan pekerjaan, penyesuaian teknis, atau solusi lain
                      yang dianggap wajar.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. SLA Penanganan
                    </h4>
                    <p>
                      LPrecast menetapkan standar waktu penanganan (SLA) sebagai
                      berikut: respon awal maksimal 1-2 hari kerja, proses
                      evaluasi maksimal 3-7 hari kerja, serta penyelesaian
                      menyesuaikan tingkat kompleksitas masalah.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Penyelesaian Sengketa (Dispute Resolution)
                    </h4>
                    <p>
                      Apabila terjadi sengketa, para pihak sepakat untuk
                      menyelesaikan secara musyawarah terlebih dahulu. Jika
                      tidak tercapai kesepakatan, maka dapat dilanjutkan melalui
                      mekanisme hukum sesuai peraturan yang berlaku di
                      Indonesia.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      6. Batasan Klaim
                    </h4>
                    <p>
                      Client memahami bahwa: setiap klaim harus berdasarkan
                      bukti yang valid, nilai klaim tidak dapat melebihi nilai
                      proyek yang dibayarkan, serta klaim atas kerugian tidak
                      langsung tidak dapat diajukan.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="larangan-pengguna">
                <AccordionTrigger>J. Larangan Pengguna</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Prinsip Umum
                    </h4>
                    <p>
                      Client wajib menggunakan platform LPrecast secara wajar,
                      bertanggung jawab, serta sesuai dengan hukum dan ketentuan
                      yang berlaku. Segala bentuk penyalahgunaan platform tidak
                      diperkenankan dan dapat dikenakan sanksi sesuai ketentuan
                      ini.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Larangan Penyalahgunaan Platform
                    </h4>
                    <p>Client dilarang untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Menggunakan platform untuk tujuan yang melanggar hukum
                      </li>
                      <li>
                        Memberikan informasi yang tidak benar, tidak lengkap,
                        atau menyesatkan
                      </li>
                      <li>
                        Melakukan manipulasi data proyek, harga, atau transaksi
                      </li>
                      <li>
                        Mencoba mengakses sistem, server, atau data LPrecast
                        tanpa izin
                      </li>
                      <li>
                        Melakukan tindakan yang dapat mengganggu kinerja
                        platform atau merugikan pengguna lain
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Larangan Bypass Sistem (Non-Circumvention)
                    </h4>
                    <p>Client secara tegas dilarang untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Menghubungi tim Leora dan Rekan secara langsung tanpa
                        persetujuan LPrecast
                      </li>
                      <li>
                        Melakukan transaksi di luar platform dengan pihak yang
                        diperkenalkan melalui LPrecast
                      </li>
                      <li>
                        Mencoba mengambil alih hubungan kerja secara langsung
                        dengan tim Leora dan Rekan
                      </li>
                      <li>
                        Melakukan kesepakatan yang bertujuan menghindari sistem
                        LPrecast
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Konsekuensi Pelanggaran Bypass
                    </h4>
                    <p>
                      Apabila Client terbukti melakukan bypass sistem: LPrecast
                      berhak menghentikan layanan secara sepihak, akun Client
                      dapat ditangguhkan atau dihapus, seluruh garansi dan
                      tanggung jawab LPrecast terhadap proyek dapat dinyatakan
                      tidak berlaku, serta Client dapat dikenakan sanksi
                      administratif atau tuntutan sesuai hukum yang berlaku.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Larangan Intervensi Operasional
                    </h4>
                    <p>
                      Client tidak diperkenankan untuk: memberikan instruksi
                      langsung kepada tim Leora dan Rekan tanpa melalui
                      LPrecast, mengubah scope pekerjaan secara sepihak di
                      lapangan, atau mengganggu alur kerja yang telah ditetapkan
                      oleh LPrecast. Segala komunikasi teknis dan operasional
                      wajib melalui tim LPrecast atau SPV yang ditunjuk.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      6. Perlindungan Sistem & Informasi
                    </h4>
                    <p>
                      Client dilarang untuk: menyalin, mendistribusikan, atau
                      menyalahgunakan informasi dari platform, menggunakan data
                      yang diperoleh dari LPrecast untuk kepentingan di luar
                      sistem, atau melakukan tindakan yang berpotensi merugikan
                      LPrecast secara langsung maupun tidak langsung.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="perubahan-syarat">
                <AccordionTrigger>
                  K. Perubahan Syarat & Ketentuan
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Hak Perubahan oleh LPrecast
                    </h4>
                    <p>
                      LPrecast berhak untuk: mengubah, menyesuaikan, atau
                      memperbarui Terms & Conditions ini sewaktu-waktu, serta
                      melakukan penyesuaian kebijakan sesuai perkembangan
                      bisnis, teknologi, atau regulasi.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Pemberitahuan Perubahan
                    </h4>
                    <p>
                      Setiap perubahan akan: diinformasikan melalui platform
                      LPrecast atau melalui media komunikasi resmi lainnya.
                      Client disarankan untuk membaca dan memahami pembaruan
                      secara berkala.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Persetujuan atas Perubahan
                    </h4>
                    <p>
                      Dengan tetap menggunakan layanan LPrecast setelah
                      perubahan dilakukan, Client dianggap telah membaca,
                      memahami, dan menyetujui Terms & Conditions terbaru.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Penolakan terhadap Perubahan
                    </h4>
                    <p>
                      Apabila Client tidak menyetujui perubahan Terms &
                      Conditions, Client dapat menghentikan penggunaan layanan
                      dengan tetap menyelesaikan kewajiban yang masih berjalan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Keberlakuan
                    </h4>
                    <p>
                      Ketentuan Terms & Conditions ini berlaku sejak ditampilkan
                      pada platform dan menjadi dasar hukum dalam seluruh
                      penggunaan layanan LPrecast.
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
              <Link href="/terms/vendor" className="hover:text-foreground">
                TnC Vendor
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
