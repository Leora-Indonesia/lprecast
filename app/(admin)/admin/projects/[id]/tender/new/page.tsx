import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { TenderPublishForm } from "@/components/admin/tenders/tender-publish-form"
import { Button } from "@/components/ui/button"
import { getProjectDetail } from "@/lib/projects/repository"
import { getActiveTenderForProject } from "@/lib/tenders/repository"

export const metadata = {
  title: "Ajukan Project ke Tender | Admin LPrecast",
  description: "Publish tender dari project draft ke vendor",
}

export default async function AdminProjectTenderCreatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectDetail(id)

  if (!project) {
    notFound()
  }

  const activeTender = await getActiveTenderForProject(id)
  if (activeTender) {
    redirect(`/admin/tenders/${activeTender.id}`)
  }

  if (project.status !== "draft") {
    redirect(`/admin/projects/${project.id}`)
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
          <h1 className="text-2xl font-bold">Ajukan Project ke Tender</h1>
          <p className="text-muted-foreground">
            Review data aman vendor, lengkapi metadata tender, lalu publish langsung ke vendor.
          </p>
        </div>
      </div>

      <TenderPublishForm project={project} />
    </div>
  )
}
