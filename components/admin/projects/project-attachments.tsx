"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Download, Loader2, Paperclip, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

import type { ProjectAttachment } from "@/lib/projects/types"
import { formatDateTime } from "@/lib/datetime"
import { Button } from "@/components/ui/button"

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function ProjectAttachments({
  projectId,
  initialAttachments,
  readOnly = false,
}: {
  projectId: string
  initialAttachments: ProjectAttachment[]
  readOnly?: boolean
}) {
  const router = useRouter()
  const [attachments, setAttachments] = useState(initialAttachments)
  const [files, setFiles] = useState<File[]>([])
  const [isPending, startTransition] = useTransition()

  function uploadAttachments() {
    if (files.length === 0) return

    startTransition(async () => {
      const formData = new FormData()
      for (const file of files) {
        formData.append("attachments", file)
      }

      const response = await fetch(`/admin/projects/${projectId}/attachments`, {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; attachments?: ProjectAttachment[] }
        | null

      if (!response.ok || !payload?.success || !payload.attachments) {
        toast.error("Gagal upload lampiran", {
          description: payload?.error || "Terjadi kesalahan saat upload file",
        })
        return
      }

      setAttachments(payload.attachments)
      setFiles([])
      toast.success("Lampiran project diperbarui")
      router.refresh()
    })
  }

  function deleteAttachment(path: string) {
    if (!window.confirm("Hapus lampiran ini?")) return

    startTransition(async () => {
      const response = await fetch(`/admin/projects/${projectId}/attachments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; attachments?: ProjectAttachment[] }
        | null

      if (!response.ok || !payload?.success || !payload.attachments) {
        toast.error("Gagal menghapus lampiran", {
          description: payload?.error || "Terjadi kesalahan saat menghapus lampiran",
        })
        return
      }

      setAttachments(payload.attachments)
      toast.success("Lampiran dihapus")
      router.refresh()
    })
  }

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Paperclip className="h-4 w-4 text-primary" /> Lampiran
      </div>

      {readOnly ? null : (
        <div className="space-y-3 rounded-lg border border-dashed p-4">
          <input
            type="file"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="block w-full text-sm"
          />
          {files.length > 0 ? (
            <div className="space-y-2 text-sm">
              {files.map((file) => (
                <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3">
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0 text-muted-foreground">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          ) : null}
          <Button type="button" size="sm" onClick={uploadAttachments} disabled={isPending || files.length === 0}>
            {isPending ? <Loader2 className="animate-spin" /> : <Upload />}
            Upload Lampiran
          </Button>
        </div>
      )}

      {attachments.length > 0 ? (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.path}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate font-medium">{attachment.file_name}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{formatFileSize(attachment.file_size)}</span>
                  <span>{formatDateTime(attachment.uploaded_at)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" asChild>
                  <a href={attachment.download_url ?? "#"} target="_blank" rel="noreferrer">
                    <Download /> Download
                  </a>
                </Button>
                {readOnly ? null : (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAttachment(attachment.path)}
                    disabled={isPending}
                  >
                    <Trash2 /> Hapus
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
          Belum ada lampiran project.
        </div>
      )}
    </div>
  )
}
