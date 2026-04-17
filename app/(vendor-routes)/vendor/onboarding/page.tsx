import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getInitialOnboardingData } from "./queries"
import { OnboardingForm } from "./onboarding-form"

export const metadata: Metadata = {
  title: "Pendaftaran Vendor | LPrecast Vendor Portal",
  description:
    "Lengkapi data perusahaan dan dokumen legal untuk menjadi vendor LPrecast",
}

export default async function VendorOnboardingPage() {
  let status, userData, draft

  try {
    const result = await getInitialOnboardingData()
    status = result.status
    userData = result.userData
    draft = result.draft
  } catch (error) {
    console.error("Error loading onboarding data:", error)
    throw new Error("Gagal memuat data registrasi")
  }

  if (status.hasRegistration) {
    const regStatus = status.registrationStatus

    if (regStatus === "draft" || regStatus === "revision_requested") {
      return (
        <OnboardingForm
          userData={userData}
          draftData={draft.success ? (draft.data ?? null) : null}
        />
      )
    }

    if (regStatus === "rejected") {
      redirect("/vendor/dashboard?message=rejected")
    }

    redirect("/vendor/dashboard")
  }

  return (
    <OnboardingForm
      userData={userData}
      draftData={draft.success ? (draft.data ?? null) : null}
    />
  )
}
