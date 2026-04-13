"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createAdminClient } from "@/lib/supabase/admin"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"

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

    const contacts = [
      { ...company_info.contact_1, sequence: 1 },
      { ...company_info.contact_2, sequence: 2 },
      company_info.contact_3
        ? { ...company_info.contact_3, sequence: 3 }
        : null,
    ]
      .filter(Boolean)
      .filter((c): c is NonNullable<typeof c> => !!(c && (c.no_hp || c.nama)))

    const documents = [
      { type: "ktp", doc: legal_documents.ktp, number: null },
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
      { type: "siup_sbu", doc: legal_documents.siup_sbu, number: null },
      {
        type: "company_profile",
        doc: legal_documents.company_profile,
        number: null,
      },
    ].filter((d) => d.doc)

    const inclusions = operational.cost_inclusions as Record<string, boolean>
    const inclusionTypes = [
      { key: "mobilisasi", value: "mobilisasi_demobilisasi" },
      { key: "penginapan", value: "penginapan_tukang" },
      { key: "pengiriman", value: "biaya_pengiriman" },
      { key: "langsir", value: "biaya_langsir" },
      { key: "instalasi", value: "instalasi" },
      { key: "ppn", value: "ppn" },
    ]

    const additionalCosts = (operational.additional_costs || []).filter(
      (c) => c.description
    )

    await Promise.all([
      supabase.from("vendor_company_info").insert({
        registration_id: registrationId,
        nama_perusahaan: company_info.nama_perusahaan,
        email: company_info.email,
        nama_pic: company_info.nama_pic,
        kontak_pic: company_info.kontak_pic,
        website: company_info.website || null,
        instagram: company_info.instagram || null,
        facebook: company_info.facebook || null,
        linkedin: company_info.linkedin || null,
      }),

      contacts.length > 0
        ? supabase.from("vendor_contacts").insert(
            contacts.map((contact) => ({
              registration_id: registrationId,
              nama: contact.nama,
              no_hp: contact.no_hp,
              jabatan: contact.jabatan || "",
              is_primary: contact.sequence === 1,
              sequence: contact.sequence,
            }))
          )
        : Promise.resolve({ error: null }),

      documents.length > 0
        ? supabase.from("vendor_legal_documents").insert(
            documents.map((doc) => ({
              registration_id: registrationId,
              document_type: doc.type,
              document_number: doc.number,
              file_name: doc.doc!.fileName,
              file_path: doc.doc!.url,
              file_size: doc.doc!.fileSize,
              mime_type: doc.doc!.mimeType,
            }))
          )
        : Promise.resolve({ error: null }),

      supabase.from("vendor_bank_accounts").insert({
        registration_id: registrationId,
        bank_name: operational.bank?.bank_nama || "",
        account_number: operational.bank?.bank_nomor || "",
        account_holder_name: operational.bank?.bank_atas_nama || "",
        is_primary: true,
      }),

      supabase.from("vendor_factory_addresses").insert({
        registration_id: registrationId,
        address: operational.factory_address?.alamat_detail || "",
        province: operational.factory_address?.provinsi_name || "",
        kabupaten: operational.factory_address?.kabupaten_name || "",
        kecamatan: operational.factory_address?.kecamatan || "",
        postal_code: operational.factory_address?.kode_pos || "",
        is_primary: true,
      }),

      (operational.products || []).length > 0
        ? supabase.from("vendor_products").insert(
            (operational.products || []).map((product) => ({
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
            }))
          )
        : Promise.resolve({ error: null }),

      (operational.delivery_areas || []).length > 0
        ? supabase.from("vendor_delivery_areas").insert(
            (operational.delivery_areas || []).map((area) => ({
              registration_id: registrationId,
              province_id: area.province_id,
              city_id: area.city_id,
            }))
          )
        : Promise.resolve({ error: null }),

      supabase.from("vendor_cost_inclusions").insert(
        inclusionTypes
          .filter((inc) => inclusions[inc.key])
          .map((inc) => ({
            registration_id: registrationId,
            inclusion_type: inc.value,
            is_included: true,
          }))
      ),

      additionalCosts.length > 0
        ? supabase.from("vendor_additional_costs").insert(
            additionalCosts.map((cost) => ({
              registration_id: registrationId,
              description: cost.description,
              amount: cost.amount,
              unit: cost.unit,
            }))
          )
        : Promise.resolve({ error: null }),
    ])

    invokeBackgroundProcessing(
      registrationId,
      company_info,
      legal_documents,
      operational
    ).catch((err) => {
      console.error("Background processing failed:", err)
    })

    await Promise.all([
      revalidatePath("/vendor/register"),
      revalidatePath("/admin/dashboard"),
    ])

    return {
      success: true,
      data: {
        registrationId,
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

async function invokeBackgroundProcessing(
  registrationId: string,
  company_info: RegistrationPayload["company_info"],
  legal_documents: RegistrationPayload["legal_documents"],
  operational: RegistrationPayload["operational"]
) {
  const supabase = createAdminClient()
  await supabase.functions.invoke("process-vendor-registration", {
    body: {
      registrationId,
      company_info,
      legal_documents,
      operational,
    },
  })
}
