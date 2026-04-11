"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createAdminClient } from "@/lib/supabase/admin"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"
import { sendVendorInviteEmail, sendAdminNewVendorEmail } from "@/lib/email"

async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    }
  )
}

export async function saveDraft(
  registrationId: string,
  currentStep: number,
  _formData: Partial<VendorRegistrationFormData>
) {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from("vendor_registrations")
    .update({
      current_step: currentStep,
      updated_at: new Date().toISOString(),
    })
    .eq("id", registrationId)
    .select()
    .single()

  if (error) {
    console.error("Error saving draft:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function loadDraft(userId: string) {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from("vendor_registrations")
    .select("*")
    .eq("vendor_id", userId)
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error loading draft:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

interface DocumentUpload {
  url: string
  fileName: string
  fileSize: number
  mimeType: string
}

interface DocumentsPayload {
  ktp: DocumentUpload | null
  npwp: DocumentUpload | null
  npwp_nomor: string | null
  nib: DocumentUpload | null
  nib_nomor: string | null
  siup_sbu: DocumentUpload | null
  company_profile: DocumentUpload | null
}

interface RegistrationPayload {
  registrationId: string
  company_info: VendorRegistrationFormData["company_info"]
  legal_documents: DocumentsPayload
  operational: VendorRegistrationFormData["operational"]
}

export async function submitRegistration(payload: RegistrationPayload) {
  try {
    const supabase = await getSupabaseServerClient()
    const { registrationId, company_info, legal_documents, operational } =
      payload

    const { error: registrationError } = await supabase
      .from("vendor_registrations")
      .insert({
        id: registrationId,
        vendor_id: null,
        status: "submitted",
        submission_date: new Date().toISOString(),
        current_step: 4,
        legal_agreement: true,
      })

    if (registrationError) {
      console.error("Error creating registration:", registrationError)
      return { success: false, error: registrationError.message }
    }

    const { error: companyError } = await supabase
      .from("vendor_company_info")
      .insert({
        registration_id: registrationId,
        nama_perusahaan: company_info.nama_perusahaan,
        email: company_info.email,
        nama_pic: company_info.nama_pic,
        kontak_pic: company_info.kontak_pic,
        website: company_info.website || null,
        instagram: company_info.instagram || null,
        facebook: company_info.facebook || null,
        linkedin: company_info.linkedin || null,
      })

    if (companyError) {
      console.error("Error creating company info:", companyError)
      return { success: false, error: companyError.message }
    }

    const contacts = [
      { ...company_info.contact_1, sequence: 1 },
      { ...company_info.contact_2, sequence: 2 },
      company_info.contact_3
        ? { ...company_info.contact_3, sequence: 3 }
        : null,
    ].filter(Boolean)

    for (const contact of contacts) {
      if (contact && (contact.no_hp || contact.nama)) {
        await supabase.from("vendor_contacts").insert({
          registration_id: registrationId,
          nama: contact.nama,
          no_hp: contact.no_hp,
          jabatan: contact.jabatan || "",
          is_primary: contact.sequence === 1,
          sequence: contact.sequence,
        })
      }
    }

    const documents = [
      {
        type: "ktp",
        doc: legal_documents.ktp,
        number: null,
      },
      {
        type: "npwp",
        doc: legal_documents.npwp,
        number: legal_documents.npwp_nomor,
      },
      {
        type: "nib",
        doc: legal_documents.nib,
        number: legal_documents.nib_nomor,
      },
      {
        type: "siup_sbu",
        doc: legal_documents.siup_sbu,
        number: null,
      },
      {
        type: "company_profile",
        doc: legal_documents.company_profile,
        number: null,
      },
    ]

    for (const doc of documents) {
      if (doc.doc) {
        await supabase.from("vendor_legal_documents").insert({
          registration_id: registrationId,
          document_type: doc.type,
          document_number: doc.number,
          file_name: doc.doc.fileName,
          file_path: doc.doc.url,
          file_size: doc.doc.fileSize,
          mime_type: doc.doc.mimeType,
        })
      }
    }

    await supabase.from("vendor_bank_accounts").insert({
      registration_id: registrationId,
      bank_name: operational.bank?.bank_nama || "",
      account_number: operational.bank?.bank_nomor || "",
      account_holder_name: operational.bank?.bank_atas_nama || "",
      is_primary: true,
    })

    const factoryAddress = operational.factory_address

    await supabase.from("vendor_factory_addresses").insert({
      registration_id: registrationId,
      address: factoryAddress?.alamat_detail || "",
      province: factoryAddress?.provinsi_name || "",
      kabupaten: factoryAddress?.kabupaten_name || "",
      kecamatan: factoryAddress?.kecamatan || "",
      postal_code: factoryAddress?.kode_pos || "",
      is_primary: true,
    })

    for (const product of operational.products || []) {
      await supabase.from("vendor_products").insert({
        registration_id: registrationId,
        name: product.name,
        satuan: product.satuan,
        price: product.price,
        dimensions: product.dimensions || null,
        material: product.material || null,
        finishing: product.finishing || null,
        weight_kg: product.berat || null,
        lead_time_days: product.lead_time_days || null,
        moq: product.moq || null,
        description: product.description || null,
      })
    }

    for (const area of operational.delivery_areas || []) {
      await supabase.from("vendor_delivery_areas").insert({
        registration_id: registrationId,
        province_id: area.province_id,
        city_id: area.city_id,
      })
    }

    const inclusions = operational.cost_inclusions
    const inclusionTypes = [
      { key: "mobilisasi", value: "mobilisasi_demobilisasi" },
      { key: "penginapan", value: "penginapan_tukang" },
      { key: "pengiriman", value: "biaya_pengiriman" },
      { key: "langsir", value: "biaya_langsir" },
      { key: "instalasi", value: "instalasi" },
      { key: "ppn", value: "ppn" },
    ]

    for (const inc of inclusionTypes) {
      const isIncluded = (inclusions as Record<string, boolean>)[inc.key]
      if (isIncluded) {
        await supabase.from("vendor_cost_inclusions").insert({
          registration_id: registrationId,
          inclusion_type: inc.value,
          is_included: true,
        })
      }
    }

    for (const cost of operational.additional_costs || []) {
      if (cost.description) {
        await supabase.from("vendor_additional_costs").insert({
          registration_id: registrationId,
          description: cost.description,
          amount: cost.amount,
          unit: cost.unit,
        })
      }
    }

    let vendorUserId: string | null = null
    let inviteEmailSent = false

    try {
      const adminSupabase = createAdminClient()

      const { data: authUser, error: authError } =
        await adminSupabase.auth.admin.createUser({
          email: company_info.email,
          email_confirm: true,
          user_metadata: {
            nama: company_info.nama_pic,
            no_hp: company_info.kontak_pic,
            company_name: company_info.nama_perusahaan,
          },
          app_metadata: {
            stakeholder_type: "vendor",
          },
        })

      if (authError) {
        console.error("Error creating vendor user:", authError)
      } else if (authUser.user) {
        vendorUserId = authUser.user.id

        await supabase
          .from("vendor_registrations")
          .update({ vendor_id: vendorUserId })
          .eq("id", registrationId)

        await supabase.from("vendor_profiles").insert({
          user_id: vendorUserId,
          registration_id: registrationId,
          status: "suspended",
        })

        const inviteUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/vendor/accept-invite?token=${registrationId}`
        const emailResult = await sendVendorInviteEmail(
          company_info.email,
          inviteUrl,
          company_info.nama_perusahaan,
          company_info.nama_pic
        )

        if (emailResult.success) {
          inviteEmailSent = true
        }
      }
    } catch (adminError) {
      console.error("Error creating vendor account:", adminError)
    }

    try {
      const adminUsers = await supabase
        .from("users")
        .select("id, email, nama")
        .eq("stakeholder_type", "internal")

      if (adminUsers.data && adminUsers.data.length > 0) {
        for (const admin of adminUsers.data) {
          await supabase.from("notifications").insert({
            user_id: admin.id,
            type: "vendor_registration",
            category: "vendor",
            title: "Pendaftaran Vendor Baru",
            message: `${company_info.nama_perusahaan} telah mendaftar sebagai vendor dan menunggu review Anda. PIC: ${company_info.nama_pic}`,
            reference_id: registrationId,
            reference_type: "vendor_registration",
            is_read: false,
          })

          await sendAdminNewVendorEmail(
            admin.email,
            company_info.nama_perusahaan,
            company_info.nama_pic,
            registrationId
          )
        }
      }
    } catch (notifyError) {
      console.error("Error sending admin notifications:", notifyError)
    }

    revalidatePath("/vendor/register")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      data: {
        registrationId,
        vendorUserId,
        inviteEmailSent,
      },
    }
  } catch (error) {
    console.error("Error submitting registration:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
