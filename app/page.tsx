import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Fragment } from "react"
import { MagicLinkCallback } from "@/components/auth/magic-link-callback"

export const metadata = {
  title: "LPrecast - Platform Konstruksi Terpercaya",
  description:
    "Platform konstruksi yang menghubungkan proyek Anda dengan mitra terbaik. Transparan, efisien, dan terjamin kualitasnya.",
}
import {
  Shield,
  Activity,
  DollarSign,
  FileCheck,
  Target,
  Zap,
  ArrowRight,
  Menu,
} from "lucide-react"

export default function Page() {
  return (
    <Fragment>
      <MagicLinkCallback />
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-lg font-bold">LPrecast</span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="#features"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Fitur
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cara Kerja
              </Link>
              <Link
                href="#cta"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Kontak
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Tentang Kami
              </Link>
              <Link
                href="/vendor/register"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Jadi Vendor
              </Link>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </nav>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        <section className="bg-primary/5 py-20 md:py-28 lg:py-32">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                Platform Konstruksi Terpercaya untuk Proyek Anda
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Hubungkan proyek konstruksi Anda dengan mitra terbaik.
                Transparan, efisien, dan terjamin kualitasnya.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/login">
                    Mulai Proyek
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                Mengapa Pilih LPrecast?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Solusi menyeluruh untuk proyek konstruksi Anda
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Shield className="mb-4 h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Mitra Terpercaya
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Semua mitra melalui proses seleksi ketat dan verifikasi
                  lapangan oleh tim profesional Leora.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Activity className="mb-4 h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Monitoring Real-time
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pantau progres proyek harian dengan laporan terverifikasi
                  langsung dari lapangan.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <DollarSign className="mb-4 h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Pembayaran Aman
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sistem approval bertingkat memastikan dana aman sebelum
                  pencairan ke mitra.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <FileCheck className="mb-4 h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Transparansi Total
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dokumen lengkap, SPK digital, dan trail audit yang jelas untuk
                  setiap proyek.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Target className="mb-4 h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Quality Assurance
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sistem evaluasi performa dan tracking otomatis untuk jaminan
                  kualitas proyek.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Zap className="mb-4 h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Proses Efisien
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dari tender hingga pembayaran dalam satu platform terintegrasi
                  tanpa ribet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="bg-muted/30 py-16 md:py-20 lg:py-24"
        >
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                Bagaimana Proyek Anda Dikerjakan
              </h2>
              <p className="mt-4 text-muted-foreground">
                Proses profesional dari awal hingga akhir
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-5">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Konsultasi Proyek
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Diskusikan kebutuhan dengan tim Leora
                </p>
              </div>
              <div className="hidden items-center justify-center md:flex">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Penawaran Mitra
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tim Leora carikan mitra terbaik
                </p>
              </div>
              <div className="hidden items-center justify-center md:flex">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Pilih Mitra
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Anda pilih berdasarkan ofert
                </p>
              </div>
              <div className="hidden items-center justify-center md:flex">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  4
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Monitor Progres
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Pantau via dashboard real-time
                </p>
              </div>
              <div className="hidden items-center justify-center md:flex">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  5
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Pembayaran
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Approval bertahap sesuai milestone
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="relative overflow-hidden py-16 md:py-20 lg:py-24"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
              alt="Construction background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary/80" />
          </div>

          <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">
                Siap Memulai Proyek Konstruksi Anda?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Konsultasikan kebutuhan proyek Anda dengan tim Leora sekarang.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/login">
                    Hubungi Kami
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Link href="/vendor/register">
                    Tertarik Jadi Vendor?
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t py-8 md:py-12">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} LPrecast. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <Link href="/terms/client" className="hover:text-foreground">
                  Syarat & Ketentuan
                </Link>
                <span>|</span>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </Fragment>
  )
}
