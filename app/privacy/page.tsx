import Link from "next/link"

export const metadata = {
  title: "Kebijakan Privasi | LPrecast",
  description: "Kebijakan privasi dan perlindungan data LPrecast",
}
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function PrivacyPage() {
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
            Privacy Policy
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
              Di LPrecast, kami sangat menghargai privasi Anda. Kebijakan
              Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
              dan melindungi informasi pribadi Anda.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="data-dikumpulkan">
                <AccordionTrigger>A. Data yang Dikumpulkan</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast mengumpulkan data pengguna secara terbatas,
                    relevan, dan proporsional untuk mendukung penyediaan layanan
                    secara optimal. Data yang dikumpulkan hanya digunakan untuk
                    tujuan yang sah, jelas, dan sesuai dengan kebutuhan
                    operasional platform.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Data Identitas
                    </h4>
                    <p>
                      Data identitas merupakan informasi dasar yang digunakan
                      untuk mengenali dan menghubungi pengguna. Data ini dapat
                      mencakup:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Nama lengkap</li>
                      <li>Nomor telepon</li>
                      <li>Alamat email</li>
                      <li>Alamat lokasi proyek</li>
                      <li>
                        Informasi perusahaan (jika pengguna merupakan badan
                        usaha)
                      </li>
                    </ul>
                    <p>
                      Data identitas digunakan untuk verifikasi pengguna,
                      komunikasi terkait layanan dan proyek, serta administrasi
                      penggunaan platform.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Data Proyek
                    </h4>
                    <p>
                      Data proyek merupakan informasi teknis yang berkaitan
                      dengan pekerjaan yang diajukan melalui platform LPrecast.
                      Data ini dapat mencakup:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Jenis pekerjaan (pagar beton, paving block, drainase,
                        dll)
                      </li>
                      <li>Volume atau ukuran proyek</li>
                      <li>Lokasi proyek</li>
                      <li>Spesifikasi teknis</li>
                      <li>Gambar kerja, foto, atau video proyek</li>
                    </ul>
                    <p>
                      Data proyek digunakan untuk perhitungan estimasi biaya,
                      perencanaan dan pelaksanaan proyek, serta monitoring
                      progress pekerjaan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Data Transaksi
                    </h4>
                    <p>
                      Data transaksi adalah informasi yang berkaitan dengan
                      aktivitas keuangan pengguna dalam platform, termasuk:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Nilai proyek</li>
                      <li>Metode pembayaran</li>
                      <li>Riwayat pembayaran (DP, termin, pelunasan)</li>
                      <li>Status transaksi</li>
                    </ul>
                    <p>
                      Data ini digunakan untuk pengelolaan sistem pembayaran,
                      pencatatan keuangan, serta transparansi dan akuntabilitas
                      transaksi.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tujuan-penggunaan">
                <AccordionTrigger>B. Tujuan Penggunaan Data</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    Data yang dikumpulkan oleh LPrecast digunakan secara sah,
                    terbatas, dan bertanggung jawab untuk mendukung operasional
                    layanan serta meningkatkan kualitas pengalaman pengguna.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Operasional Proyek
                    </h4>
                    <p>
                      Data digunakan untuk memastikan kelancaran seluruh proses
                      layanan, termasuk:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Verifikasi kebutuhan pengguna</li>
                      <li>Perencanaan dan pelaksanaan proyek</li>
                      <li>Koordinasi internal dengan Tim Leora dan Rekan</li>
                      <li>Pengawasan dan monitoring progress</li>
                      <li>Penyampaian laporan kepada pengguna</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Analitik & Evaluasi Sistem
                    </h4>
                    <p>
                      LPrecast menggunakan data untuk keperluan analisis, antara
                      lain:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Memahami pola penggunaan platform</li>
                      <li>Mengidentifikasi kebutuhan pengguna</li>
                      <li>Mengevaluasi performa sistem dan layanan</li>
                    </ul>
                    <p>
                      Penggunaan data untuk analitik dilakukan secara terukur,
                      terbatas, dan dapat menggunakan data agregat tanpa
                      mengungkap identitas pribadi.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Peningkatan Layanan
                    </h4>
                    <p>Data digunakan untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Meningkatkan kualitas produk dan layanan</li>
                      <li>Mengembangkan fitur baru</li>
                      <li>Memperbaiki sistem operasional</li>
                      <li>Meningkatkan kecepatan dan ketepatan layanan</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Komunikasi dan Informasi
                    </h4>
                    <p>Data dapat digunakan untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Memberikan update terkait proyek</li>
                      <li>Menyampaikan notifikasi penting</li>
                      <li>
                        Memberikan informasi layanan atau perubahan kebijakan
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="berbagi-data">
                <AccordionTrigger>C. Berbagi Data</AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast menjaga kerahasiaan data pengguna dan tidak akan
                    menjual atau menyalahgunakan data dalam bentuk apa pun.
                    Namun, dalam rangka menjalankan layanan, data dapat
                    dibagikan secara terbatas dan terkendali.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Dengan Tim Leora dan Rekan (Terbatas & Relevan)
                    </h4>
                    <p>
                      Dalam pelaksanaan proyek, LPrecast dapat membagikan data
                      kepada Tim Leora dan Rekan, dengan ketentuan:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Hanya data yang relevan dengan kebutuhan proyek yang
                        dibagikan
                      </li>
                      <li>
                        Penggunaan data dibatasi hanya untuk kepentingan
                        pelaksanaan pekerjaan
                      </li>
                      <li>
                        Pihak yang menerima data wajib menjaga kerahasiaan dan
                        keamanan data
                      </li>
                    </ul>
                    <p>
                      LPrecast memastikan bahwa seluruh pihak internal yang
                      terlibat telah terikat dengan kewajiban kerahasiaan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Dengan Pihak Ketiga
                    </h4>
                    <p>
                      LPrecast dapat bekerja sama dengan pihak ketiga untuk
                      mendukung layanan, seperti:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Penyedia sistem pembayaran (escrow/payment gateway)
                      </li>
                      <li>Penyedia teknologi dan infrastruktur</li>
                      <li>Penyedia layanan analitik</li>
                    </ul>
                    <p>
                      Dalam hal ini, data yang dibagikan hanya sebatas yang
                      diperlukan, pihak ketiga wajib mematuhi standar keamanan
                      dan kerahasiaan data, serta penggunaan data harus sesuai
                      dengan tujuan yang telah ditentukan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Kewajiban Hukum dan Perlindungan
                    </h4>
                    <p>
                      LPrecast dapat mengungkapkan data pengguna apabila
                      diperlukan untuk:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        Memenuhi kewajiban hukum atau peraturan yang berlaku
                      </li>
                      <li>
                        Menanggapi permintaan dari otoritas yang berwenang
                      </li>
                      <li>
                        Melindungi hak, keamanan, dan kepentingan LPrecast
                        maupun pengguna
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="keamanan-data">
                <AccordionTrigger>
                  D. Keamanan Data (Data Security)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast berkomitmen untuk melindungi data pengguna melalui
                    sistem keamanan yang memadai, baik secara teknis maupun
                    operasional, guna mencegah akses tidak sah, penyalahgunaan,
                    atau kebocoran data.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Perlindungan Sistem Teknologi
                    </h4>
                    <p>
                      Data disimpan dalam sistem yang dilindungi dengan
                      teknologi keamanan, termasuk enkripsi, firewall, dan
                      kontrol akses terbatas.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Kontrol Akses Internal
                    </h4>
                    <p>
                      Akses terhadap data pengguna hanya diberikan kepada pihak
                      internal yang berwenang, termasuk Tim Leora dan Rekan,
                      sesuai dengan kebutuhan operasional proyek.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Pembatasan Akses Berdasarkan Fungsi
                    </h4>
                    <p>
                      Setiap pihak hanya dapat mengakses data yang relevan
                      dengan tugas dan tanggung jawabnya.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Pengawasan dan Monitoring Sistem
                    </h4>
                    <p>
                      LPrecast melakukan pemantauan sistem secara berkala untuk
                      mendeteksi potensi ancaman atau aktivitas yang
                      mencurigakan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Evaluasi dan Peningkatan Keamanan
                    </h4>
                    <p>
                      Sistem keamanan akan terus diperbarui dan ditingkatkan
                      seiring dengan perkembangan teknologi dan potensi risiko.
                      Meskipun demikian, pengguna memahami bahwa tidak ada
                      sistem yang sepenuhnya bebas dari risiko, sehingga
                      LPrecast tidak dapat menjamin keamanan absolut, namun akan
                      selalu berupaya maksimal dalam melindungi data pengguna.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hak-pengguna">
                <AccordionTrigger>
                  E. Hak Pengguna (User Rights)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast menghormati hak setiap pengguna atas data pribadi
                    yang dimiliki. Pengguna memiliki hak untuk mengakses,
                    mengelola, dan mengontrol data mereka sepanjang tidak
                    bertentangan dengan kewajiban hukum dan operasional.
                  </p>

                  <ul className="list-disc space-y-3 pl-6">
                    <li>
                      <span className="font-medium text-foreground">
                        Hak Akses Data:
                      </span>{" "}
                      Pengguna berhak mengetahui data apa saja yang disimpan
                      oleh LPrecast.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Hak Perbaikan Data:
                      </span>{" "}
                      Pengguna dapat meminta perbaikan apabila terdapat data
                      yang tidak akurat atau tidak terbaru.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Hak Pembaruan Data:
                      </span>{" "}
                      Pengguna dapat memperbarui informasi pribadi melalui
                      sistem atau dengan menghubungi LPrecast.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Hak Pembatasan Penggunaan Data:
                      </span>{" "}
                      Pengguna dapat mengajukan pembatasan penggunaan data dalam
                      kondisi tertentu, sepanjang tidak menghambat pelaksanaan
                      layanan.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Hak Penghapusan Data:
                      </span>{" "}
                      Pengguna dapat mengajukan penghapusan data, dengan
                      ketentuan: tidak sedang dalam proses proyek aktif, tidak
                      melanggar kewajiban hukum atau administrasi, serta tidak
                      bertentangan dengan kepentingan operasional yang sah.
                    </li>
                  </ul>

                  <p>
                    Permintaan terkait hak pengguna dapat diajukan melalui
                    kontak resmi LPrecast dan akan diproses dalam jangka waktu
                    yang wajar sesuai kebijakan internal.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="retensi-data">
                <AccordionTrigger>
                  F. Retensi Data (Data Retention)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast menyimpan data pengguna hanya selama diperlukan
                    untuk mendukung operasional layanan, memenuhi kewajiban
                    hukum, serta menjaga kepentingan bisnis yang sah.
                  </p>

                  <ul className="list-disc space-y-3 pl-6">
                    <li>
                      <span className="font-medium text-foreground">
                        Penyimpanan Selama Masa Aktif:
                      </span>{" "}
                      Data akan disimpan selama pengguna masih aktif menggunakan
                      layanan LPrecast.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Penyimpanan Pasca Proyek:
                      </span>{" "}
                      Data proyek akan tetap disimpan setelah proyek selesai
                      untuk kebutuhan dokumentasi, referensi layanan, dan
                      penyelesaian potensi sengketa.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Kewajiban Hukum & Administrasi:
                      </span>{" "}
                      Data tertentu dapat disimpan lebih lama sesuai peraturan
                      perpajakan, ketentuan hukum, atau kebutuhan audit.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Penghapusan Data:
                      </span>{" "}
                      Data akan dihapus atau dianonimkan apabila sudah tidak
                      diperlukan, masa retensi telah berakhir, atau atas
                      permintaan pengguna yang disetujui.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cookies">
                <AccordionTrigger>
                  G. Cookies & Tracking Technology
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast menggunakan teknologi seperti cookies dan sistem
                    pelacakan untuk meningkatkan pengalaman pengguna dan
                    performa platform.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Penggunaan Cookies
                    </h4>
                    <p>Cookies digunakan untuk:</p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Menyimpan preferensi pengguna</li>
                      <li>Mempermudah proses login</li>
                      <li>Meningkatkan kenyamanan penggunaan platform</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Penggunaan Data Tracking
                    </h4>
                    <p>
                      LPrecast dapat mengumpulkan data penggunaan seperti
                      aktivitas dalam aplikasi, halaman yang diakses, durasi
                      penggunaan, dan interaksi fitur. Data ini digunakan untuk
                      analisis performa sistem, peningkatan fitur, dan
                      optimalisasi pengalaman pengguna.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Kontrol oleh Pengguna
                    </h4>
                    <p>
                      Pengguna memiliki kendali untuk mengatur penggunaan
                      cookies melalui perangkat atau browser, serta membatasi
                      atau menonaktifkan cookies. Namun, pembatasan ini dapat
                      mempengaruhi fungsi tertentu dari platform.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Kebijakan Pihak Ketiga
                    </h4>
                    <p>
                      Dalam penggunaan layanan pihak ketiga (misalnya analitik
                      atau pembayaran), pihak tersebut dapat menggunakan
                      teknologi pelacakan sesuai kebijakan mereka masing-masing,
                      yang tetap berada dalam pengawasan LPrecast.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="perubahan-kebijakan">
                <AccordionTrigger>
                  H. Perubahan Kebijakan (Update Policy)
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    LPrecast berhak untuk melakukan perubahan, pembaruan, atau
                    penyesuaian terhadap Kebijakan Privasi ini dari waktu ke
                    waktu guna menyesuaikan dengan perkembangan layanan,
                    teknologi, kebutuhan operasional, serta ketentuan hukum dan
                    peraturan yang berlaku.
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      1. Hak Perubahan Kebijakan
                    </h4>
                    <p>
                      LPrecast dapat melakukan perubahan terhadap Kebijakan
                      Privasi dalam hal:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>Penambahan atau pengembangan fitur layanan</li>
                      <li>Perubahan sistem operasional atau teknologi</li>
                      <li>
                        Penyesuaian terhadap regulasi atau kebijakan hukum
                      </li>
                      <li>
                        Peningkatan standar keamanan dan perlindungan data
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      2. Pemberitahuan kepada Pengguna
                    </h4>
                    <p>
                      Setiap perubahan kebijakan akan disampaikan melalui
                      notifikasi pada aplikasi atau platform LPrecast, pembaruan
                      pada halaman Kebijakan Privasi, atau media komunikasi
                      resmi lainnya. Pengguna dianjurkan untuk secara berkala
                      meninjau Kebijakan Privasi ini guna memahami perubahan
                      yang berlaku.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      3. Tanggal Berlaku
                    </h4>
                    <p>
                      Setiap versi terbaru dari Kebijakan Privasi akan
                      mencantumkan tanggal berlaku, dan akan efektif sejak
                      tanggal tersebut dipublikasikan, kecuali ditentukan lain.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      4. Persetujuan Pengguna
                    </h4>
                    <p>
                      Dengan tetap menggunakan layanan LPrecast setelah adanya
                      perubahan Kebijakan Privasi, pengguna dianggap telah
                      membaca dan memahami perubahan tersebut, serta menyetujui
                      kebijakan yang telah diperbarui.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      5. Hak Pengguna atas Perubahan
                    </h4>
                    <p>
                      Apabila pengguna tidak menyetujui perubahan Kebijakan
                      Privasi, pengguna dapat menghentikan penggunaan layanan
                      dan/atau mengajukan penghapusan akun sesuai ketentuan yang
                      berlaku.
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
              <Link href="/terms/vendor" className="hover:text-foreground">
                TnC Vendor
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
