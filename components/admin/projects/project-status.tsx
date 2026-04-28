"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import type { ProjectStatus } from "@/lib/projects/types"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

const transitions: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ["open", "cancelled"],
  open: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
}

const labels: Record<ProjectStatus, string> = {
  draft: "Draft",
  open: "Open",
  in_progress: "Berjalan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
}

export function ProjectStatusManager({
  projectId,
  status,
}: {
  projectId: string
  status: ProjectStatus
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const allowedTransitions = transitions[status]

  function updateStatus(nextStatus: ProjectStatus) {
    startTransition(async () => {
      const response = await fetch(`/admin/projects/${projectId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null

      if (!response.ok || !payload?.success) {
        toast.error("Gagal memperbarui status", {
          description: payload?.error || "Terjadi kesalahan saat mengubah status project",
        })
        return
      }

      toast.success(`Status project diubah ke ${labels[nextStatus]}`)
      router.refresh()
    })
  }

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Status saat ini</span>
        <StatusBadge status={status} />
      </div>

      {allowedTransitions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allowedTransitions.map((nextStatus) => (
            <Button
              key={nextStatus}
              type="button"
              variant={nextStatus === "cancelled" ? "destructive" : "outline"}
              size="sm"
              onClick={() => updateStatus(nextStatus)}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : null}
              Ubah ke {labels[nextStatus]}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Status ini sudah final. Tidak ada transisi lanjutan.
        </p>
      )}
    </div>
  )
}
