"use server"

import { revalidatePath } from "next/cache"

import { publishTenderFromProject } from "@/lib/tenders/repository"
import { tenderPublishSchema } from "@/lib/validations/tender"

function readTenderFormData(formData: FormData) {
  const names = formData.getAll("item_name")
  const quantities = formData.getAll("item_quantity")
  const units = formData.getAll("item_unit")
  const descriptions = formData.getAll("item_description")

  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    min_vendors: formData.get("min_vendors") as string,
    submission_deadline_at: formData.get("submission_deadline_at") as string,
    revision_deadline_hours: formData.get("revision_deadline_hours") as string,
    items: names.map((name, index) => ({
      name: String(name),
      quantity: String(quantities[index] ?? ""),
      unit: String(units[index] ?? ""),
      description: String(descriptions[index] ?? ""),
    })),
  }
}

export async function publishProjectTenderAction(projectId: string, formData: FormData) {
  const rawData = readTenderFormData(formData)
  const parsed = tenderPublishSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message || "Validasi tender gagal",
    }
  }

  const result = await publishTenderFromProject(projectId, parsed.data)

  if (result.success) {
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath("/admin/tenders")
    revalidatePath(`/admin/tenders/${result.tenderId}`)
  }

  return result
}
