import { CheckCircle2, FileText } from "lucide-react"

export const metadata = {
  title: "Pendaftaran Berhasil | LPrecast",
  description: "Pendaftaran vendor berhasil, sedang dalam proses review",
}
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Pendaftaran Berhasil!
        </h1>
        <p className="mb-6 text-gray-600">
          Terima kasih telah mendaftar sebagai vendor. Data Anda sedang dalam
          proses review oleh tim kami. Kami akan menghubungi Anda melalui email
          atau WhatsApp dalam 1-3 hari kerja.
        </p>

        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
          <h3 className="mb-2 font-semibold text-gray-700">
            Langkah selanjutnya:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Periksa email untuk link verifikasi akun
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Siapkan dokumen asli untuk verifikasi (jika diperlukan)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Tunggu konfirmasi dari tim kami
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/vendor/register/review">
              <FileText className="mr-2 h-4 w-4" />
              Lihat Data Submitted
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/vendor/login">Menuju Halaman Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
