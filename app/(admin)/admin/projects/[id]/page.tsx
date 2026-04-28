import { notFound } from "next/navigation"

import { ProjectDetail } from "@/components/admin/projects/project-detail"
import { getProjectDetail } from "@/lib/projects/repository"

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectDetail(id)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
