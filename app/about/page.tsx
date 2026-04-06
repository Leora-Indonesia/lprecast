import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-lg font-bold">LPrecast</span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/#features"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Fitur
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cara Kerja
              </Link>
              <Link
                href="/#cta"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Kontak
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-foreground"
              >
                Tentang Kami
              </Link>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Tentang LPrecast
          </h1>

          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              LPrecast adalah platform konstruksi yang menghubungkan client
              dengan mitra terverifikasi untuk proyek-proyek konstruksi
              berkualitas tinggi.
            </p>

            <h2 className="pt-6 text-xl font-semibold text-foreground">
              Mengapa LPrecast?
            </h2>
            <p>
              Kami memastikan setiap proyek dikerjakan oleh mitra yang telah
              melalui proses seleksi ketat dan verifikasi lapangan oleh tim
              profesional Leora. Dengan sistem yang transparan dan efisien,
              proyek konstruksi Anda akan berjalan lancar dari awal hingga
              akhir.
            </p>

            <h2 className="pt-6 text-xl font-semibold text-foreground">
              Layanan Kami
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Koneksi dengan mitra konstruksi terverifikasi</li>
              <li>Monitoring progres proyek real-time</li>
              <li>Sistem pembayaran yang aman dan transparan</li>
              <li>Quality assurance dan evaluasi performa</li>
            </ul>

            <h2 className="pt-6 text-xl font-semibold text-foreground">
              Hubungi Kami
            </h2>
            <p>
              Website: precast.leora.co.id
              <br />
              Email: info@leora.co.id
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 md:py-12">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LPrecast. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">precast.leora.co.id</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
