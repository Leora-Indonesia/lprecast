import { z } from "zod"

const positiveNumberStringSchema = z
  .string()
  .trim()
  .min(1, "Quantity wajib diisi")
  .regex(/^\d+(\.\d+)?$/, "Quantity hanya boleh angka")
  .refine((value) => Number(value) > 0, "Quantity harus lebih dari 0")

const optionalNumberStringSchema = z
  .string()
  .trim()
  .regex(/^\d*$/, "Nilai hanya boleh angka")
  .or(z.literal(""))

const optionalDateTimeStringSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || !Number.isNaN(new Date(value).getTime()),
    "Format deadline submit tidak valid"
  )
  .refine(
    (value) => value === "" || new Date(value).getTime() > Date.now(),
    "Deadline submit harus di masa depan"
  )

export const tenderItemInputSchema = z.object({
  name: z.string().trim().min(1, "Nama item wajib diisi"),
  quantity: positiveNumberStringSchema,
  unit: z.string().trim().min(1, "Unit wajib diisi"),
  description: z.string().trim().optional().or(z.literal("")),
})

export const tenderPublishSchema = z.object({
  title: z.string().trim().min(1, "Judul tender wajib diisi"),
  description: z.string().trim().optional().or(z.literal("")),
  min_vendors: optionalNumberStringSchema.refine(
    (value) => value === "" || Number(value) >= 2,
    "Minimal vendor submit adalah 2"
  ),
  submission_deadline_at: optionalDateTimeStringSchema,
  revision_deadline_hours: optionalNumberStringSchema,
  items: z.array(tenderItemInputSchema).min(1, "Minimal satu item pekerjaan wajib ada"),
})

export type TenderPublishInput = z.infer<typeof tenderPublishSchema>
export type TenderItemInput = z.infer<typeof tenderItemInputSchema>
