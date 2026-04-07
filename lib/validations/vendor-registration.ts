import { z } from "zod"

export const contactSchema = z.object({
  no_hp: z.string().min(1, "Nomor HP wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
})

export const companyInfoSchema = z.object({
  nama_perusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  nama_pic: z.string().min(1, "Nama PIC wajib diisi"),
  kontak_pic: z.string().min(1, "Kontak PIC wajib diisi"),
  website: z
    .string()
    .url("Format URL tidak valid")
    .optional()
    .or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  contacts: z.array(contactSchema).min(2, "Minimal 2 kontak diperlukan"),
})

export const legalDocumentSchema = z.object({
  ktp_file: z
    .any()
    .refine((val) => val instanceof File, { message: "KTP wajib diupload" }),
  npwp_nomor: z.string().optional().or(z.literal("")),
  npwp_file: z.instanceof(File).optional().nullable(),
  nib_nomor: z.string().optional().or(z.literal("")),
  nib_file: z.instanceof(File).optional().nullable(),
  siup_file: z.instanceof(File).optional().nullable(),
  compro_file: z.instanceof(File).optional().nullable(),
})

export const bankAccountSchema = z.object({
  bank_nama: z.string().min(1, "Nama bank wajib diisi"),
  bank_nomor: z.string().min(1, "Nomor rekening wajib diisi"),
  bank_atas_nama: z.string().min(1, "Atas nama wajib diisi"),
})

export const factoryAddressSchema = z.object({
  alamat_pabrik: z.string().min(1, "Alamat pabrik wajib diisi"),
})

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  price: z.number().min(0, "Harga harus positif"),
  dimensions: z.string().optional().or(z.literal("")),
  material: z.string().optional().or(z.literal("")),
  finishing: z.string().optional().or(z.literal("")),
  berat: z.number().optional(),
  lead_time_days: z.number().optional(),
  moq: z.number().optional(),
  description: z.string().optional().or(z.literal("")),
})

export const additionalCostSchema = z.object({
  description: z.string().min(1, "Keterangan wajib diisi"),
  amount: z.number().min(0, "Nilai harus positif"),
  unit: z.string().min(1, "Satuan wajib diisi"),
})

export const operationalSchema = z.object({
  bank: bankAccountSchema,
  factory_address: factoryAddressSchema,
  products: z.array(productSchema),
  delivery_areas: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      province: z.string(),
    })
  ),
  cost_inclusions: z.object({
    mobilisasi: z.boolean().default(false),
    penginapan: z.boolean().default(false),
    pengiriman: z.boolean().default(false),
    langsir: z.boolean().default(false),
    instalasi: z.boolean().default(false),
    ppn: z.boolean().default(false),
  }),
  additional_costs: z.array(additionalCostSchema),
})

export const reviewSchema = z.object({
  legal_agreement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui pernyataan legal",
  }),
  document_confirmation: z.boolean().optional(),
})

export const vendorRegistrationSchema = z.object({
  company_info: companyInfoSchema,
  legal_documents: legalDocumentSchema,
  operational: operationalSchema,
  review: reviewSchema,
})

export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>
export type LegalDocumentFormData = z.infer<typeof legalDocumentSchema>
export type BankAccountFormData = z.infer<typeof bankAccountSchema>
export type FactoryAddressFormData = z.infer<typeof factoryAddressSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type AdditionalCostFormData = z.infer<typeof additionalCostSchema>
export type OperationalFormData = z.infer<typeof operationalSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type VendorRegistrationFormData = z.infer<
  typeof vendorRegistrationSchema
>
