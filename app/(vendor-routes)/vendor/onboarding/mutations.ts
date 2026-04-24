"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { OnboardingDraftData, SaveDraftResult } from "./types"
import { submitPayloadSchema } from "./types"
import { calculateOnboardingCompleteness } from "./completeness"

type DraftDocumentType = "ktp" | "npwp" | "nib" | "siup_sbu" | "company_profile"

async function uploadDraftFile(
  adminClient: ReturnType<typeof createAdminClient>,
  userId: string,
  documentType: DraftDocumentType,
  file: File
): Promise<string | null> {
  const fileExt = file.name.split(".").pop() || "pdf"
  const fileName = `${documentType}-${Date.now()}.${fileExt}`
  const filePath = `${userId}/drafts/${documentType}/${fileName}`

  const arrayBuffer = await file.arrayBuffer()

  const { error } = await adminClient.storage
    .from("vendor-documents")
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    })

  if (error) {
    console.error(`Upload error for ${documentType}:`, error)
    return null
  }

  const { data: urlData } = adminClient.storage
    .from("vendor-documents")
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

export async function saveDraft(
  draftData: OnboardingDraftData,
  currentStep: number,
  files?: Map<string, File>
): Promise<SaveDraftResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const updatedDraftData = { ...draftData }
  const adminClient = createAdminClient()

  if (files && files.size > 0) {
    const documentMapping: Record<string, DraftDocumentType> = {
      ktp_file: "ktp",
      npwp_file: "npwp",
      nib_file: "nib",
      siup_file: "siup_sbu",
      compro_file: "company_profile",
    }

    for (const [fileKey, file] of files) {
      const docType = documentMapping[fileKey]
      if (docType) {
        const uploadedUrl = await uploadDraftFile(
          adminClient,
          user.id,
          docType,
          file
        )
        if (uploadedUrl) {
          const pathKey =
            `${docType}_path` as keyof typeof updatedDraftData.documents
          ;(updatedDraftData.documents as Record<string, string | null>)[
            pathKey
          ] = uploadedUrl
        }
      }
    }
  }

  const { error } = await supabase.from("vendor_onboarding_drafts").upsert(
    {
      user_id: user.id,
      draft_data: updatedDraftData,
      current_step: currentStep,
      last_saved_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) {
    console.error("Error saving draft:", error)
    return { success: false, error: error.message }
  }

  const completion = calculateOnboardingCompleteness(updatedDraftData)
  const { error: profileError } = await supabase
    .from("vendor_profiles")
    .update({ profile_completeness_pct: completion })
    .eq("user_id", user.id)

  if (profileError) {
    console.error("Error updating profile completion:", profileError)
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

  try {
    const adminClient = createAdminClient()
    const fileExt = file.name.split(".").pop() || "pdf"
    const fileName = `${documentType}-${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${documentType}/${fileName}`
    const arrayBuffer = await file.arrayBuffer()

    const { error } = await adminClient.storage
      .from("vendor-documents")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error(`Upload error for ${documentType}:`, error)
      return { success: false, error: `Gagal upload ${documentType}` }
    }

    const { data: urlData } = adminClient.storage
      .from("vendor-documents")
      .getPublicUrl(filePath)

    return { success: true, path: urlData.publicUrl }
  } catch (err) {
    console.error(`Upload error for ${documentType}:`, err)
    return { success: false, error: `Gagal upload ${documentType}` }
  }
}

