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
  submitted: { label: "Diajukan", variant: "default" },
  under_review: { label: "Ditinjau", variant: "default" },
  approved: {
    label: "Disetujui",
    variant: "default",
    className:
      "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  rejected: { label: "Ditolak", variant: "destructive" },
  revision_requested: {
    label: "Revisi",
    variant: "default",
    className:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
}

type VendorStatus = keyof typeof statusConfig

interface StatusBadgeProps {
  status: VendorStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
