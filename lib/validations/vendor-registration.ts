import { z } from "zod"

// ==================================================
// HELPER VALIDATIONS
// ==================================================

// Validasi nomor HP Indonesia (fleksibel: 08xxx, 62xxx, +62xxx)
const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/
const validatePhone = (value: string) =>
  phoneRegex.test(value.replace(/[\s-]/g, ""))

const maxFileSize = 5 * 1024 * 1024 // 5MB
const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"]

const validateFileSize = (file: File | undefined) =>
  !file || file.size <= maxFileSize

const validateFileType = (file: File | undefined) =>
  !file || allowedFileTypes.includes(file.type)

// Required file validation - file MUST be present and valid
// Type is File | undefined to match form default values, refine enforces presence
const requiredFileValidation = z
  .file()
  .optional()
  .refine((file) => file instanceof File && file.size > 0, {
    message: "File wajib diupload",
  })
  .refine(validateFileSize, { message: "File maksimal 5MB" })
  .refine(validateFileType, { message: "Format file harus JPG, PNG, atau PDF" })

// Optional file validation - file can be undefined or null
const optionalFileValidation = z
  .file()
  .optional()
  .nullable()
  .refine((file) => !file || file.size <= maxFileSize, {
    message: "File maksimal 5MB",
  })
  .refine((file) => !file || allowedFileTypes.includes(file.type), {
    message: "Format file harus JPG, PNG, atau PDF",
  })

// Validasi NPWP (16 digit angka tanpa titik)
const npwpRegex = /^\d{16}$/

// Validasi NIB (13 digit angka)
const nibRegex = /^\d{13}$/

// Validasi nomor rekening (hanya angka,10-16 digit)
const accountNumberRegex = /^\d{10,16}$/

// ==================================================
// CONTACT SCHEMAS
// ==================================================

// Contact 1 & 2 - semua field required
export const contactSchema = z.object({
  no_hp: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .refine((val) => validatePhone(val), {
      message:
        "Format nomor HP tidak valid. Gunakan format 08xx, 62xx, atau +62xx",
    }),
  nama: z.string().min(1, "Nama wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
})

// Contact 3 - conditional validation (semua field harus diisi jika salah satu diisi)
export const optionalContactSchema = z
  .object({
    no_hp: z.string().optional(),
    nama: z.string().optional(),
    jabatan: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasData = data.no_hp || data.nama || data.jabatan
      if (!hasData) return true // Boleh kosong semua
      // Jika ada salah satu field yang diisi, semua field harus diisi
      return !!(data.no_hp && data.nama && data.jabatan)
    },
    {
      message:
        "Jika mengisi kontak 3, semua field (nomor HP, nama, jabatan) wajib diisi",
      path: ["no_hp"],
    }
  )
  .superRefine((data, ctx) => {
    // Validasi format nomor HP jika ada
    if (data.no_hp && !validatePhone(data.no_hp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Format nomor HP tidak valid. Gunakan format 08xx, 62xx, atau +62xx",
        path: ["no_hp"],
      })
    }
  })

// ==================================================
// COMPANY INFO SCHEMA
// ==================================================

export const companyInfoSchema = z.object({
  nama_perusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  nama_pic: z.string().min(1, "Nama PIC wajib diisi"),
  kontak_pic: z
    .string()
    .min(1, "Nomor HP PIC wajib diisi")
    .refine((val) => validatePhone(val), {
      message:
        "Format nomor HP tidak valid. Gunakan format 08xx, 62xx, atau +62xx",
    }),
  website: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^https?:\/\/.+/.test(val) ||
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(val),
      { message: "Format URL tidak valid" }
    ),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  contact_1: contactSchema,
  contact_2: contactSchema,
  contact_3: optionalContactSchema,
})

// ==================================================
// LEGAL DOCUMENTS SCHEMA
// ==================================================

export const legalDocumentSchema = z.object({
  ktp_file: requiredFileValidation,
  npwp_nomor: z
    .string()
    .optional()
    .refine((val) => !val || npwpRegex.test(val), {
      message: "NPWP harus 16 digit angka tanpa titik atau spasi",
    }),
  npwp_file: optionalFileValidation,
  nib_nomor: z
    .string()
    .optional()
    .refine((val) => !val || nibRegex.test(val), {
      message: "NIB harus 13 digit angka",
    }),
  nib_file: optionalFileValidation,
  siup_file: optionalFileValidation,
  compro_file: optionalFileValidation,
})