export async function submitOnboarding(
  formData: FormData
): Promise<{ success: boolean; redirectTo?: string; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const payloadJson = formData.get("payload") as string
    if (!payloadJson) {
      return { success: false, error: "Payload tidak ditemukan" }
    }

    let rawPayload: unknown
    try {
      rawPayload = JSON.parse(payloadJson)
    } catch {
      return { success: false, error: "Format payload tidak valid" }
    }

    const parseResult = submitPayloadSchema.safeParse(rawPayload)
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]
      return {
        success: false,
        error: firstError
          ? `${firstError.path.join(".")}: ${firstError.message}`
          : "Data tidak valid",
      }
    }

    const payload = parseResult.data

    const adminClient = createAdminClient()
    const uploadedPaths: Record<string, string> = {}

    const documentTypes = [
      { key: "ktp", fileKey: "ktp_file", pathKey: "ktp_path" as const },
      { key: "npwp", fileKey: "npwp_file", pathKey: "npwp_path" as const },
      { key: "nib", fileKey: "nib_file", pathKey: "nib_path" as const },
      {
        key: "siup_sbu",
        fileKey: "siup_file",
        pathKey: "siup_sbu_path" as const,
      },
      {
        key: "company_profile",
        fileKey: "compro_file",
        pathKey: "company_profile_path" as const,
      },
    ]

    for (const docType of documentTypes) {
      const file = formData.get(docType.fileKey) as File | null
      if (file && file.size > 0) {
        const fileExt = file.name.split(".").pop() || "pdf"
        const fileName = `${docType.key}-${Date.now()}.${fileExt}`
        const filePath = `${user.id}/${docType.key}/${fileName}`

        const arrayBuffer = await file.arrayBuffer()
        const { error } = await adminClient.storage
          .from("vendor-documents")
          .upload(filePath, arrayBuffer, {
            contentType: file.type,
            upsert: false,
          })

        if (error) {
          console.error(`Upload error for ${docType.key}:`, error)
          await cleanupUploadedFiles(Object.values(uploadedPaths), adminClient)
          return {
            success: false,
            error: `Gagal upload dokumen ${docType.key}`,
          }
        }

        uploadedPaths[docType.key] = filePath
      }
    }

    const created = { profile: false }

    try {
      const completion = calculateOnboardingCompleteness(
        payload as unknown as Partial<OnboardingDraftData>
      )

      const { error: profileError } = await supabase
        .from("vendor_profiles")
        .upsert(
          {
            user_id: user.id,
            nama_perusahaan: payload.company_info.nama_perusahaan,
            email_perusahaan: payload.company_info.email,
            website: payload.company_info.website || null,
            instagram: payload.company_info.instagram || null,
            facebook: payload.company_info.facebook || null,
            linkedin: payload.company_info.linkedin || null,
            registration_status: "submitted",
            status: "active",
            submitted_at: new Date().toISOString(),
            profile_completeness_pct: completion,
          },
          { onConflict: "user_id" }
        )

      if (profileError) {
        throw new Error(`vendor_profiles: ${profileError.message}`)
      }
      created.profile = true

      // Update user's PIC data
      const { error: userError } = await supabase
        .from("users")
        .update({
          nama: payload.company_info.nama_pic,
          no_hp: payload.company_info.kontak_pic,
        })
        .eq("id", user.id)

      if (userError) {
        throw new Error(`users: ${userError.message}`)
      }

      if (payload.company_info.contacts.length > 0) {
        const { error: contactsError } = await supabase
          .from("vendor_contacts")
          .insert(
            payload.company_info.contacts.map((contact) => ({
              user_id: user.id,
              sequence: contact.sequence,
              nama: contact.nama,
              no_hp: contact.no_hp,
              jabatan: contact.jabatan,
              is_primary: contact.sequence === 1,
            }))
          )
        if (contactsError) {
          throw new Error(`vendor_contacts: ${contactsError.message}`)
        }
      }

      const docsToInsert = [
        {
          type: "ktp",
          path: uploadedPaths.ktp || payload.documents.ktp_path || null,
          number: payload.documents.ktp_number,
        },
        {
          type: "npwp",
          path: uploadedPaths.npwp || payload.documents.npwp_path || null,
          number: payload.documents.npwp_number,
        },
        {
          type: "nib",
          path: uploadedPaths.nib || payload.documents.nib_path || null,
          number: payload.documents.nib_number,
        },
        {
          type: "siup_sbu",
          path:
            uploadedPaths.siup_sbu || payload.documents.siup_sbu_path || null,
          number: null,
        },
        {
          type: "company_profile",
          path:
            uploadedPaths.company_profile ||
            payload.documents.company_profile_path ||
            null,
          number: null,
        },
      ].filter((doc) => doc.path)

      if (docsToInsert.length > 0) {
        const { error: docsError } = await supabase
          .from("vendor_documents")
          .insert(
            docsToInsert.map((doc) => ({
              user_id: user.id,
              document_type: doc.type,
              document_number: doc.number,
              file_path: doc.path!,
              file_name: doc.path!.split("/").pop() || doc.type,
              uploaded_at: new Date().toISOString(),
            }))
          )
        if (docsError) {
          throw new Error(`vendor_documents: ${docsError.message}`)
        }
      }

      const { error: addressError } = await supabase
        .from("vendor_factory_addresses")
        .insert({
          user_id: user.id,
          address: payload.operational.factory_address.address,
          province: payload.operational.factory_address.province,
          kabupaten: payload.operational.factory_address.kabupaten,
          kecamatan: payload.operational.factory_address.kecamatan,
          postal_code: payload.operational.factory_address.postal_code,
          is_primary: true,
        })

      if (addressError) {
        throw new Error(`vendor_factory_addresses: ${addressError.message}`)
      }

      const { error: bankError } = await supabase
        .from("vendor_bank_accounts")
        .insert({
          user_id: user.id,
          bank_name: payload.operational.bank_account.bank_name,
          account_number: payload.operational.bank_account.account_number,
          account_holder_name:
            payload.operational.bank_account.account_holder_name,
          is_primary: true,
        })

      if (bankError) {
        throw new Error(`vendor_bank_accounts: ${bankError.message}`)
      }

      if (payload.operational.products.length > 0) {
        const { error: productsError } = await supabase
          .from("vendor_products")
          .insert(
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
        if (productsError) {
          throw new Error(`vendor_products: ${productsError.message}`)
        }
      }

      if (payload.operational.delivery_areas.length > 0) {
        const { error: areasError } = await supabase
          .from("vendor_delivery_areas")
          .insert(
            payload.operational.delivery_areas.map((a) => ({
              user_id: user.id,
              province_id: a.province_id,
              city_id: a.city_id,
            }))
          )
        if (areasError) {
          throw new Error(`vendor_delivery_areas: ${areasError.message}`)
        }
      }

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

      if (inclusionTypes.some((inc) => inc.value)) {
        const { error: inclusionsError } = await supabase
          .from("vendor_cost_inclusions")
          .insert(
            inclusionTypes
              .filter((inc) => inc.value)
              .map((inc) => ({
                user_id: user.id,
                inclusion_type: inc.key,
                is_included: true,
              }))
          )
        if (inclusionsError) {
          throw new Error(`vendor_cost_inclusions: ${inclusionsError.message}`)
        }
      }

      if (payload.operational.additional_costs.length > 0) {
        const { error: costsError } = await supabase
          .from("vendor_additional_costs")
          .insert(
            payload.operational.additional_costs.map((c) => ({
              user_id: user.id,
              description: c.description,
              amount: c.amount,
              unit: c.unit,
            }))
          )
        if (costsError) {
          throw new Error(`vendor_additional_costs: ${costsError.message}`)
        }
      }
    } catch (dbErr) {
      console.error("Database insert error:", dbErr)
      await rollbackInserts(supabase, user.id, created)
      await cleanupUploadedFiles(uploadedPaths, adminClient)
      const msg =
        dbErr instanceof Error ? dbErr.message : "Gagal menyimpan data"
      return { success: false, error: msg }
    }

    revalidatePath("/vendor/onboarding")
    revalidatePath("/vendor/dashboard")

    return { success: true, redirectTo: "/vendor/dashboard" }
  } catch (err) {
    const error = err as { message?: string; digest?: string }

    if (
      error.message === "NEXT_REDIRECT" ||
      error.digest?.includes("NEXT_REDIRECT")
    ) {
      return { success: true, redirectTo: "/vendor/dashboard" }
    }

    console.error("Error submitting onboarding:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan",
    }
  }
}

async function cleanupUploadedFiles(
  paths: string[] | Record<string, string>,
  adminClient: ReturnType<typeof createAdminClient>
) {
  const pathsArray = Array.isArray(paths) ? paths : Object.values(paths)
  for (const path of pathsArray) {
    try {
      await adminClient.storage.from("vendor-documents").remove([path])
    } catch (cleanupErr) {
      console.error(`Failed to cleanup file ${path}:`, cleanupErr)
    }
  }
}

async function rollbackInserts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  created: { profile: boolean }
) {
  try {
    const tables = [
      "vendor_additional_costs",
      "vendor_cost_inclusions",
      "vendor_delivery_areas",
      "vendor_products",
      "vendor_bank_accounts",
      "vendor_factory_addresses",
      "vendor_documents",
      "vendor_contacts",
    ]

    for (const table of tables) {
      await supabase.from(table).delete().eq("user_id", userId)
    }

    if (created.profile) {
      await supabase.from("vendor_profiles").delete().eq("user_id", userId)
    }
  } catch (rollbackErr) {
    console.error("Rollback error:", rollbackErr)
  }
}
