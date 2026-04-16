import { CheckCircle2, Mail, ArrowRight, Clock, Shield } from "lucide-react"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pendaftaran Berhasil | LPrecast",
  description: "Pendaftaran vendor berhasil. Cek email untuk aktivasi akun.",
}

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-card-foreground">
          Pendaftaran Berhasil!
        </h1>
        <p className="mb-6 text-muted-foreground">
          Terima kasih telah mendaftar sebagai vendor di LPrecast.
        </p>

        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-left">
            <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-medium text-foreground">Cek Email Anda</p>
              <p className="text-sm text-muted-foreground">
                Kami telah mengirim link konfirmasi ke email yang Anda
                daftarkan. Silakan cek inbox (atau folder spam) dan klik link
                tersebut untuk melanjutkan.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-muted/50 p-4 text-left">
          <h3 className="mb-3 font-semibold text-foreground">
            Langkah Selanjutnya:
          </h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                1
              </span>
              <span>Cek email dan klik link konfirmasi dari LPrecast</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                2
              </span>
              <span>
                Anda akan otomatis masuk dan melihat halaman verifikasi berhasil
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                3
              </span>
              <div className="flex items-center gap-2">
                <span>Isi formulir data perusahaan di halaman onboarding</span>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                4
              </span>
              <div className="flex items-center gap-2">
                <span>Submit data dan tunggu review dari admin</span>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                5
              </span>
              <span>
                Setelah disetujui, Anda bisa mengakses semua fitur vendor
              </span>
            </li>
          </ol>
        </div>

        <Button asChild className="w-full">
          <Link href="/login">
            Menuju Halaman Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <p className="mt-6 text-xs text-muted-foreground">
          Tidak menerima email? Periksa folder spam atau hubungi tim kami di{" "}
          <a
            href="mailto:support@precast.leora.co.id"
            className="text-primary hover:underline"
          >
            support@precast.leora.co.id
          </a>
        </p>
      </div>
    </div>
  )
}
