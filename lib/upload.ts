import { supabase } from "./supabase"

export interface UploadResult {
  url: string
  fileName: string
  fileSize: number
  mimeType: string
}

export async function uploadVendorDocument(
  file: File,
  registrationId: string,
  documentType: string
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${documentType}-${Date.now()}.${fileExt}`

  const filePath = `${registrationId}/${fileName}`

  const { data, error } = await supabase.storage
    .from("vendor-documents")
    .upload(filePath, file)

  if (error) {
    console.error(`Error uploading ${documentType}:`, error)
    throw new Error(`Gagal upload ${documentType}: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("vendor-documents").getPublicUrl(filePath)

  return {
    url: publicUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  }
}
