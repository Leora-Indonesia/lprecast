"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { CalendarDays, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { MilestoneStatus, ProjectMilestone } from "@/lib/projects/types"
import { formatDate } from "@/lib/datetime"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { Textarea } from "@/components/ui/textarea"

type MilestoneFormState = {
  title: string
  description: string
  due_date: string
  status: MilestoneStatus
}

const emptyForm: MilestoneFormState = {
  title: "",
  description: "",
  due_date: "",
  status: "pending",
}

export function ProjectMilestones({
  projectId,
  initialMilestones,
  readOnly = false,
}: {
  projectId: string
  initialMilestones: ProjectMilestone[]
  readOnly?: boolean
}) {
  const router = useRouter()
  const [milestones, setMilestones] = useState(initialMilestones)
  const [draft, setDraft] = useState<MilestoneFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingDraft, setEditingDraft] = useState<MilestoneFormState>(emptyForm)
  const [isPending, startTransition] = useTransition()

  function syncMilestones(nextMilestones: ProjectMilestone[]) {
    setMilestones(nextMilestones.sort((a, b) => a.due_date.localeCompare(b.due_date)))
    router.refresh()
  }

  function createMilestone() {
    startTransition(async () => {
      const response = await fetch(`/admin/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; milestone?: ProjectMilestone }
        | null

      if (!response.ok || !payload?.success || !payload.milestone) {
        toast.error("Gagal menambah milestone", {
          description: payload?.error || "Terjadi kesalahan saat menambah milestone",
        })
        return
      }

      syncMilestones([...milestones, payload.milestone])
      setDraft(emptyForm)
      toast.success("Milestone ditambahkan")
    })
  }

  function startEdit(milestone: ProjectMilestone) {
    setEditingId(milestone.id)
    setEditingDraft({
      title: milestone.title,
      description: milestone.description ?? "",
      due_date: milestone.due_date,
      status: milestone.status,
    })
  }

  function saveEdit(milestoneId: string) {
    startTransition(async () => {
      const response = await fetch(`/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDraft),
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; milestone?: ProjectMilestone }
        | null

      if (!response.ok || !payload?.success || !payload.milestone) {
        toast.error("Gagal memperbarui milestone", {
          description: payload?.error || "Terjadi kesalahan saat memperbarui milestone",
        })
        return
      }

      syncMilestones(
        milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            return payload.milestone ?? milestone
          }

          return milestone
        })
      )
      setEditingId(null)
      setEditingDraft(emptyForm)
      toast.success("Milestone diperbarui")
    })
  }

  function markCompleted(milestoneId: string) {
    startTransition(async () => {
      const response = await fetch(`/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; milestone?: ProjectMilestone }
        | null

      if (!response.ok || !payload?.success || !payload.milestone) {
        toast.error("Gagal menandai milestone selesai", {
          description: payload?.error || "Terjadi kesalahan saat memperbarui milestone",
        })
        return
      }

      syncMilestones(
        milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            return payload.milestone ?? milestone
          }

          return milestone
        })
      )
      toast.success("Milestone ditandai selesai")
    })
  }

  function deleteMilestone(milestoneId: string) {
    if (!window.confirm("Hapus milestone ini?")) return

    startTransition(async () => {
      const response = await fetch(`/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: "DELETE",
      })

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null

      if (!response.ok || !payload?.success) {
        toast.error("Gagal menghapus milestone", {
          description: payload?.error || "Terjadi kesalahan saat menghapus milestone",
        })
        return
      }

      syncMilestones(milestones.filter((milestone) => milestone.id !== milestoneId))
      toast.success("Milestone dihapus")
    })
  }

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <CalendarDays className="h-4 w-4 text-primary" /> Target Milestone
      </div>

      {readOnly ? null : (
      <div className="space-y-3 rounded-lg border border-dashed p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder="Judul milestone"
          />
          <Input
            type="date"
            value={draft.due_date}
            onChange={(event) => setDraft((current) => ({ ...current, due_date: event.target.value }))}
          />
        </div>
        <Textarea
          value={draft.description}
          onChange={(event) =>
            setDraft((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Deskripsi milestone"
          className="min-h-24"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-48">
            <Select
              value={draft.status}
              onValueChange={(value) => setDraft((current) => ({ ...current, status: value as MilestoneStatus }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={createMilestone} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            Tambah Milestone
          </Button>
        </div>
      </div>
      )}

      {milestones.length > 0 ? (
        <div className="space-y-3">
          {milestones.map((milestone) => {
            const isEditing = editingId === milestone.id

            return (
              <div key={milestone.id} className="rounded-lg border p-4">
                {isEditing && !readOnly ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={editingDraft.title}
                        onChange={(event) =>
                          setEditingDraft((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                      <Input
                        type="date"
                        value={editingDraft.due_date}
                        onChange={(event) =>
                          setEditingDraft((current) => ({ ...current, due_date: event.target.value }))
                        }
                      />
                    </div>
                    <Textarea
                      value={editingDraft.description}
                      onChange={(event) =>
                        setEditingDraft((current) => ({ ...current, description: event.target.value }))
                      }
                      className="min-h-24"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="w-full sm:max-w-48">
                        <Select
                          value={editingDraft.status}
                          onValueChange={(value) =>
                            setEditingDraft((current) => ({ ...current, status: value as MilestoneStatus }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={() => saveEdit(milestone.id)} disabled={isPending}>
                          Simpan
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          disabled={isPending}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{milestone.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span>Target {formatDate(milestone.due_date)}</span>
                          <StatusBadge status={milestone.status} />
                        </div>
                      </div>
                       <div className="flex flex-wrap gap-2">
                         {!readOnly && milestone.status !== "completed" ? (
                           <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => markCompleted(milestone.id)}
                            disabled={isPending}
                          >
                            Selesai
                          </Button>
                        ) : null}
                         {readOnly ? null : (
                           <>
                             <Button
                               type="button"
                               size="sm"
                               variant="outline"
                               onClick={() => startEdit(milestone)}
                               disabled={isPending}
                             >
                               <Pencil /> Edit
                             </Button>
                             <Button
                               type="button"
                               size="sm"
                               variant="destructive"
                               onClick={() => deleteMilestone(milestone.id)}
                               disabled={isPending}
                             >
                               <Trash2 /> Hapus
                             </Button>
                           </>
                         )}
                      </div>
                    </div>

                    {milestone.description ? (
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
          Belum ada milestone project.
        </div>
      )}
    </div>
  )
}
