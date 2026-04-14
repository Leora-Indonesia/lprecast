"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { createClient } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { resendMagicLink } from "./actions"

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

type PasswordForm = z.infer<typeof passwordSchema>

type PageState = "loading" | "form" | "submitting" | "success" | "error"

export default function SetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [pageState, setPageState] = useState<PageState>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [tokenHash, setTokenHash] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  })

  useEffect(() => {
    const token = searchParams.get("token_hash")
    const emailParam = searchParams.get("email")
    const type = searchParams.get("type")

    const newEmail = emailParam || null
    const newTokenHash = token || null
    const newPageState: PageState =
      !token || !emailParam ? "error" : type !== "magiclink" ? "error" : "form"
    const newErrorMessage =
      !token || !emailParam
        ? "Link tidak valid. Parameter tidak lengkap."
        : type !== "magiclink"
          ? "Link tidak valid. Jenis link tidak sesuai."
          : null

    queueMicrotask(() => {
      setEmail(newEmail)
      setTokenHash(newTokenHash)
      setPageState(newPageState)
      setErrorMessage(newErrorMessage)
    })
  }, [searchParams])

  async function onSubmit(values: PasswordForm) {
    if (!email) {
      setErrorMessage("Link tidak valid. Silakan minta link baru.")
      setPageState("error")
      return
    }

    setPageState("submitting")

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      )

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token_hash: tokenHash!,
        type: "magiclink",
      })

      if (verifyError) {
        console.error("Error verifying token:", verifyError)
        setErrorMessage(
          "Link tidak valid atau sudah kadaluarsa. Silakan minta link baru."
        )
        setPageState("error")
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (updateError) {
        console.error("Error setting password:", updateError)
        toast.error("Gagal mengatur password. Silakan coba lagi.")
        setPageState("form")
        return
      }

      setPageState("success")
      toast.success("Password berhasil diset!")
      setTimeout(() => {
        router.push("/login?setup=success")
      }, 2000)
    } catch (error) {
      console.error("Error in onSubmit:", error)
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
      setPageState("form")
    }
  }

  async function handleResend() {
    if (!email) return

    setIsResending(true)
    const result = await resendMagicLink(email)

    if (result.success) {
      toast.success("Link baru telah dikirim ke email Anda")
      setPageState("form")
    } else {
      toast.error(result.error || "Gagal mengirim ulang link")
      setPageState("error")
    }
    setIsResending(false)
  }

  if (pageState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Link Tidak Valid</CardTitle>
            <CardDescription>
              {errorMessage ||
                "Link aktivasi tidak valid atau sudah kadaluarsa."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleResend}
              className="w-full bg-[#16a34a] hover:bg-[#15803d]"
              disabled={!email || isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Kirim Ulang Link Aktivasi
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/vendor/register")}
              className="w-full"
            >
              Kembali ke Halaman Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pageState === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Password Berhasil Diset!</CardTitle>
            <CardDescription>
              Akun vendor Anda telah aktif. Mengalihkan ke halaman login...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-green-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Setel Password</CardTitle>
          <CardDescription>
            Buat password untuk akun vendor Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Minimal 8 karakter dengan angka"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan password yang sama"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-xs text-muted-foreground">
              Password harus minimal 8 karakter dan mengandung minimal 1 angka.
            </div>
            <Button
              type="submit"
              className="w-full bg-[#16a34a] hover:bg-[#15803d]"
              disabled={pageState === "submitting"}
            >
              {pageState === "submitting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
