import { z } from "zod"

export const PROJECT_ATTACHMENT_BUCKET = "project-attachments"

const dateFieldSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
  .or(z.literal(""))

export const projectCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Nama project wajib diisi"),
    location: z.string().trim().min(1, "Lokasi wajib diisi"),
    start_date: dateFieldSchema,
    end_date: dateFieldSchema,
    description: z.string().trim().optional().or(z.literal("")),
  })
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
  })

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>

export type ProjectAttachmentMetadata = {
  bucket: string
  path: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_at: string
}
