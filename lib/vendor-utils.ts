import type { Database } from "@/types/database.types"

export type VendorRegistrationStatus =
  Database["public"]["Enums"]["vendor_registration_status"]
export type VendorProfileStatus =
  Database["public"]["Enums"]["vendor_profile_status"]

export interface VendorTenderEligibility {
  allowed: boolean
  canJoin: boolean
  reason?: string
  projectLimit?: "all" | "small_only"
}

export function canVendorJoinTender(
  registrationStatus: VendorRegistrationStatus | null | undefined,
  profileStatus: VendorProfileStatus | null | undefined,
  profileCompleteness: number | null | undefined,
  _approvalScore: number | null | undefined
): VendorTenderEligibility {
  const statusReasons: Record<string, string> = {
    draft: "Lengkapi formulir pendaftaran terlebih dahulu",
    submitted: "Menunggu verifikasi dari tim LPrecast",
    under_review: "Sedang dalam proses review oleh tim LPrecast",
    revision_requested: "Silakan perbaiki data sesuai catatan reviewer",
    rejected: "Pendaftaran ditolak. Silakan hubungi tim LPrecast",
    suspended: "Akun ditangguhkan. Hubungi tim LPrecast",
    blacklisted: "Akun diblokir. Hubungi tim LPrecast",
  }

  if (!registrationStatus || !profileStatus) {
    return {
      allowed: false,
      canJoin: false,
      reason: "Data profil belum ditemukan",
    }
  }

  if (profileStatus !== "active") {
    return {
      allowed: false,
      canJoin: false,
      reason: `Akun berstatus "${profileStatus}". Silakan hubungi tim LPrecast.`,
    }
  }

  if (registrationStatus === "conditional") {
    return {
      allowed: true,
      canJoin: true,
      projectLimit: "small_only",
      reason: "Anda hanya boleh mengikuti project sesuai kondisi approval.",
    }
  }

  if (registrationStatus === "approved") {
    if (profileCompleteness != null && profileCompleteness < 80) {
      return {
        allowed: false,
        canJoin: false,
        reason: `Kelengkapan profil hanya ${profileCompleteness}%. Minimal 80% untuk ikut tender.`,
      }
    }
    return {
      allowed: true,
      canJoin: true,
      projectLimit: "all",
    }
  }

  return {
    allowed: false,
    canJoin: false,
    reason:
      statusReasons[registrationStatus] || "Status tidak valid untuk tender",
  }
}

export function getRegistrationStatusLabel(
  status: VendorRegistrationStatus
): string {
  const labels: Record<string, string> = {
    draft: "Draft",
    submitted: "Menunggu Review",
    under_review: "Sedang Diverifikasi",
    revision_requested: "Perlu Revisi",
    approved: "Terverifikasi",
    conditional: "Bersyarat",
    rejected: "Ditolak",
  }
  return labels[status] || status
}

export function getProfileStatusLabel(status: VendorProfileStatus): string {
  const labels: Record<string, string> = {
    active: "Aktif",
    suspended: "Ditangguhkan",
    blacklisted: "Diblokir",
  }
  return labels[status] || status
}

export function isVendorApproved(
  registrationStatus: VendorRegistrationStatus | null | undefined
): boolean {
  return registrationStatus === "approved" || registrationStatus === "conditional"
}

export function isVendorActive(
  profileStatus: VendorProfileStatus | null | undefined
): boolean {
  return profileStatus === "active"
}
