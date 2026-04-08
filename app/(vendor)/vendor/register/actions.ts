"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"

async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

export async function submitRegistration(formData: VendorRegistrationFormData) {
  try {
    const supabase = await getSupabaseServerClient()

    const registrationId = crypto.randomUUID()

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
        nama_perusahaan: formData.company_info.nama_perusahaan,
        email: formData.company_info.email,
        nama_pic: formData.company_info.nama_pic,
        kontak_pic: formData.company_info.kontak_pic,
        website: formData.company_info.website || null,
        instagram: formData.company_info.instagram || null,
        facebook: formData.company_info.facebook || null,
        linkedin: formData.company_info.linkedin || null,
      })

    if (companyError) {
      console.error("Error creating company info:", companyError)
      return { success: false, error: companyError.message }
    }

    const contacts = [
      { ...formData.company_info.contact_1, sequence: 1 },
      { ...formData.company_info.contact_2, sequence: 2 },
      formData.company_info.contact_3
        ? { ...formData.company_info.contact_3, sequence: 3 }
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
        file: formData.legal_documents.ktp_file,
        number: null,
      },
      {
        type: "npwp",
        file: formData.legal_documents.npwp_file,
        number: formData.legal_documents.npwp_nomor,
      },
      {
        type: "nib",
        file: formData.legal_documents.nib_file,
        number: formData.legal_documents.nib_nomor,
      },
      {
        type: "siup_sbu",
        file: formData.legal_documents.siup_file,
        number: null,
      },
      {
        type: "company_profile",
        file: formData.legal_documents.compro_file,
        number: null,
      },
    ]

    for (const doc of documents) {
      if (doc.file) {
        const filePath = `vendor-documents/${registrationId}/${doc.type}-${doc.file.name}`
        const { error: uploadError } = await supabase.storage
          .from("vendor-documents")
          .upload(filePath, doc.file)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("vendor-documents")
            .getPublicUrl(filePath)

          await supabase.from("vendor_legal_documents").insert({
            registration_id: registrationId,
            document_type: doc.type,
            document_number: doc.number,
            file_name: doc.file.name,
            file_path: urlData.publicUrl,
            file_size: doc.file.size,
            mime_type: doc.file.type,
          })
        }
      }
    }

    await supabase.from("vendor_bank_accounts").insert({
      registration_id: registrationId,
      bank_name: formData.operational.bank.bank_nama,
      account_number: formData.operational.bank.bank_nomor,
      account_holder_name: formData.operational.bank.bank_atas_nama,
      is_primary: true,
    })

    const factoryAddress = formData.operational.factory_address

    await supabase.from("vendor_factory_addresses").insert({
      registration_id: registrationId,
      address: factoryAddress.alamat_detail,
      province: factoryAddress.provinsi_name || "",
      kabupaten: factoryAddress.kabupaten_name || "",
      kecamatan: factoryAddress.kecamatan,
      postal_code: factoryAddress.kode_pos,
      is_primary: true,
    })

    for (const product of formData.operational.products) {
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

    for (const area of formData.operational.delivery_areas) {
      await supabase.from("vendor_delivery_areas").insert({
        registration_id: registrationId,
        province_id: area.province_id,
        city_id: area.city_id,
      })
    }

    const inclusions = formData.operational.cost_inclusions
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

    for (const cost of formData.operational.additional_costs) {
      if (cost.description) {
        await supabase.from("vendor_additional_costs").insert({
          registration_id: registrationId,
          description: cost.description,
          amount: cost.amount,
          unit: cost.unit,
        })
      }
    }

    revalidatePath("/vendor/register")

    return { success: true, data: { registrationId } }
  } catch (error) {
    console.error("Error submitting registration:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
