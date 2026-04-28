import { redirect } from "next/navigation"

import { ClientProjectIntakeForm } from "@/components/client/client-project-intake-form"
import { getClientProfileContext, listProvinceOptions } from "@/lib/client/repository"

export default async function ClientProjectNewPage() {
  const [context, provinces] = await Promise.all([
    getClientProfileContext(),
    listProvinceOptions(),
  ])

  if (!context) {
    return null
  }

  if (!context.profile) {
    redirect("/client/profile")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ajukan Project Baru</h1>
        <p className="text-muted-foreground">
          Isi kebutuhan awal project. Tim internal akan review dan melengkapi data operasional berikutnya.
        </p>
      </div>

      <ClientProjectIntakeForm
        account={context.account}
        profile={context.profile}
        provinces={provinces}
      />
    </div>
  )
}
