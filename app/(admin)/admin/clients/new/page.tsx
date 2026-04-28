import { ClientForm } from "@/components/admin/client-form"
import { listProvinceOptions, listCityOptions } from "@/lib/client/repository"

export const metadata = {
  title: "Tambah Klien | Admin LPrecast",
  description: "Tambah klien baru ke sistem",
}

export default async function NewClientPage() {
  const [provinces, cities] = await Promise.all([listProvinceOptions(), listCityOptions()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Klien</h1>
        <p className="text-muted-foreground">Tambah data klien baru ke sistem</p>
      </div>

      <div className="max-w-2xl">
        <ClientForm provinces={provinces} cities={cities} />
      </div>
    </div>
  )
}