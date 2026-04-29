"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Send, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { publishProjectTenderAction } from "@/app/(admin)/admin/projects/[id]/tender/actions"
import type { ProjectDetail } from "@/lib/projects/types"
import { formatDate } from "@/lib/datetime"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

type TenderItemDraft = {
  id: string
  name: string
  quantity: string
  unit: string
  description: string
}

function createItemDraft(project: ProjectDetail): TenderItemDraft {
  return {
    id: crypto.randomUUID(),
    name: project.job_type || project.name,
    quantity: project.estimated_length_or_area?.toString() ?? "",
    unit: project.measurement_unit || "",
    description: project.initial_description || project.description || "",
  }
}

function formatPeriod(project: ProjectDetail) {
  if (project.start_date && project.end_date) {
    return `${formatDate(project.start_date)} - ${formatDate(project.end_date)}`
  }

  if (project.start_date) return `Mulai ${formatDate(project.start_date)}`
  if (project.end_date) return `Selesai ${formatDate(project.end_date)}`
  return "Belum ditentukan"
}

export function TenderPublishForm({ project }: { project: ProjectDetail }) {
  const router = useRouter()
  const [items, setItems] = useState<TenderItemDraft[]>(() => [createItemDraft(project)])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const safeDescription = useMemo(
    () => project.initial_description || project.description || project.special_requirements || "",
    [project.description, project.initial_description, project.special_requirements]
  )

  function updateItem(id: string, key: keyof Omit<TenderItemDraft, "id">, value: string) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    )
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      { id: crypto.randomUUID(), name: "", quantity: "", unit: "", description: "" },
    ])
  }

  function duplicateItem(item: TenderItemDraft) {
    setItems((currentItems) => [...currentItems, { ...item, id: crypto.randomUUID() }])
  }

  function removeItem(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await publishProjectTenderAction(project.id, formData)

      if (!result.success) {
        const message = result.error || "Gagal publish tender"
        setSubmitError(message)
        toast.error("Tender gagal dipublish", { description: message })
        return
      }

      toast.success("Tender berhasil dipublish ke vendor")
      router.push(`/admin/tenders/${result.tenderId}`)
      router.refresh()
    } catch (error) {
      console.error("Tender publish failed:", error)
      const message = "Terjadi kesalahan saat publish tender"
      setSubmitError(message)
      toast.error("Tender gagal dipublish", { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Review Data Vendor-Facing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Project</p>
                  <p className="font-medium">{project.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lokasi publik</p>
                  <p className="font-medium">{project.location || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Periode</p>
                  <p className="font-medium">{formatPeriod(project)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status setelah publish</p>
                  <Badge variant="secondary">Tendering</Badge>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-4 text-muted-foreground">
                Data client, kontak, alamat lengkap, budget internal, dan catatan internal tidak tampil ke vendor.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Metadata Tender</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {submitError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Judul Tender</label>
                <Input id="title" name="title" defaultValue={project.name} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Deskripsi Tender</label>
                <Textarea id="description" name="description" defaultValue={safeDescription} className="min-h-32" />
                <p className="text-xs text-muted-foreground">Tulis versi aman untuk vendor. Jangan masukkan data client sensitif.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="min_vendors" className="text-sm font-medium">Minimal Vendor Submit</label>
                  <Input id="min_vendors" name="min_vendors" inputMode="numeric" defaultValue="2" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="revision_deadline_hours" className="text-sm font-medium">Deadline Revisi (jam)</label>
                  <Input id="revision_deadline_hours" name="revision_deadline_hours" inputMode="numeric" placeholder="Opsional" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>3. Item Pekerjaan Tender</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4" /> Tambah Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">Item {index + 1}</p>
                      <p className="text-xs text-muted-foreground">Nama, quantity, unit, dan spesifikasi singkat.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => duplicateItem(item)}>Duplicate</Button>
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeItem(item.id)} disabled={items.length === 1} aria-label="Hapus item">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px_140px]">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nama Item</label>
                      <Input name="item_name" value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <Input name="item_quantity" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", event.target.value)} inputMode="decimal" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Unit</label>
                      <Input name="item_unit" value={item.unit} onChange={(event) => updateItem(item.id, "unit", event.target.value)} placeholder="m / m2 / unit" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deskripsi / Spesifikasi</label>
                    <Textarea name="item_description" value={item.description} onChange={(event) => updateItem(item.id, "description", event.target.value)} className="min-h-24" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>4. Preview Tampilan Vendor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Judul</p>
                <p className="font-medium">{project.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lokasi</p>
                <p>{project.location || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Periode</p>
                <p>{formatPeriod(project)}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium">Item pekerjaan</p>
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border bg-muted/20 p-3">
                    <p className="font-medium">{item.name || "Item belum diisi"}</p>
                    <p className="text-muted-foreground">{item.quantity || "-"} {item.unit || "unit"}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium">Lampiran project</p>
                <p className="text-muted-foreground">
                  {project.attachments.length} file tersedia dari lampiran project. Kelola file dari detail project.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Setelah publish, tender langsung berstatus open dan project masuk status Tendering.</p>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
                  Publish ke Vendor
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/admin/projects/${project.id}`}>Batal</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
