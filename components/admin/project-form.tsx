"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileImage, Loader2, MapPinned, Paperclip, Save } from "lucide-react"
import { toast } from "sonner"

import { createProjectAction, updateProjectAction } from "@/app/(admin)/admin/projects/actions"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { projectCreateSchema, type ProjectCreateInput } from "@/lib/validations/project"

const defaultValues: ProjectCreateInput = {
  name: "",
  location: "",
  start_date: "",
  end_date: "",
  customer_name: "",
  contract_value: "",
  description: "",
  client_profile_id: "",
  site_address_full: "",
  province_id: "",
  city_id: "",
  site_coordinates: "",
  job_type: "",
  estimated_length_or_area: "",
  measurement_unit: "",
  estimated_height: "",
  target_completion_date: "",
  budget_min: "",
  budget_max: "",
  initial_description: "",
  site_condition: "",
  vehicle_access: "",
  foundation_preference: "",
  special_requirements: "",
  qualification_status: "",
  qualification_notes: "",
  internal_notes: "",
}

type ClientProfileOption = {
  id: string
  client_name: string | null
  company_name_legal: string | null
  email: string | null
  phone: string | null
}

type ProvinceOption = { id: string; name: string }
type CityOption = { id: string; name: string; province_id: string | null }

type ProjectFormProps = {
  mode?: "create" | "edit"
  projectId?: string
  initialValues?: Partial<ProjectCreateInput>
  clientOptions?: ClientProfileOption[]
  provinceOptions?: ProvinceOption[]
  cityOptions?: CityOption[]
}

const measurementUnits = ["m", "m2", "m3", "unit", "set"]
const qualificationStatuses = [
  { value: "", label: "Belum ditetapkan" },
  { value: "need_review", label: "Need review" },
  { value: "approved", label: "Approved" },
  { value: "conditional", label: "Conditional" },
  { value: "rejected", label: "Rejected" },
]

const roleGroups = {
  client: ["Lokasi Proyek", "Scope & Kebutuhan", "Preferensi Waktu & Budget"],
  admin: ["Identitas Project", "Timeline & Commercial", "Internal Review"],
  spv: ["Kondisi Lokasi", "Planning & Readiness"],
} as const

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getClientLabel(client: ClientProfileOption) {
  return client.client_name || client.company_name_legal || client.email || client.id
}

