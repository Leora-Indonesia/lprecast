"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileImage, Loader2, Paperclip, Save } from "lucide-react"
import { toast } from "sonner"

import {
  projectCreateSchema,
  type ProjectCreateInput,
} from "@/lib/validations/project"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const defaultValues: ProjectCreateInput = {
  name: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function ProjectForm() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ProjectCreateInput>({
    // Zod v4 + RHF v7 type mismatch.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(projectCreateSchema) as any,
    defaultValues,
    mode: "onTouched",
  })

  async function onSubmit(values: ProjectCreateInput) {
    setSubmitError(null)

    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("location", values.location)
    formData.append("start_date", values.start_date)
    formData.append("end_date", values.end_date)
    formData.append("description", values.description ?? "")

    for (const file of files) {
      formData.append("attachments", file)
    }

    try {
      const response = await fetch("/admin/projects/actions", {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null

      if (!response.ok || !payload?.success) {
        const message = payload?.error || "Gagal menyimpan project"
        setSubmitError(message)
        toast.error("Project gagal dibuat", { description: message })
        return
      }

      toast.success("Project berhasil dibuat")
      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Project create request failed:", error)
      const message = "Terjadi kesalahan saat menyimpan project"
      setSubmitError(message)
      toast.error("Project gagal dibuat", { description: message })
    }
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </div>
              ) : null}

              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nama Project</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Contoh: Pagar Panel Beton Gudang Cikarang"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Contoh: Cikarang, Bekasi"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormDescription>Opsional bila jadwal belum final.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Tanggal Selesai</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormDescription>Harus sama atau setelah tanggal mulai.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Umum / Spesifikasi Teknis Umum</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="min-h-36"
                        placeholder="Ringkas scope pekerjaan, konteks teknis umum, atau catatan internal yang masih aman disimpan di project."
                      />
                    </FormControl>
                    <FormDescription>
                      Isi ringkasan pekerjaan dulu. Breakdown tender detail disiapkan di iterasi berikutnya.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" /> Lampiran Pendukung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="project-attachments" className="text-sm font-medium">
                    Attachment / Foto
                  </label>
                  <Input
                    id="project-attachments"
                    type="file"
                    multiple
                    onChange={(event) => {
                      setFiles(Array.from(event.target.files ?? []))
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload opsional. Jika ada file gagal upload, project tidak akan disimpan.
                  </p>
                </div>

                {files.length > 0 ? (
                  <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
                    {files.map((file) => (
                      <div
                        key={`${file.name}-${file.size}`}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="flex min-w-0 items-start gap-2">
                          <FileImage className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.type || "Tipe file tidak terdeteksi"}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    Belum ada lampiran dipilih.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Create</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Status awal</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Relasi client</span>
                  <span>Belum ditautkan</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Siap untuk tender</span>
                  <span>Ya, sebagai parent project</span>
                </div>

                <Separator />

                <p className="text-muted-foreground">
                  Form ini hanya menyimpan project utama. Detail tender, item bidding, dan publish ke vendor tetap dipisah di iterasi berikutnya.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/projects">Batal</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save />
            )}
            Simpan Project
          </Button>
        </div>
      </Form>
    </FormProvider>
  )
}
