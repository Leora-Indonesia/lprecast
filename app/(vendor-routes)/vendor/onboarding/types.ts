import { z } from "zod"

export const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/
const npwpRegex = /^\d{16}$/
const nibRegex = /^\d{13}$/
const accountNumberRegex = /^\d{10,16}$/

const validatePhone = (value: string) =>
  phoneRegex.test(value.replace(/[\s-]/g, ""))

const contactSchema = z.object({
  sequence: z.number(),
  nama: z.string().min(1, "Nama wajib diisi"),
  no_hp: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .refine((val) => validatePhone(val), {
      message: "Format nomor HP tidak valid",
    }),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
})

export const companyInfoSchema = z.object({
  nama_perusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  nama_pic: z.string().min(1, "Nama PIC wajib diisi"),
  kontak_pic: z
    .string()
    .min(1, "Nomor HP PIC wajib diisi")
    .refine((val) => validatePhone(val), {
      message: "Format nomor HP tidak valid",
    }),
  website: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  contacts: z.array(contactSchema).min(2, "Minimal harus ada 2 kontak").max(3),
})

export const documentsSchema = z.object({
  ktp_path: z.string().nullable(),
  ktp_number: z.string().nullable(),
  npwp_path: z.string().nullable(),
  npwp_number: z
    .string()
    .nullable()
    .refine((val) => !val || npwpRegex.test(val), {
      message: "NPWP harus 16 digit",
    }),
  nib_path: z.string().nullable(),
  nib_number: z
    .string()
    .nullable()
    .refine((val) => !val || nibRegex.test(val), {
      message: "NIB harus 13 digit",
    }),
  siup_sbu_path: z.string().nullable(),
  company_profile_path: z.string().nullable(),
})

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
})

export const costInclusionSchema = z.object({
  mobilisasi_demobilisasi: z.boolean(),
  penginapan_tukang: z.boolean(),
  biaya_pengiriman: z.boolean(),
  biaya_langsir: z.boolean(),
  instalasi: z.boolean(),
  ppn: z.boolean(),
})

export const additionalCostSchema = z.object({
  description: z.string().min(1, "Keterangan wajib diisi"),
  amount: z.number().min(0, "Nilai harus positif"),
  unit: z.string().min(1, "Satuan wajib diisi"),
})

export const operationalSchema = z.object({
  factory_address: z.object({
    address: z.string().min(1, "Alamat detail wajib diisi"),
    province: z.string(),
    kabupaten: z.string(),
    kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
    postal_code: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit"),
  }),
  delivery_areas: z
    .array(
      z.object({
        province_id: z.string(),
        province_name: z.string(),
        city_id: z.string(),
        city_name: z.string(),
      })
    )
    .min(1, "Minimal harus ada 1 area pengiriman"),
  products: z.array(productSchema).min(1, "Minimal harus ada 1 produk"),
  bank_account: z.object({
    bank_name: z.string().min(1, "Nama bank wajib diisi"),
    account_number: z
      .string()
      .min(1, "Nomor rekening wajib diisi")
      .refine((val) => accountNumberRegex.test(val), {
        message: "Nomor rekening 10-16 digit angka",
      }),
    account_holder_name: z.string().min(1, "Atas nama wajib diisi"),
  }),
  cost_inclusions: costInclusionSchema,
  additional_costs: z.array(additionalCostSchema),
})

export const submitPayloadSchema = z.object({
  currentStep: z.number(),
  company_info: companyInfoSchema,
  documents: documentsSchema,
  operational: operationalSchema,
})

export type SubmitPayload = z.infer<typeof submitPayloadSchema>

export interface OnboardingDraftData {
  currentStep: number
  company_info: {
    nama_perusahaan: string
    email: string
    nama_pic: string
    kontak_pic: string
    website: string
    instagram: string
    facebook: string
    linkedin: string
    contacts: {
      sequence: number
      nama: string
      no_hp: string
      jabatan: string
    }[]
  }
  documents: {
    ktp_path: string | null
    ktp_number: string | null
    npwp_path: string | null
    npwp_number: string | null
    nib_path: string | null
    nib_number: string | null
    siup_sbu_path: string | null
    company_profile_path: string | null
  }
  operational: {
    factory_address: {
      address: string
      province: string
      kabupaten: string
      kecamatan: string
      postal_code: string
    }
    delivery_areas: {
      province_id: string
      province_name: string
      city_id: string
      city_name: string
    }[]
    products: {
      name: string
      satuan: string
      price: number
      dimensions: string
      material: string
      finishing: string
      weight_kg: number
      lead_time_days: number
      moq: number
    }[]
    bank_account: {
      bank_name: string
      account_number: string
      account_holder_name: string
    }
    cost_inclusions: {
      mobilisasi_demobilisasi: boolean
      penginapan_tukang: boolean
      biaya_pengiriman: boolean
      biaya_langsir: boolean
      instalasi: boolean
      ppn: boolean
    }
    additional_costs: {
      description: string
      amount: number
      unit: string
    }[]
  }
}

export interface SaveDraftResult {
  success: boolean
  error?: string
}

export interface LoadDraftResult {
  success: boolean
  data?: OnboardingDraftData | null
  error?: string
}

export interface RegistrationStatus {
  status:
    | "none"
    | "draft"
    | "submitted"
    | "under_review"
    | "revision_requested"
    | "rejected"
    | "active"
    | "suspended"
    | "blacklisted"
  hasDraft: boolean
  hasRegistration: boolean
}

export interface UserRegistrationData {
  nama_perusahaan: string
  nama_pic: string
  email: string
  kontak_pic?: string
}
