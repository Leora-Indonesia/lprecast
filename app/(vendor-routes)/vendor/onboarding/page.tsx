import type { Metadata } from "next"
import { Loader2 } from "lucide-react"

import { getInitialOnboardingData } from "./queries"
import { OnboardingForm } from "./onboarding-form"

export const metadata: Metadata = {
  title: "Pendaftaran Vendor | LPrecast Vendor Portal",
  description:
    "Lengkapi data perusahaan dan dokumen legal untuk menjadi vendor LPrecast",
}

export default async function VendorOnboardingPage() {
  const { status, userData, draft } = await getInitialOnboardingData()

  if (
    status.hasRegistration &&
    status.status !== "draft" &&
    status.status !== "none"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <OnboardingForm
      userData={userData}
      draftData={draft.success ? (draft.data ?? null) : null}
    />
  )
}
