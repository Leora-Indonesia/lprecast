export const DEFAULT_TIMEZONE = "Asia/Jakarta"

export function getUserTimezone(): string {
  if (typeof window === "undefined") {
    return DEFAULT_TIMEZONE
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE
}

export function toLocalDate(
  date: Date | string | null | undefined,
  timezone?: string
): Date {
  if (!date) return new Date()
  const tz = timezone || getUserTimezone()
  const d = typeof date === "string" ? new Date(date) : date
  return new Date(d.toLocaleString("en-US", { timeZone: tz }))
}

export function formatDateTime(
  date: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  timezone?: string
): string {
  if (!date) return "-"
  const d = typeof date === "string" ? new Date(date) : date

  if (isNaN(d.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: timezone || DEFAULT_TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  }).format(d)
}

export function formatDate(
  date: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  timezone?: string
): string {
  if (!date) return "-"
  const d = typeof date === "string" ? new Date(date) : date

  if (isNaN(d.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: timezone || DEFAULT_TIMEZONE,
    dateStyle: "medium",
    ...options,
  }).format(d)
}

export function formatTime(
  date: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  timezone?: string
): string {
  if (!date) return "-"
  const tz = timezone || getUserTimezone()
  const d = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: tz,
    timeStyle: "short",
    ...options,
  }).format(d)
}

export function formatRelativeTime(
  date: Date | string | null | undefined,
  timezone?: string
): string {
  if (!date) return "-"
  const tz = timezone || getUserTimezone()
  const d = typeof date === "string" ? new Date(date) : date

  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "Baru saja"
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`

  return formatDate(d, undefined, tz)
}

export function getTimezoneAbbreviation(timezone?: string): string {
  const tz = timezone || getUserTimezone()
  const date = new Date()
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: tz,
    timeZoneName: "short",
  })
  const parts = formatter.formatToParts(date)
  const tzPart = parts.find((p) => p.type === "timeZoneName")
  return tzPart?.value || "WIB"
}
