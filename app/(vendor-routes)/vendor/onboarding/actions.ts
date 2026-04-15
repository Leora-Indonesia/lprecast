"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export interface OnboardingDraftData {
  currentStep: number
  company_info: {
    nama_perusahaan: string
    email: string
    nama_pic: string
    kontak_pic: string
    website: string
    instagram: string
    facebook: string
    linkedin: string
    contacts: {
      sequence: number
      nama: string
      no_hp: string
      jabatan: string
    }[]
  }
  documents: {
    ktp_path: string | null
    ktp_number: string | null
    npwp_path: string | null
    npwp_number: string | null
    nib_path: string | null
    nib_number: string | null
    siup_sbu_path: string | null
    company_profile_path: string | null
  }
  operational: {
    factory_address: {
      address: string
      province: string
      kabupaten: string
      kecamatan: string
      postal_code: string
    }
    delivery_areas: {
      province_id: string
      province_name: string
      city_id: string
      city_name: string
    }[]
    products: {
      name: string
      satuan: string
      price: number
      dimensions: string
      material: string
      finishing: string
      weight_kg: number
      lead_time_days: number
      moq: number
    }[]
    bank_account: {
      bank_name: string
      account_number: string
      account_holder_name: string
    }
    cost_inclusions: {
      mobilisasi_demobilisasi: boolean
      penginapan_tukang: boolean
      biaya_pengiriman: boolean
      biaya_langsir: boolean
      instalasi: boolean
      ppn: boolean
    }
    additional_costs: {
      description: string
      amount: number
      unit: string
    }[]
  }
}

export interface SaveDraftResult {
  success: boolean
  error?: string
}

export interface LoadDraftResult {
  success: boolean
  data?: OnboardingDraftData | null
  error?: string
}

export interface RegistrationStatus {
  status:
    | "none"
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
  hasDraft: boolean
  hasRegistration: boolean
}

