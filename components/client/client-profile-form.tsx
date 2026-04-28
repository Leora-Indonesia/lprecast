"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import type { ClientAccountSummary, ClientProfileView } from "@/lib/client/types"
import { supabase } from "@/lib/supabase/client"
import {
  clientProfileSchema,
  type ClientProfileInput,
} from "@/lib/validations/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Option = {
  id: string
  name: string
}

export function ClientProfileForm({
  account,
  initialProfile,
  provinces,
}: {
  account: ClientAccountSummary
  initialProfile: ClientProfileView | null
  provinces: Option[]
}) {
  const router = useRouter()
  const [cities, setCities] = useState<Option[]>([])

  const form = useForm<ClientProfileInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(clientProfileSchema) as any,
    defaultValues: {
      client_type: (initialProfile?.client_type as ClientProfileInput["client_type"]) || "perusahaan",
      company_name_legal:
        initialProfile?.company_name_legal || account.nama_perusahaan || "",
      pic_name: initialProfile?.pic_name || account.nama,
      pic_position: initialProfile?.pic_position || "",
      office_address: initialProfile?.office_address || "",
      province_id: initialProfile?.province_id || "",
      city_id: initialProfile?.city_id || "",
    },
    mode: "onTouched",
  })

  const provinceId = useWatch({
    control: form.control,
    name: "province_id",
  })

  useEffect(() => {
    async function loadCities() {
      if (!provinceId) {
        setCities([])
        return
      }

      const { data, error } = await supabase
        .from("master_cities")
        .select("id, name")
        .eq("province_id", provinceId)
        .order("name")

      if (error) {
        console.error("Failed to load cities:", error)
        setCities([])
        return
      }

      setCities(data ?? [])
    }

    void loadCities()
  }, [provinceId])

  async function onSubmit(values: ClientProfileInput) {
    const response = await fetch("/client/profile/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; error?: string }
      | null

    if (!response.ok || !payload?.success) {
      toast.error("Profil client gagal disimpan", {
        description: payload?.error || "Terjadi kesalahan saat menyimpan profil client",
      })
      return
    }

    toast.success("Profil client berhasil disimpan")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identitas Akun</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Nama / PIC</p>
            <p className="font-medium">{account.nama}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Perusahaan</p>
            <p className="font-medium">{account.nama_perusahaan || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{account.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">No. WhatsApp</p>
            <p className="font-medium">{account.no_hp || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="client_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Client</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm"
                        >
                          <option value="individu">Individu</option>
                          <option value="developer">Developer</option>
                          <option value="kontraktor">Kontraktor</option>
                          <option value="perusahaan">Perusahaan</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_name_legal"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Nama Legal Perusahaan</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} />
                      </FormControl>
                      <FormDescription>Boleh kosong untuk client individu.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pic_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Nama PIC</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pic_position"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Jabatan PIC</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: Project Owner" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="office_address"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Alamat Kantor</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="min-h-28"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="province_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm"
                        >
                          <option value="">Pilih provinsi</option>
                          {provinces.map((province) => (
                            <option key={province.id} value={province.id}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota / Kabupaten</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm"
                        >
                          <option value="">Pilih kota / kabupaten</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/client/dashboard">Kembali</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              Simpan Profil
            </Button>
          </div>
        </Form>
      </FormProvider>
    </div>
  )
}
