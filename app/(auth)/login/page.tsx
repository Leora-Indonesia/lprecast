"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

import { loginAction } from "@/actions/auth"
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
  FormProvider,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginFormWithParams() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const setupSuccess = searchParams.get("setup") === "success"
    if (setupSuccess) {
      toast.success(
        "Password berhasil diset! Silakan login dengan kredensial Anda."
      )
    }
  }, [searchParams])

  return null
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginForm) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginAction(values.email, values.password)
      if (result && "error" in result && result.error) {
        setError(result.error)
      }
    } catch (err) {
      if ((err as Error).message !== "NEXT_REDIRECT") {
        setError("Terjadi kesalahan. Silakan coba lagi.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Suspense fallback={null}>
        <LoginFormWithParams />
      </Suspense>
      <div className="flex min-h-screen items-center justify-center bg-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Masuk ke LPrecast</CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="nama@email.com"
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="text-center text-sm text-red-600">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sedang masuk..." : "Masuk"}
                </Button>
              </form>
            </FormProvider>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/vendor/register"
                className="text-primary hover:underline"
              >
                Daftar sebagai Vendor
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
