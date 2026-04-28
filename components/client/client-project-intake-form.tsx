"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import type { ClientAccountSummary, ClientProfileView } from "@/lib/client/types"
import { supabase } from "@/lib/supabase/client"
import {
  clientProjectIntakeSchema,
  type ClientProjectIntakeInput,
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

const defaultValues: ClientProjectIntakeInput = {
  project_title: "",
  site_address_full: "",
  province_id: "",
  city_id: "",
  site_coordinates: "",
  job_type: "Pagar beton",
  estimated_length_or_area: "",
  measurement_unit: "m",
  target_completion_date: "",
  budget_min: "",
  budget_max: "",
  initial_description: "",
  site_condition: "",
  vehicle_access: "",
  special_requirements: "",
  estimated_height: "",
  foundation_preference: "",
}

export function ClientProjectIntakeForm({
  account,
  profile,
  provinces,
}: {
  account: ClientAccountSummary
  profile: ClientProfileView | null
  provinces: Option[]
}) {
  const router = useRouter()
  const [cities, setCities] = useState<Option[]>([])
  const form = useForm<ClientProjectIntakeInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(clientProjectIntakeSchema) as any,
    defaultValues,
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

  async function onSubmit(values: ClientProjectIntakeInput) {
    const response = await fetch("/client/projects/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; error?: string; projectId?: string }
      | null

    if (!response.ok || !payload?.success) {
      toast.error("Project client gagal disimpan", {
        description: payload?.error || "Terjadi kesalahan saat menyimpan project",
      })
      return
    }

    toast.success("Project berhasil diajukan")
    router.push(payload.projectId ? `/client/projects/${payload.projectId}` : "/client/projects")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Client</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Nama / PIC</p>
            <p className="font-medium">{account.nama}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Perusahaan</p>
            <p className="font-medium">{profile?.company_name_legal || account.nama_perusahaan || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{account.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">WhatsApp</p>
            <p className="font-medium">{account.no_hp || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kebutuhan Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="project_title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Judul Project</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Contoh: Kebutuhan pagar perimeter gudang Cikarang"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_address_full"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap Proyek</FormLabel>
                    <FormControl>
                      <Textarea {...field} aria-invalid={fieldState.invalid} className="min-h-28" />
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
                      <FormLabel>Provinsi Proyek</FormLabel>
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
                      <FormLabel>Kota / Kabupaten Proyek</FormLabel>
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="job_type"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Jenis Pekerjaan</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="site_coordinates"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Koordinat Lokasi</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Opsional: -6.2, 106.8" />
                      </FormControl>
                      <FormDescription>Boleh dikosongkan jika belum ada pin lokasi.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="estimated_length_or_area"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Estimasi Panjang / Luas</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} inputMode="decimal" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="measurement_unit"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Satuan</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="m / m2 / unit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target_completion_date"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Target Tanggal Selesai</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" aria-invalid={fieldState.invalid} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budget_min"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Budget Minimum</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} inputMode="numeric" placeholder="Opsional: 200000000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget_max"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Budget Maksimum</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} inputMode="numeric" placeholder="Opsional: 300000000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimated_height"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Estimasi Tinggi</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Opsional: 2.4 m" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="initial_description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Kebutuhan Awal</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="min-h-32"
                        placeholder="Jelaskan kebutuhan, konteks lokasi, target, dan hal penting lain yang perlu kami review."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="site_condition"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Kondisi Lokasi</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Tanah rata / miring / rawa" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle_access"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Akses Kendaraan / Alat</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Akses truk besar / terbatas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="foundation_preference"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Preferensi Pondasi</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Opsional: setapak / lajur" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="special_requirements"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Kebutuhan Khusus</FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Opsional: motif, schedule khusus, dll" />
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
              <Link href="/client/projects">Batal</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              Simpan Project
            </Button>
          </div>
        </Form>
      </FormProvider>
    </div>
  )
}
