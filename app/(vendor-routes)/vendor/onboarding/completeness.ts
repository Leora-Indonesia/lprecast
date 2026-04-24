import type { OnboardingDraftData } from "./types"

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

export function calculateOnboardingCompleteness(
  data: Partial<OnboardingDraftData> | null | undefined
): number {
  if (!data) return 0

  const checks: boolean[] = []

  const company = data.company_info
  checks.push(isNonEmptyString(company?.nama_perusahaan))
  checks.push(isNonEmptyString(company?.email))
  checks.push(isNonEmptyString(company?.nama_pic))
  checks.push(isNonEmptyString(company?.kontak_pic))

  const contacts = company?.contacts
  const hasTwoValidContacts =
    Array.isArray(contacts) &&
    contacts.filter(
      (c) =>
        isNonEmptyString(c?.nama) &&
        isNonEmptyString(c?.no_hp) &&
        isNonEmptyString(c?.jabatan)
    ).length >= 2
  checks.push(hasTwoValidContacts)

  const docs = data.documents
  checks.push(isNonEmptyString(docs?.ktp_path))
  checks.push(isNonEmptyString(docs?.npwp_path))
  checks.push(isNonEmptyString(docs?.npwp_number))
  checks.push(isNonEmptyString(docs?.nib_path))
  checks.push(isNonEmptyString(docs?.nib_number))
  checks.push(isNonEmptyString(docs?.siup_sbu_path))
  checks.push(isNonEmptyString(docs?.company_profile_path))

  const operational = data.operational
  const address = operational?.factory_address
  checks.push(isNonEmptyString(address?.address))
  checks.push(isNonEmptyString(address?.province))
  checks.push(isNonEmptyString(address?.kabupaten))
  checks.push(isNonEmptyString(address?.kecamatan))
  checks.push(isNonEmptyString(address?.postal_code))

  const bank = operational?.bank_account
  checks.push(isNonEmptyString(bank?.bank_name))
  checks.push(isNonEmptyString(bank?.account_number))
  checks.push(isNonEmptyString(bank?.account_holder_name))

  checks.push(
    Array.isArray(operational?.delivery_areas) &&
      operational.delivery_areas.length > 0
  )
  checks.push(
    Array.isArray(operational?.products) && operational.products.length > 0
  )

  const total = checks.length
  const completed = checks.filter(Boolean).length
  return Math.round((completed / total) * 100)
}
