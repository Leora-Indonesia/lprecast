import { createClient } from "@/lib/supabase/server"
import type { Notification } from "@/lib/types/vendor"
import type { Database } from "@/types/database.types"

type NotificationType =
  | "vendor_registration"
  | "vendor_approved"
  | "vendor_rejected"
  | "tender_new"
  | "tender_updated"
  | "payment_request"
  | "payment_approved"
  | "general"

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  category: Database["public"]["Enums"]["notification_category"]
  title: string
  message: string
  referenceId?: string
  referenceType?: string
}

export async function createNotification(
  params: CreateNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    category: params.category,
    title: params.title,
    message: params.message,
    reference_id: params.referenceId ?? null,
    reference_type: params.referenceType ?? null,
    is_read: false,
  })

  if (error) {
    console.error("Error creating notification:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) {
    console.error("Error fetching notification count:", error)
    return 0
  }

  return count ?? 0
}

export async function getNotifications(
  userId: string,
  limit = 10
): Promise<Notification[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data ?? []
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  const supabase = await createClient()

  await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", notificationId)
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<void> {
  const supabase = await createClient()

  await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_read", false)
}

export async function notifyAdminsNewVendor(
  registrationId: string,
  companyName: string,
  picName: string
): Promise<{ success: boolean; notifiedCount: number }> {
  const supabase = await createClient()

  const { data: admins, error: adminError } = await supabase
    .from("users")
    .select("id, email, nama")
    .eq("stakeholder_type", "internal")

  if (adminError || !admins) {
    console.error("Error fetching admins:", adminError)
    return { success: false, notifiedCount: 0 }
  }

  let notifiedCount = 0

  for (const admin of admins) {
    const { error } = await supabase.from("notifications").insert({
      user_id: admin.id,
      type: "vendor_registration",
      category: "vendor",
      title: "Pendaftaran Vendor Baru",
      message: `${companyName} telah mendaftar sebagai vendor dan menunggu review Anda. PIC: ${picName}`,
      reference_id: registrationId,
      reference_type: "vendor_registration",
      is_read: false,
    })

    if (!error) {
      notifiedCount++
    }
  }

  return { success: true, notifiedCount }
}

export async function notifyVendorStatusChange(
  vendorUserId: string,
  vendorName: string,
  status: "approved" | "rejected" | "revision_requested",
  notes?: string
): Promise<{ success: boolean }> {
  const supabase = await createClient()

  const statusMessages = {
    approved: {
      title: "Pendaftaran Vendor Disetujui",
      message: `Selamat! Pendaftaran vendor "${vendorName}" telah disetujui. Anda sekarang dapat mengakses portal vendor.`,
    },
    rejected: {
      title: "Pendaftaran Vendor Ditolak",
      message: `Mohon maaf, pendaftaran vendor "${vendorName}" telah ditolak. ${notes || "Silakan hubungi admin untuk informasi lebih lanjut."}`,
    },
    revision_requested: {
      title: "Revisi Diperlukan",
      message: `Pendaftaran vendor "${vendorName}" memerlukan revisi. ${notes || "Silakan perbarui data Anda."}`,
    },
  }

  const { error } = await supabase.from("notifications").insert({
    user_id: vendorUserId,
    type:
      status === "approved"
        ? "vendor_approved"
        : status === "rejected"
          ? "vendor_rejected"
          : "general",
    category: "vendor",
    title: statusMessages[status].title,
    message: statusMessages[status].message,
    reference_id: null,
    reference_type: "vendor_registration",
    is_read: false,
  })

  if (error) {
    console.error("Error notifying vendor:", error)
    return { success: false }
  }

  return { success: true }
}

export async function notifyTenderUpdate(
  vendorIds: string[],
  tenderId: string,
  tenderTitle: string,
  updateType: "new" | "updated" | "deadline_reminder"
): Promise<{ success: boolean; notifiedCount: number }> {
  const supabase = await createClient()

  const messages = {
    new: {
      type: "tender_new" as const,
      title: "Tender Baru",
      message: `Tender baru "${tenderTitle}" tersedia. Segera ajukan penawaran Anda.`,
    },
    updated: {
      type: "tender_updated" as const,
      title: "Tender Diperbarui",
      message: `Tender "${tenderTitle}" telah diperbarui. Periksa detail terbaru.`,
    },
    deadline_reminder: {
      type: "tender_updated" as const,
      title: "Pengingat Tender",
      message: `Tender "${tenderTitle}" akan segera ditutup. Segera ajukan penawaran Anda.`,
    },
  }

  let notifiedCount = 0

  for (const vendorId of vendorIds) {
    const { error } = await supabase.from("notifications").insert({
      user_id: vendorId,
      type: messages[updateType].type,
      category: "tender",
      title: messages[updateType].title,
      message: messages[updateType].message,
      reference_id: tenderId,
      reference_type: "tender",
      is_read: false,
    })

    if (!error) {
      notifiedCount++
    }
  }

  return { success: true, notifiedCount }
}
