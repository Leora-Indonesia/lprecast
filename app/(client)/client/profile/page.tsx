import { ClientProfileForm } from "@/components/client/client-profile-form"
import { getClientProfileContext, listProvinceOptions } from "@/lib/client/repository"

export default async function ClientProfilePage() {
  const [context, provinces] = await Promise.all([
    getClientProfileContext(),
    listProvinceOptions(),
  ])

  if (!context) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Client</h1>
        <p className="text-muted-foreground">
          Lengkapi data perusahaan dan PIC agar tim internal punya identitas client yang lengkap.
        </p>
      </div>

      <ClientProfileForm
        account={context.account}
        initialProfile={context.profile}
        provinces={provinces}
      />
    </div>
  )
}
