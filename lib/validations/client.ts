import { z } from "zod"

const numericStringSchema = z
  .string()
  .trim()
  .regex(/^\d*(\.\d+)?$/, "Nilai harus berupa angka")
  .or(z.literal(""))

const dateFieldSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid")
  .or(z.literal(""))

export const clientTypeOptions = [
  "individu",
  "developer",
  "kontraktor",
  "perusahaan",
] as const

export const clientProfileSchema = z.object({
  client_type: z.enum(clientTypeOptions, {
    message: "Tipe client wajib dipilih",
  }),
  company_name_legal: z.string().trim().optional().or(z.literal("")),
  pic_name: z.string().trim().min(1, "Nama PIC wajib diisi"),
  pic_position: z.string().trim().optional().or(z.literal("")),
  office_address: z.string().trim().min(1, "Alamat kantor wajib diisi"),
  province_id: z.string().trim().min(1, "Provinsi wajib dipilih"),
  city_id: z.string().trim().min(1, "Kota / kabupaten wajib dipilih"),
})

export type ClientProfileInput = z.infer<typeof clientProfileSchema>

export const adminClientProfileSchema = z.object({
  client_name: z.string().trim().min(1, "Nama client wajib diisi"),
  email: z.string().trim().email("Email client tidak valid"),
  phone: z.string().trim().min(1, "No. WhatsApp client wajib diisi"),
  client_type: z.enum(clientTypeOptions, {
    message: "Tipe client wajib dipilih",
  }),
  company_name_legal: z.string().trim().optional().or(z.literal("")),
  pic_name: z.string().trim().min(1, "Nama PIC wajib diisi"),
  pic_position: z.string().trim().optional().or(z.literal("")),
  office_address: z.string().trim().min(1, "Alamat kantor wajib diisi"),
  province_id: z.string().trim().min(1, "Provinsi wajib dipilih"),
  city_id: z.string().trim().min(1, "Kota / kabupaten wajib dipilih"),
  verification_status: z.string().trim().optional().or(z.literal("")),
  verification_notes: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
})

export type AdminClientProfileInput = z.infer<typeof adminClientProfileSchema>

export const clientProjectIntakeSchema = z.object({
  project_title: z.string().trim().min(1, "Judul project wajib diisi"),
  site_address_full: z.string().trim().min(1, "Alamat proyek wajib diisi"),
  province_id: z.string().trim().min(1, "Provinsi proyek wajib dipilih"),
  city_id: z.string().trim().min(1, "Kota / kabupaten proyek wajib dipilih"),
  site_coordinates: z.string().trim().optional().or(z.literal("")),
  job_type: z.string().trim().min(1, "Jenis pekerjaan wajib diisi"),
  estimated_length_or_area: numericStringSchema.refine((value) => value.length > 0, {
    message: "Estimasi panjang / luas wajib diisi",
  }),
  measurement_unit: z.string().trim().min(1, "Satuan wajib diisi"),
  target_completion_date: dateFieldSchema.refine((value) => value.length > 0, {
    message: "Target waktu pengerjaan wajib diisi",
  }),
  budget_min: numericStringSchema,
  budget_max: numericStringSchema,
  initial_description: z.string().trim().min(1, "Deskripsi kebutuhan awal wajib diisi"),
  site_condition: z.string().trim().optional().or(z.literal("")),
  vehicle_access: z.string().trim().optional().or(z.literal("")),
  special_requirements: z.string().trim().optional().or(z.literal("")),
  estimated_height: z.string().trim().optional().or(z.literal("")),
  foundation_preference: z.string().trim().optional().or(z.literal("")),
}).superRefine((values, ctx) => {
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

export type ClientProjectIntakeInput = z.infer<typeof clientProjectIntakeSchema>
