import type { Database } from "@/types/database.types"

type VendorProfileRow = Database["public"]["Tables"]["vendor_profiles"]["Row"]
type VendorContactRow = Database["public"]["Tables"]["vendor_contacts"]["Row"]
type VendorDocumentRow = Database["public"]["Tables"]["vendor_documents"]["Row"]
type VendorFactoryAddressRow =
  Database["public"]["Tables"]["vendor_factory_addresses"]["Row"]
type VendorBankAccountRow =
  Database["public"]["Tables"]["vendor_bank_accounts"]["Row"]

function isNonEmpty(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : value != null
}

export function calculateVendorProfileCompleteness(input: {
  profile: Pick<VendorProfileRow, "nama_perusahaan" | "email_perusahaan"> | null
  contacts: Pick<VendorContactRow, "nama" | "no_hp" | "jabatan">[] | null
  documents:
    | Pick<VendorDocumentRow, "document_type" | "document_number" | "file_path">[]
    | null
  factoryAddress: Pick<
    VendorFactoryAddressRow,
    "address" | "province" | "kabupaten" | "kecamatan" | "postal_code"
  > | null
  bankAccount: Pick<
    VendorBankAccountRow,
    "bank_name" | "account_number" | "account_holder_name"
  > | null
  deliveryAreasCount: number
  productsCount: number
}): number {
  const checks: boolean[] = []

  checks.push(isNonEmpty(input.profile?.nama_perusahaan))
  checks.push(isNonEmpty(input.profile?.email_perusahaan))

  const validContacts = (input.contacts ?? []).filter(
    (c) => isNonEmpty(c.nama) && isNonEmpty(c.no_hp) && isNonEmpty(c.jabatan)
  )
  checks.push(validContacts.length >= 2)

  const docs = input.documents ?? []
  const hasDoc = (type: VendorDocumentRow["document_type"]) =>
    docs.some((d) => d.document_type === type && isNonEmpty(d.file_path))
  const hasDocWithNumber = (type: VendorDocumentRow["document_type"]) =>
    docs.some(
      (d) =>
        d.document_type === type &&
        isNonEmpty(d.file_path) &&
        isNonEmpty(d.document_number)
    )

  checks.push(hasDoc("ktp"))
  checks.push(hasDocWithNumber("npwp"))
  checks.push(hasDocWithNumber("nib"))
  checks.push(hasDoc("siup_sbu"))
  checks.push(hasDoc("company_profile"))

  checks.push(isNonEmpty(input.factoryAddress?.address))
  checks.push(isNonEmpty(input.factoryAddress?.province))
  checks.push(isNonEmpty(input.factoryAddress?.kabupaten))
  checks.push(isNonEmpty(input.factoryAddress?.kecamatan))
  checks.push(isNonEmpty(input.factoryAddress?.postal_code))

  checks.push(isNonEmpty(input.bankAccount?.bank_name))
  checks.push(isNonEmpty(input.bankAccount?.account_number))
  checks.push(isNonEmpty(input.bankAccount?.account_holder_name))

  checks.push(input.deliveryAreasCount > 0)
  checks.push(input.productsCount > 0)

  const total = checks.length
  const completed = checks.filter(Boolean).length
  return Math.round((completed / total) * 100)
}