async function uploadDocument(
  file: File,
  userId: string,
  documentType: string
): Promise<{
  path: string
  name: string
  size: number
  mimeType: string
} | null> {
  try {
    const adminClient = createAdminClient()
    const fileExt = file.name.split(".").pop() || "pdf"
    const fileName = `${documentType}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${documentType}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()

    const { error } = await adminClient.storage
      .from("vendor-documents")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error(`Upload error for ${documentType}:`, error)
      return null
    }

    const { data: urlData } = adminClient.storage
      .from("vendor-documents")
      .getPublicUrl(filePath)

    return {
      path: urlData.publicUrl,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    }
  } catch (err) {
    console.error(`Upload error for ${documentType}:`, err)
    return null
  }
}

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: "none", hasDraft: false, hasRegistration: false }
  }

  const [draftResult, registrationResult] = await Promise.all([
    supabase
      .from("vendor_onboarding_drafts")
      .select("id")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("vendor_registrations")
      .select("status")
      .eq("user_id", user.id)
      .single(),
  ])

  const hasDraft = !draftResult.error && draftResult.data ? true : false
  const hasRegistration =
    !registrationResult.error && registrationResult.data ? true : false

  return {
    status: hasRegistration
      ? (registrationResult.data!.status as RegistrationStatus["status"])
      : "none",
    hasDraft,
    hasRegistration,
  }
}

export async function loadDraft(): Promise<LoadDraftResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("vendor_onboarding_drafts")
    .select("draft_data, current_step")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error loading draft:", error)
    return { success: false, error: error.message }
  }

  if (!data) {
    return { success: true, data: null }
  }

  try {
    const draftData = data.draft_data as OnboardingDraftData
    return {
      success: true,
      data: {
        ...draftData,
        currentStep: data.current_step,
      },
    }
  } catch {
    return { success: true, data: null }
  }
}

export async function saveDraft(
  draftData: OnboardingDraftData,
  currentStep: number
): Promise<SaveDraftResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("vendor_onboarding_drafts").upsert({
    user_id: user.id,
    draft_data: draftData,
    current_step: currentStep,
    last_saved_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error saving draft:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function uploadDocumentAction(
  file: File,
  documentType: string
): Promise<{ success: boolean; path?: string; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const result = await uploadDocument(file, user.id, documentType)

  if (!result) {
    return { success: false, error: "Gagal upload dokumen" }
  }

  return { success: true, path: result.path }
}

export async function submitOnboarding(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const payloadJson = formData.get("payload") as string
    const payload = JSON.parse(payloadJson) as OnboardingDraftData

    const adminClient = createAdminClient()
    const registrationId = randomUUID()

    const uploadPromises: Promise<void>[] = []
    const uploadResults: Record<string, string | null> = {}

    const documentTypes = [
      { key: "ktp", fileKey: "ktp_file", pathKey: "ktp_path" },
      { key: "npwp", fileKey: "npwp_file", pathKey: "npwp_path" },
      { key: "nib", fileKey: "nib_file", pathKey: "nib_path" },
      { key: "siup_sbu", fileKey: "siup_sbu_file", pathKey: "siup_sbu_path" },
      {
        key: "company_profile",
        fileKey: "company_profile_file",
        pathKey: "company_profile_path",
      },
    ]

    for (const docType of documentTypes) {
      const file = formData.get(docType.fileKey) as File | null
      if (file && file.size > 0) {
        uploadPromises.push(
          uploadDocument(file, user.id, docType.key).then((result) => {
            uploadResults[docType.pathKey] = result?.path || null
          })
        )
      }
    }

    await Promise.all(uploadPromises)

    const { error: registrationError } = await supabase
      .from("vendor_registrations")
      .insert({
        id: registrationId,
        user_id: user.id,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })

    if (registrationError) {
      console.error("Error creating registration:", registrationError)
      return { success: false, error: registrationError.message }
    }

    if (payload.company_info) {
      await supabase.from("vendor_contacts").insert(
        payload.company_info.contacts.map((contact) => ({
          user_id: user.id,
          sequence: contact.sequence,
          nama: contact.nama,
          no_hp: contact.no_hp,
          jabatan: contact.jabatan,
          is_primary: contact.sequence === 1,
        }))
      )
    }

    if (payload.documents) {
      const docsToInsert = []
      const docMappings = [
        {
          type: "ktp",
          path: uploadResults.ktp_path || payload.documents.ktp_path,
          number: payload.documents.ktp_number,
        },
        {
          type: "npwp",
          path: uploadResults.npwp_path || payload.documents.npwp_path,
          number: payload.documents.npwp_number,
        },
        {
          type: "nib",
          path: uploadResults.nib_path || payload.documents.nib_path,
          number: payload.documents.nib_number,
        },
        {
          type: "siup_sbu",
          path: uploadResults.siup_sbu_path || payload.documents.siup_sbu_path,
          number: null,
        },
        {
          type: "company_profile",
          path:
            uploadResults.company_profile_path ||
            payload.documents.company_profile_path,
          number: null,
        },
      ]

      for (const doc of docMappings) {
        if (doc.path) {
          docsToInsert.push({
            user_id: user.id,
            document_type: doc.type,
            document_number: doc.number,
            file_path: doc.path,
            file_name: doc.path.split("/").pop() || doc.type,
            uploaded_at: new Date().toISOString(),
          })
        }
      }

      if (docsToInsert.length > 0) {
        await supabase.from("vendor_documents").insert(docsToInsert)
      }
    }

    if (payload.operational?.factory_address) {
      await supabase.from("vendor_factory_addresses").insert({
        user_id: user.id,
        address: payload.operational.factory_address.address,
        province: payload.operational.factory_address.province,
        kabupaten: payload.operational.factory_address.kabupaten,
        kecamatan: payload.operational.factory_address.kecamatan,
        postal_code: payload.operational.factory_address.postal_code,
        is_primary: true,
      })
    }

    if (payload.operational?.bank_account) {
      await supabase.from("vendor_bank_accounts").insert({
        user_id: user.id,
        bank_name: payload.operational.bank_account.bank_name,
        account_number: payload.operational.bank_account.account_number,
        account_holder_name:
          payload.operational.bank_account.account_holder_name,
        is_primary: true,
      })
    }

    if (payload.operational?.products?.length) {
      await supabase.from("vendor_products").insert(
        payload.operational.products.map((p) => ({
          user_id: user.id,
          name: p.name,
          satuan: p.satuan,
          price: p.price,
          dimensions: p.dimensions,
          material: p.material,
          finishing: p.finishing,
          weight_kg: p.weight_kg,
          lead_time_days: p.lead_time_days,
          moq: p.moq,
        }))
      )
    }

    if (payload.operational?.delivery_areas?.length) {
      await supabase.from("vendor_delivery_areas").insert(
        payload.operational.delivery_areas.map((a) => ({
          user_id: user.id,
          province_id: a.province_id,
          province_name: a.province_name,
          city_id: a.city_id,
          city_name: a.city_name,
        }))
      )
    }

    if (payload.operational?.cost_inclusions) {
      const inclusions = payload.operational.cost_inclusions
      const inclusionTypes = [
        {
          key: "mobilisasi_demobilisasi",
          value: inclusions.mobilisasi_demobilisasi,
        },
        { key: "penginapan_tukang", value: inclusions.penginapan_tukang },
        { key: "biaya_pengiriman", value: inclusions.biaya_pengiriman },
        { key: "biaya_langsir", value: inclusions.biaya_langsir },
        { key: "instalasi", value: inclusions.instalasi },
        { key: "ppn", value: inclusions.ppn },
      ]

      await supabase.from("vendor_cost_inclusions").insert(
        inclusionTypes
          .filter((inc) => inc.value)
          .map((inc) => ({
            user_id: user.id,
            inclusion_type: inc.key,
            is_included: true,
          }))
      )
    }

    if (payload.operational?.additional_costs?.length) {
      await supabase.from("vendor_additional_costs").insert(
        payload.operational.additional_costs.map((c) => ({
          user_id: user.id,
          description: c.description,
          amount: c.amount,
          unit: c.unit,
        }))
      )
    }

    await supabase
      .from("vendor_onboarding_drafts")
      .delete()
      .eq("user_id", user.id)

    revalidatePath("/vendor/onboarding")
    revalidatePath("/vendor/dashboard")

    redirect("/vendor/dashboard")
  } catch (err) {
    const error = err as { message?: string; digest?: string }

    if (
      error.message === "NEXT_REDIRECT" ||
      error.digest?.includes("NEXT_REDIRECT")
    ) {
      throw err
    }

    console.error("Error submitting onboarding:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan",
    }
  }
}
