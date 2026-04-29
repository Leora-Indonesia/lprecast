import { FolderCheck, FolderClock, FolderKanban, FolderOpen, FolderX } from "lucide-react"

import type { ProjectSummary } from "@/lib/projects/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
  { key: "total", label: "Total Project", icon: FolderOpen },
  { key: "draft", label: "Draft", icon: FolderClock },
  { key: "open", label: "Tendering", icon: FolderKanban },
  { key: "in_progress", label: "Berjalan", icon: FolderOpen },
  { key: "completed", label: "Selesai", icon: FolderCheck },
  { key: "cancelled", label: "Dibatalkan", icon: FolderX },
] as const

export function ProjectSummaryCards({ summary }: { summary: ProjectSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{summary[item.key]}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
