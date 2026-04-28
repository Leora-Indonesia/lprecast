import { z } from "zod"

export const PROJECT_ATTACHMENT_BUCKET = "project-attachments"
export const PROJECT_STATUS_OPTIONS = [
  "draft",
  "open",
  "in_progress",
  "completed",
  "cancelled",
] as const
export const MILESTONE_STATUS_OPTIONS = [
  "pending",
  "completed",
  "overdue",
] as const

const dateFieldSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
  .or(z.literal(""))

const contractValueSchema = z
  .string()
  .trim()
  .regex(/^\d*$/, "Nilai kontrak hanya boleh angka")
  .or(z.literal(""))

const numberStringSchema = z
  .string()
  .trim()
  .regex(/^\d*(\.\d+)?$/, "Nilai hanya boleh angka")
  .or(z.literal(""))

const projectBaseSchema = z.object({
  name: z.string().trim().min(1, "Nama project wajib diisi"),
  location: z.string().trim().min(1, "Lokasi wajib diisi"),
  start_date: dateFieldSchema,
  end_date: dateFieldSchema,
  client_profile_id: z.string().trim().optional().or(z.literal("")),
  customer_name: z.string().trim().min(1, "Nama customer wajib diisi"),
  contract_value: contractValueSchema,
  description: z.string().trim().optional().or(z.literal("")),
  site_address_full: z.string().trim().optional().or(z.literal("")),
  province_id: z.string().trim().optional().or(z.literal("")),
  city_id: z.string().trim().optional().or(z.literal("")),
  site_coordinates: z.string().trim().optional().or(z.literal("")),
  job_type: z.string().trim().optional().or(z.literal("")),
  estimated_length_or_area: numberStringSchema,
  measurement_unit: z.string().trim().optional().or(z.literal("")),
  estimated_height: z.string().trim().optional().or(z.literal("")),
  target_completion_date: dateFieldSchema,
  budget_min: numberStringSchema,
  budget_max: numberStringSchema,
  initial_description: z.string().trim().optional().or(z.literal("")),
  site_condition: z.string().trim().optional().or(z.literal("")),
  vehicle_access: z.string().trim().optional().or(z.literal("")),
  foundation_preference: z.string().trim().optional().or(z.literal("")),
  special_requirements: z.string().trim().optional().or(z.literal("")),
  qualification_status: z.string().trim().optional().or(z.literal("")),
  qualification_notes: z.string().trim().optional().or(z.literal("")),
  internal_notes: z.string().trim().optional().or(z.literal("")),
})

export const projectCreateSchema = z
  .object(projectBaseSchema.shape)
  .superRefine((values, ctx) => {
    if (
      values.start_date &&
      values.end_date &&
      values.start_date > values.end_date
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Tanggal selesai harus sama atau setelah tanggal mulai",
      })
    }

    const hasBudgetMin = values.budget_min.length > 0
    const hasBudgetMax = values.budget_max.length > 0

    if (hasBudgetMin !== hasBudgetMax) {
      ctx.addIssue({
        code: "custom",
        path: [hasBudgetMin ? "budget_max" : "budget_min"],
        message: "Budget minimum dan maksimum harus diisi berpasangan",
      })
    }

    if (hasBudgetMin && hasBudgetMax) {
      const min = Number(values.budget_min)
      const max = Number(values.budget_max)

      if (min > max) {
        ctx.addIssue({
          code: "custom",
          path: ["budget_max"],
          message: "Budget maksimum harus lebih besar atau sama dengan minimum",
        })
      }
    }
  })

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>

export const projectUpdateSchema = z
  .object(projectBaseSchema.partial().shape)
  .superRefine((values, ctx) => {
    if (
      values.start_date &&
      values.end_date &&
      values.start_date > values.end_date
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Tanggal selesai harus sama atau setelah tanggal mulai",
      })
    }

    const hasBudgetMin = typeof values.budget_min === "string" && values.budget_min.length > 0
    const hasBudgetMax = typeof values.budget_max === "string" && values.budget_max.length > 0

    if (hasBudgetMin !== hasBudgetMax) {
      ctx.addIssue({
        code: "custom",
        path: [hasBudgetMin ? "budget_max" : "budget_min"],
        message: "Budget minimum dan maksimum harus diisi berpasangan",
      })
    }

    if (hasBudgetMin && hasBudgetMax) {
      const min = Number(values.budget_min)
      const max = Number(values.budget_max)

      if (min > max) {
        ctx.addIssue({
          code: "custom",
          path: ["budget_max"],
          message: "Budget maksimum harus lebih besar atau sama dengan minimum",
        })
      }
    }
  })

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>

export const projectStatusSchema = z.enum(PROJECT_STATUS_OPTIONS)
export type ProjectStatusInput = z.infer<typeof projectStatusSchema>

export const projectMilestoneSchema = z.object({
  title: z.string().trim().min(1, "Judul milestone wajib diisi"),
  description: z.string().trim().optional().or(z.literal("")),
  due_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal target milestone wajib diisi"),
  status: z.enum(MILESTONE_STATUS_OPTIONS).default("pending"),
})

export const projectMilestoneUpdateSchema = projectMilestoneSchema.partial()

export type ProjectMilestoneInput = z.infer<typeof projectMilestoneSchema>
export type ProjectMilestoneUpdateInput = z.infer<
  typeof projectMilestoneUpdateSchema
>

export type ProjectAttachmentMetadata = {
  bucket: string
  path: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_at: string
}

export type ProjectFormSection =
  | "identity"
  | "location"
  | "scope"
  | "timeline-commercial"
  | "site-conditions"
  | "internal-review"
