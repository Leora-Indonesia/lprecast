"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Building2, Loader2 } from "lucide-react"
import Link from "next/link"

import { signupAction } from "./actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const signupSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
    nama_perusahaan: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
    nama_pic: z.string().min(2, "Nama PIC minimal 2 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

type SignupForm = z.infer<typeof signupSchema>

export default function VendorRegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nama_perusahaan: "",
      nama_pic: "",
    },
  })

  async function onSubmit(values: SignupForm) {
    setIsLoading(true)

    try {
      const result = await signupAction(values)

      // If no result, redirect should have happened
      if (!result) {
        return
      }

      if ("error" in result && result.error) {
        if (result.error.includes("sudah terdaftar")) {
          toast.error("Email Sudah Terdaftar", {
            description:
              "Email ini sudah digunakan. Silakan masuk atau gunakan email lain.",
            action: {
              label: "Masuk",
              onClick: () => (window.location.href = "/login"),
            },
          })
        } else if (result.error.includes("Terlalu banyak percobaan")) {
          toast.error("Terlalu Banyak Percobaan", {
            description: result.error,
          })
        } else {
          toast.error("Gagal Mendaftar", {
            description: result.error,
          })
        }
        return
      }
    } catch (err) {
      const error = err as { message?: string; digest?: string }
      const isRedirect =
        error.message === "NEXT_REDIRECT" ||
        error.digest?.includes("NEXT_REDIRECT")

      if (!isRedirect) {
        console.error("Submit error:", err)
        toast.error("Terjadi Kesalahan", {
          description:
            "Tidak dapat memproses pendaftaran. Silakan coba beberapa saat lagi.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Daftar Vendor</CardTitle>
          <CardDescription>
            Bergabung dengan LPrecast Vendor Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_perusahaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan</FormLabel>
                  <FormControl>
                    <Input placeholder="PT Contoh Indonesia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nama_pic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama PIC</FormLabel>
                  <FormControl>
                    <Input placeholder="Budi Santoso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="budi@contoh.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Minimal 8 karakter"
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
                      placeholder="Ulangi password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </Form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Masuk
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
