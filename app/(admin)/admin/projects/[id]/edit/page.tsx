import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { ProjectForm } from "@/components/admin/project-form"
import { ProjectStatusManager } from "@/components/admin/projects/project-status"
import { Button } from "@/components/ui/button"
import { getProjectDetail, listCityOptions, listProvinceOptions } from "@/lib/projects/repository"
import { listClients } from "@/lib/client/repository"

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [project, { clients }, provinces, cities] = await Promise.all([
    getProjectDetail(id),
    listClients({ limit: 100 }),
    listProvinceOptions(),
    listCityOptions(),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/projects/${project.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke detail project
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">
            Perbarui data utama project. Status bisa diubah dari halaman ini, sedangkan lampiran dan milestone tetap tampil read-only di detail.
          </p>
        </div>
      </div>

      <ProjectStatusManager projectId={project.id} status={project.status} />

      <ProjectForm
        mode="edit"
        projectId={project.id}
        initialValues={{
          name: project.name,
          location: project.location ?? "",
          start_date: project.start_date ?? "",
          end_date: project.end_date ?? "",
          customer_name: project.customer_name ?? "",
          contract_value: String(project.contract_value ?? 0),
          description: project.description ?? "",
          client_profile_id: project.client_profile_id ?? "",
          site_address_full: project.site_address_full ?? "",
          province_id: project.province_id ?? "",
          city_id: project.city_id ?? "",
          site_coordinates: project.site_coordinates ?? "",
          job_type: project.job_type ?? "",
          estimated_length_or_area:
            project.estimated_length_or_area != null ? String(project.estimated_length_or_area) : "",
          measurement_unit: project.measurement_unit ?? "",
          estimated_height: project.estimated_height ?? "",
          target_completion_date: project.target_completion_date ?? "",
          budget_min: project.budget_min != null ? String(project.budget_min) : "",
          budget_max: project.budget_max != null ? String(project.budget_max) : "",
          initial_description: project.initial_description ?? "",
          site_condition: project.site_condition ?? "",
          vehicle_access: project.vehicle_access ?? "",
          foundation_preference: project.foundation_preference ?? "",
          special_requirements: project.special_requirements ?? "",
          qualification_status: project.qualification_status ?? "",
          qualification_notes: project.qualification_notes ?? "",
          internal_notes: project.internal_notes ?? "",
        }}
        clientOptions={clients}
        provinceOptions={provinces}
        cityOptions={cities}
      />
    </div>
  )
}
