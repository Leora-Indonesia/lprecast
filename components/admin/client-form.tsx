"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { adminClientProfileSchema, type AdminClientProfileInput } from "@/lib/validations/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { clientTypeOptions } from "@/lib/validations/client"

type ClientType = "individu" | "developer" | "kontraktor" | "perusahaan"

interface ProvinceOption {
  id: string
  name: string
}

interface CityOption {
  id: string
  name: string
  province_id: string
}

interface ClientFormProps {
  defaultValues?: {
    client_name?: string
    email?: string
    phone?: string
    client_type?: ClientType
    company_name_legal?: string | null
    pic_name?: string
    pic_position?: string | null
    office_address?: string
    province_id?: string
    city_id?: string
    notes?: string | null
    verification_status?: string
    verification_notes?: string | null
  }
  clientId?: string
  provinces: ProvinceOption[]
  cities: CityOption[]
  isDetail?: boolean
}

export function ClientForm({
  defaultValues,
  clientId,
  provinces,
  cities,
  isDetail = false,
}: ClientFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedProvinceId, setSelectedProvinceId] = useState(defaultValues?.province_id ?? "")

  const filteredCities = cities.filter((c) => c.province_id === selectedProvinceId)

  const form = useForm({
    resolver: zodResolver(adminClientProfileSchema),
    defaultValues: {
      client_name: defaultValues?.client_name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      client_type: defaultValues?.client_type ?? undefined,
      company_name_legal: defaultValues?.company_name_legal ?? "",
      pic_name: defaultValues?.pic_name ?? "",
      pic_position: defaultValues?.pic_position ?? "",
      office_address: defaultValues?.office_address ?? "",
      province_id: defaultValues?.province_id ?? "",
      city_id: defaultValues?.city_id ?? "",
      notes: defaultValues?.notes ?? "",
      verification_status: defaultValues?.verification_status ?? "",
      verification_notes: defaultValues?.verification_notes ?? "",
    },
  })

  const onSubmit = async (data: AdminClientProfileInput) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("client_name", data.client_name)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("client_type", data.client_type as string)
      formData.append("company_name_legal", data.company_name_legal || "")
      formData.append("pic_name", data.pic_name)
      formData.append("pic_position", data.pic_position || "")
      formData.append("office_address", data.office_address)
      formData.append("province_id", data.province_id)
      formData.append("city_id", data.city_id)
      formData.append("notes", data.notes || "")
      if (isDetail) {
        formData.append("verification_status", data.verification_status || "")
        formData.append("verification_notes", data.verification_notes || "")
      }

      const endpoint = clientId
        ? `/api/admin/clients/${clientId}`
        : "/api/admin/clients"

      const method = clientId ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        body: formData,
      })

      if (!res.ok) {
        const result = await res.json()
        form.setError("root", { message: result.error || "Terjadi kesalahan" })
        return
      }

      router.push("/admin/clients")
      router.refresh()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Client *</FormLabel>
                <FormControl>
                  <Input placeholder="Nama client / perusahaan" {...field} />
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
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@client.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. WhatsApp *</FormLabel>
                <FormControl>
                  <Input placeholder="0812xxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Client *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_name_legal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama PT (Legal)</FormLabel>
                <FormControl>
                  <Input placeholder="PT. Contoh Indonesia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pic_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama PIC *</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap PIC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pic_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posisi PIC</FormLabel>
                <FormControl>
                  <Input placeholder="Manager Proyek" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="office_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Kantor *</FormLabel>
              <FormControl>
                <Textarea placeholder="Alamat lengkap kantor" {...field} />
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
                <FormLabel>Provinsi *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedProvinceId(value)
                    form.setValue("city_id", "")
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih provinsi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((prov) => (
                      <SelectItem key={prov.id} value={prov.id}>
                        {prov.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kota / Kabupaten *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedProvinceId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan Internal</FormLabel>
              <FormControl>
                <Textarea placeholder="Catatan untuk internal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isDetail && (
          <div className="grid gap-4 md:grid-cols-2 rounded-lg border p-4">
            <FormField
              control={form.control}
              name="verification_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Verifikasi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verification_notes"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Catatan Verifikasi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Catatan verifikasi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {form.formState.errors.root && (
          <div className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : clientId ? "Update Client" : "Simpan Client"}
          </Button>
        </div>
      </form>
    </Form>
  )
}