export function ProjectForm({
  mode = "create",
  projectId,
  initialValues,
  clientOptions = [],
  provinceOptions = [],
  cityOptions = [],
}: ProjectFormProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [activeAudience, setActiveAudience] = useState<"client" | "admin" | "spv">("client")
  const isEditMode = mode === "edit"

  const form = useForm<ProjectCreateInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectCreateSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
    mode: "onTouched",
  })

  const customerName = useWatch({ control: form.control, name: "customer_name" })
  const clientProfileId = useWatch({ control: form.control, name: "client_profile_id" })
  const provinceId = useWatch({ control: form.control, name: "province_id" })
  const cityId = useWatch({ control: form.control, name: "city_id" })

  const filteredCities = useMemo(
    () => cityOptions.filter((city) => !provinceId || city.province_id === provinceId),
    [cityOptions, provinceId]
  )

  useEffect(() => {
    if (!cityId) return
    const isValid = filteredCities.some((city) => city.id === cityId)
    if (!isValid) {
      form.setValue("city_id", "", { shouldDirty: true, shouldValidate: true })
    }
  }, [cityId, filteredCities, form])

  async function onSubmit(values: ProjectCreateInput) {
    setSubmitError(null)

    const formData = new FormData()
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value ?? "")
    }

    if (!isEditMode) {
      for (const file of files) formData.append("attachments", file)
    }

    try {
      const result: { success: boolean; error?: string; projectId?: string; warning?: string } =
        isEditMode && projectId ? await updateProjectAction(projectId, formData) : await createProjectAction(formData)

      if (!result.success) {
        const message = result.error || `Gagal ${isEditMode ? "memperbarui" : "menyimpan"} project`
        setSubmitError(message)
        toast.error(`Project gagal ${isEditMode ? "diperbarui" : "dibuat"}`, { description: message })
        return
      }

      if (result.warning) {
        toast.warning("Project draft dibuat dengan catatan", { description: result.warning })
      } else {
        toast.success(`Project berhasil ${isEditMode ? "diperbarui" : "dibuat"}`)
      }

      const nextProjectId = projectId ?? result.projectId
      router.push(nextProjectId ? `/admin/projects/${nextProjectId}` : "/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Project request failed:", error)
      const message = `Terjadi kesalahan saat ${isEditMode ? "memperbarui" : "menyimpan"} project`
      setSubmitError(message)
      toast.error(`Project gagal ${isEditMode ? "diperbarui" : "dibuat"}`, { description: message })
    }
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Toggle Area User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant={activeAudience === "client" ? "default" : "outline"} onClick={() => setActiveAudience("client")}>Client</Button>
                  <Button type="button" variant={activeAudience === "admin" ? "default" : "outline"} onClick={() => setActiveAudience("admin")}>Admin / Internal</Button>
                  <Button type="button" variant={activeAudience === "spv" ? "default" : "outline"} onClick={() => setActiveAudience("spv")}>SPV</Button>
                </div>
                <p className="text-sm text-muted-foreground">Toggle ini bantu grouping field per role. Data tetap masuk ke satu container project.</p>
              </CardContent>
            </Card>

            {activeAudience === "admin" ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Identitas Project</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {submitError ? (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{submitError}</div>
                    ) : null}

                    <FormField control={form.control} name="name" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Nama Project</FormLabel>
                        <FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: Pagar Panel Beton Gudang Cikarang" /></FormControl>
                        <FormDescription>Judul utama project yang nanti tampil di overview dan tender.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="location" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Ringkasan Lokasi Publik</FormLabel>
                        <FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: Cikarang, Bekasi" /></FormControl>
                        <FormDescription>Ringkasan lokasi non-sensitif untuk list internal dan future vendor-facing summary.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField control={form.control} name="client_profile_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Klien Tertaut</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Pilih klien dari database" /></SelectTrigger></FormControl>
                            <SelectContent>{clientOptions.map((client) => <SelectItem key={client.id} value={client.id}>{getClientLabel(client)}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormDescription>Opsional. Tautkan ke profil client bila project berangkat dari relasi client existing.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="customer_name" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Nama Customer</FormLabel>
                          <FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: PT Industri Beton Nusantara" /></FormControl>
                          <FormDescription>Tetap wajib. Bisa isi manual walau client profile belum tertaut.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="description" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Umum Project</FormLabel>
                        <FormControl><Textarea {...field} aria-invalid={fieldState.invalid} className="min-h-28" placeholder="Ringkas tujuan project, konteks pekerjaan, dan scope level tinggi." /></FormControl>
                        <FormDescription>Ini tetap jadi ringkasan utama pada detail project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Timeline & Commercial</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField control={form.control} name="start_date" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Tanggal Mulai</FormLabel><FormControl><Input {...field} type="date" aria-invalid={fieldState.invalid} /></FormControl><FormDescription>Opsional bila jadwal belum final.</FormDescription><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="end_date" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Tanggal Selesai</FormLabel><FormControl><Input {...field} type="date" aria-invalid={fieldState.invalid} /></FormControl><FormDescription>Harus sama atau setelah tanggal mulai.</FormDescription><FormMessage /></FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="contract_value" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Nilai Kontrak Draft</FormLabel>
                        <FormControl><Input {...field} inputMode="numeric" aria-invalid={fieldState.invalid} placeholder="Contoh: 250000000" /></FormControl>
                        <FormDescription>Isi angka penuh tanpa titik atau koma.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Internal Review</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <FormField control={form.control} name="qualification_status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Review Internal</FormLabel>
                        <FormControl>
                          <select {...field} className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm">
                            {qualificationStatuses.map((status) => <option key={status.label} value={status.value}>{status.label}</option>)}
                          </select>
                        </FormControl>
                        <FormDescription>Area ini milik admin/internal. Belum masuk lane SPV atau payment.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="qualification_notes" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Catatan Review Internal</FormLabel><FormControl><Textarea {...field} aria-invalid={fieldState.invalid} className="min-h-24" placeholder="Catatan survey awal, kelayakan, atau requirement sebelum tender." /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="internal_notes" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Internal Notes</FormLabel><FormControl><Textarea {...field} aria-invalid={fieldState.invalid} className="min-h-24" placeholder="Catatan sensitif internal yang tidak turun ke vendor-facing scope." /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>

                {isEditMode ? (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> Lampiran Admin / Internal</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p>Kelola lampiran project dari halaman detail agar daftar file tetap terpusat.</p>
                      <Button type="button" variant="outline" asChild><Link href={projectId ? `/admin/projects/${projectId}` : "/admin/projects"}>Buka Detail Project</Link></Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> Lampiran Admin / Internal</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="project-attachments-admin" className="text-sm font-medium">Attachment / Foto / Drawing (bisa multiple)</label>
                        <Input id="project-attachments-admin" type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
                        <p className="text-xs text-muted-foreground">Lampiran project bisa pilih banyak file sekaligus.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : null}

            {activeAudience === "client" ? (
              <>
                <Card>
                  <CardHeader><CardTitle>Lokasi Proyek</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    {submitError ? (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{submitError}</div>
                    ) : null}
                    <FormField control={form.control} name="site_address_full" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Alamat Lengkap Proyek</FormLabel><FormControl><Textarea {...field} aria-invalid={fieldState.invalid} className="min-h-28" placeholder="Alamat lengkap lokasi project, patokan akses, atau catatan lokasi internal." /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField control={form.control} name="province_id" render={({ field }) => (
                        <FormItem><FormLabel>Provinsi</FormLabel><FormControl><select {...field} className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm"><option value="">Pilih provinsi</option>{provinceOptions.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}</select></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="city_id" render={({ field }) => (
                        <FormItem><FormLabel>Kota / Kabupaten</FormLabel><FormControl><select {...field} className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm"><option value="">Pilih kota / kabupaten</option>{filteredCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="site_coordinates" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Koordinat Lokasi</FormLabel><FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: -6.3012, 107.1724" /></FormControl><FormDescription>Opsional. Berguna untuk survey, SPV, dan validasi lokasi.</FormDescription><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Scope & Kebutuhan</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField control={form.control} name="job_type" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Jenis Pekerjaan</FormLabel><FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: Pagar panel beton" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="estimated_height" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Estimasi Tinggi</FormLabel><FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: 2.4 meter" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                      <FormField control={form.control} name="estimated_length_or_area" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Estimasi Volume</FormLabel><FormControl><Input {...field} inputMode="decimal" aria-invalid={fieldState.invalid} placeholder="Contoh: 250" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="measurement_unit" render={({ field }) => (
                        <FormItem><FormLabel>Satuan</FormLabel><FormControl><select {...field} className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm"><option value="">Pilih satuan</option>{measurementUnits.map((unit) => <option key={unit} value={unit}>{unit}</option>)}</select></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="initial_description" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Deskripsi Kebutuhan Awal</FormLabel><FormControl><Textarea {...field} aria-invalid={fieldState.invalid} className="min-h-32" placeholder="Tuliskan kebutuhan utama client, konteks lapangan, atau scope teknis awal." /></FormControl><FormDescription>Area ini nanti bisa dipetakan ke tab Client Intake tanpa mengganggu overview project.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="special_requirements" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Kebutuhan Khusus</FormLabel><FormControl><Textarea {...field} aria-invalid={fieldState.invalid} className="min-h-24" placeholder="Contoh: akses terbatas malam hari, area aktif operasional, kebutuhan white-label, dll." /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Preferensi Waktu & Budget</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <FormField control={form.control} name="target_completion_date" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Target Tanggal Selesai yang Diharapkan</FormLabel><FormControl><Input {...field} type="date" aria-invalid={fieldState.invalid} /></FormControl><FormDescription>Ini input kebutuhan client, bukan tanggal final project.</FormDescription><FormMessage /></FormItem>
                    )} />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField control={form.control} name="budget_min" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Budget Minimum</FormLabel><FormControl><Input {...field} inputMode="numeric" aria-invalid={fieldState.invalid} placeholder="Contoh: 200000000" /></FormControl><FormDescription>Isi angka penuh dalam IDR.</FormDescription><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="budget_max" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Budget Maksimum</FormLabel><FormControl><Input {...field} inputMode="numeric" aria-invalid={fieldState.invalid} placeholder="Contoh: 300000000" /></FormControl><FormDescription>Isi angka penuh dalam IDR.</FormDescription><FormMessage /></FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="foundation_preference" render={({ field, fieldState }) => (
                      <FormItem><FormLabel>Preferensi Pondasi Awal</FormLabel><FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: mini pile / footplat / belum ditentukan" /></FormControl><FormDescription>Boleh diisi dari kebutuhan awal client. SPV akan validasi lagi saat pre-con.</FormDescription><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>

                {isEditMode ? (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> Lampiran Client</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p>Dokumen kebutuhan awal, foto lokasi, dan gambar kerja mengikuti lampiran project yang sama.</p>
                      <Button type="button" variant="outline" asChild><Link href={projectId ? `/admin/projects/${projectId}` : "/admin/projects"}>Buka Detail Project</Link></Button>
                    </CardContent>
                  </Card>
                ) : null}
              </>
            ) : null}

            {activeAudience === "spv" ? (
              <>
                <Card>
                  <CardHeader><CardTitle>Kondisi Lokasi</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    {submitError ? (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{submitError}</div>
                    ) : null}
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField control={form.control} name="site_condition" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Kondisi Lokasi</FormLabel><FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: tanah rata, existing pagar dibongkar" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="vehicle_access" render={({ field, fieldState }) => (
                        <FormItem><FormLabel>Akses Kendaraan / Alat</FormLabel><FormControl><Input {...field} aria-invalid={fieldState.invalid} placeholder="Contoh: truk engkel aman, crane terbatas" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Planning & Readiness</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="rounded-lg border bg-muted/20 p-4">
                      Area SPV dipisah dulu sebagai toggle. Nanti isi utama: Kurva S baseline, master schedule, procurement plan, RK3K, risk register, dan readiness check sebelum execution.
                    </div>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Project ini belum memasukkan modul payment.</li>
                      <li>SPV hanya operasional dan verifikasi progres, bukan finansial.</li>
                      <li>Data kondisi lokasi ditaruh di sini karena paling dekat ke pre-con readiness.</li>
                    </ul>
                  </CardContent>
                </Card>

                {isEditMode ? (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> Lampiran SPV</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p>SPV nanti memakai lampiran project yang sama untuk referensi pre-con dan readiness.</p>
                      <Button type="button" variant="outline" asChild><Link href={projectId ? `/admin/projects/${projectId}` : "/admin/projects"}>Buka Detail Project</Link></Button>
                    </CardContent>
                  </Card>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Kategori per User</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Client</p>
                  <p className="text-muted-foreground">{roleGroups.client.join(" · ")}</p>
                </div>
                <div>
                  <p className="font-medium">Admin / Internal</p>
                  <p className="text-muted-foreground">{roleGroups.admin.join(" · ")}</p>
                </div>
                <div>
                  <p className="font-medium">SPV</p>
                  <p className="text-muted-foreground">{roleGroups.spv.join(" · ")}</p>
                </div>
              </CardContent>
            </Card>

            {!isEditMode ? (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> Lampiran Pendukung</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="project-attachments" className="text-sm font-medium">Preview lampiran terpilih</label>
                    <Input id="project-attachments" type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
                    <p className="text-xs text-muted-foreground">Upload opsional. Bisa pilih banyak file sekaligus. Kalau upload gagal, draft project tetap dibuat dan sistem akan beri peringatan.</p>
                  </div>
                  {files.length > 0 ? (
                    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
                      {files.map((file) => (
                        <div key={`${file.name}-${file.size}`} className="flex items-start justify-between gap-3 text-sm">
                          <div className="flex min-w-0 items-start gap-2">
                            <FileImage className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.type || "Tipe file tidak terdeteksi"}</p>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">Belum ada lampiran dipilih.</div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader><CardTitle>{isEditMode ? "Ringkasan Edit" : "Ringkasan Create"}</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Status awal</span><Badge variant="secondary">{isEditMode ? "Ikuti status aktif" : "Draft"}</Badge></div>
                <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Relasi client</span><span>{clientProfileId ? clientOptions.find((c) => c.id === clientProfileId)?.client_name || clientOptions.find((c) => c.id === clientProfileId)?.company_name_legal || "Terpilih" : customerName ? "Manual" : "Belum ditautkan"}</span></div>
                <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Mode grouping</span><span>Toggle per user</span></div>
                <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Lane payment</span><span>Belum masuk create form</span></div>
                <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">SPV pre-con</span><span>Disiapkan nanti</span></div>
                <Separator />
                <div className="space-y-3 text-muted-foreground">
                  <p>Form admin ini sengaja dibuat lebih penuh agar nanti mudah dipecah ke toggle/tab role-based tanpa rewrite besar.</p>
                  <div className="flex items-start gap-2 rounded-lg border bg-muted/20 px-3 py-3">
                    <MapPinned className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>Untuk vendor-facing scope, gunakan hanya ringkasan lokasi dan scope aman. Data sensitif tetap tinggal di detail internal.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" variant="outline" asChild><Link href={projectId ? `/admin/projects/${projectId}` : "/admin/projects"}>Batal</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            {isEditMode ? "Simpan Perubahan" : "Simpan Project"}
          </Button>
        </div>
      </Form>
    </FormProvider>
  )
}