// ==================================================
// BANK ACCOUNT SCHEMA
// ==================================================

export const bankAccountSchema = z.object({
  bank_nama: z.string().min(1, "Nama bank wajib diisi"),
  bank_nomor: z
    .string()
    .min(1, "Nomor rekening wajib diisi")
    .refine((val) => accountNumberRegex.test(val), {
      message: "Nomor rekening harus 10-16 digit angka",
    }),
  bank_atas_nama: z.string().min(1, "Atas nama wajib diisi"),
})

// ==================================================
// FACTORY ADDRESS SCHEMA
// ==================================================

export const factoryAddressSchema = z.object({
  alamat_detail: z.string().min(1, "Alamat detail wajib diisi"),
  provinsi_id: z.string().min(1, "Provinsi wajib dipilih"),
  provinsi_name: z.string().optional(),
  kabupaten_id: z.string().min(1, "Kabupaten/Kota wajib dipilih"),
  kabupaten_name: z.string().optional(),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  kode_pos: z
    .string()
    .min(1, "Kode pos wajib diisi")
    .regex(/^\d{5}$/, "Kode pos harus 5 digit angka"),
})

// ==================================================
// PRODUCT SCHEMA
// ==================================================

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  price: z.number().min(0, "Harga harus positif"),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  finishing: z.string().optional(),
  weight_kg: z.number().optional(),
  lead_time_days: z.number().optional(),
  moq: z.number().optional(),
  description: z.string().optional(),
})

// ==================================================
// ADDITIONAL COST SCHEMA
// ==================================================

export const additionalCostSchema = z.object({
  description: z.string().min(1, "Keterangan wajib diisi"),
  amount: z.number().min(0, "Nilai harus positif"),
  unit: z.string().min(1, "Satuan wajib diisi"),
})

// ==================================================
// DELIVERY AREA SCHEMA
// ==================================================

export const deliveryAreaSchema = z.object({
  city_id: z.string(),
  city_name: z.string(),
  province_id: z.string(),
  province_name: z.string(),
})

// ==================================================
// OPERATIONAL SCHEMA
// ==================================================

export const operationalSchema = z.object({
  bank: bankAccountSchema,
  factory_address: factoryAddressSchema,
  products: z.array(productSchema).min(1, "Minimal harus ada 1 produk"),
  delivery_areas: z
    .array(deliveryAreaSchema)
    .min(1, "Minimal harus ada 1 area pengiriman"),
  cost_inclusions: z.object({
    mobilisasi_demobilisasi: z.boolean().default(false),
    penginapan_tukang: z.boolean().default(false),
    biaya_pengiriman: z.boolean().default(false),
    biaya_langsir: z.boolean().default(false),
    instalasi: z.boolean().default(false),
    ppn: z.boolean().default(false),
  }),
  additional_costs: z.array(additionalCostSchema),
})

// ==================================================
// REVIEW SCHEMA
// ==================================================

export const reviewSchema = z.object({
  legal_agreement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui pernyataan legal",
  }),
  document_confirmation: z.boolean().optional(),
})

// ==================================================
// VENDOR REGISTRATION SCHEMA
// ==================================================

export const vendorRegistrationSchema = z
  .object({
    company_info: companyInfoSchema,
    legal_documents: legalDocumentSchema,
    operational: operationalSchema,
    review: reviewSchema,
  })
  .refine(
    (data) => {
      const hasMissingDocs =
        !data.legal_documents.npwp_file ||
        !data.legal_documents.nib_file ||
        !data.legal_documents.siup_file ||
        !data.legal_documents.compro_file

      if (hasMissingDocs) {
        return data.review.document_confirmation === true
      }
      return true
    },
    {
      message: "Anda harus menyetujui untuk melengkapi dokumen dalam 30 hari",
      path: ["review", "document_confirmation"],
    }
  )

// ==================================================
// TYPE EXPORTS
// ==================================================

export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>
export type LegalDocumentFormData = z.infer<typeof legalDocumentSchema>
export type BankAccountFormData = z.infer<typeof bankAccountSchema>
export type FactoryAddressFormData = z.infer<typeof factoryAddressSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type AdditionalCostFormData = z.infer<typeof additionalCostSchema>
export type DeliveryAreaFormData = z.infer<typeof deliveryAreaSchema>
export type OperationalFormData = z.infer<typeof operationalSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type VendorRegistrationFormData = z.infer<
  typeof vendorRegistrationSchema
>
