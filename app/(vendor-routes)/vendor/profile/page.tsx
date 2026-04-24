export const metadata = {
  title: "Profil Vendor | LPrecast",
  description: "Kelola informasi profil dan dokumen vendor",
}

// Uses Supabase auth cookies.
export const dynamic = "force-dynamic"

import { getInitialOnboardingData } from "@/app/(vendor-routes)/vendor/onboarding/queries"
import { VendorProfileForm } from "./profile-form"

export default async function VendorProfilePage() {
  const { userData, draft } = await getInitialOnboardingData()

  return (
    <VendorProfileForm
      userData={userData}
      draftData={draft.success ? (draft.data ?? null) : null}
    />
  )
}
