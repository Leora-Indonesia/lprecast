import { Badge, type VariantProps } from "./badge"

type BadgeVariant = VariantProps<
  typeof import("./badge").badgeVariants
>["variant"]

type StatusConfig = {
  label: string
  variant: BadgeVariant
  className?: string
}

const statusConfig: Record<string, StatusConfig> = {
  draft: { label: "Draft", variant: "secondary" },
  open: {
    label: "Tendering",
    variant: "default",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  in_progress: {
    label: "Berjalan",
    variant: "default",
    className:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  completed: {
    label: "Selesai",
    variant: "default",
    className:
      "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "destructive",
  },
  submitted: { label: "Diajukan", variant: "default" },
  under_review: { label: "Ditinjau", variant: "default" },
  approved: {
    label: "Disetujui",
    variant: "default",
    className:
      "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  conditional: {
    label: "Bersyarat",
    variant: "default",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  rejected: { label: "Ditolak", variant: "destructive" },
  revision_requested: {
    label: "Revisi",
    variant: "default",
    className:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    variant: "secondary",
  }
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
