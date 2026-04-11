import { CheckCircle2, Mail, Shield, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Pendaftaran Berhasil | LPrecast",
  description: "Pendaftaran vendor berhasil, sedang dalam proses review",
}

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Pendaftaran Berhasil!
        </h1>
        <p className="mb-6 text-gray-600">
          Terima kasih telah mendaftar sebagai vendor di LPrecast. Akun Anda
          telah dibuat dan sedang menunggu verifikasi dari tim kami.
        </p>

        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-left">
            <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Cek Email Anda</p>
              <p className="text-sm text-gray-600">
                Kami telah mengirim link aktivasi ke email yang Anda daftarkan.
                Silakan cek inbox dan klik link tersebut untuk mengaktifkan akun
                Anda.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-left">
            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">
                Status: Pending Review
              </p>
              <p className="text-sm text-gray-600">
                Setelah mengaktifkan akun, tim kami akan mereview data Anda
                dalam 1-2 hari kerja. Anda akan mendapat notifikasi setelah
                status approved.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-left">
            <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Akun Aman</p>
              <p className="text-sm text-gray-600">
                Password default akan dikirim via email. Anda dapat mengubah
                password setelah login.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
          <h3 className="mb-3 font-semibold text-gray-700">
            Apa yang perlu Anda lakukan selanjutnya?
          </h3>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                1
              </span>
              <span>Cek email dan klik link aktivasi akun</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                2
              </span>
              <span>Setel password baru untuk akun Anda</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                3
              </span>
              <span>Tunggu approval dari tim admin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                4
              </span>
              <span>Setelah approved, login dan mulai gunakan portal</span>
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full bg-[#16a34a] hover:bg-[#15803d]">
            <Link href="/login">Menuju Halaman Login</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/vendor/register">Daftar Vendor Lain</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Tidak menerima email? Periksa folder spam atau hubungi tim kami di{" "}
          <a
            href="mailto:support@lprecast.com"
            className="text-blue-600 hover:underline"
          >
            support@lprecast.com
          </a>
        </p>
      </div>
    </div>
  )
}
