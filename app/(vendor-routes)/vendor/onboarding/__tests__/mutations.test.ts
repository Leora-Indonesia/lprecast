import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { saveDraft, uploadDocumentAction, submitOnboarding } from "../mutations"
import type { OnboardingDraftData } from "../types"

describe("mutations", () => {
  const mockUser = { id: "user-123", email: "test@example.com" }
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  }
  const mockAdminClient = {
    storage: {
      from: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>
    )
    vi.mocked(createAdminClient).mockReturnValue(
      mockAdminClient as unknown as ReturnType<typeof createAdminClient>
    )
  })

  describe("saveDraft", () => {
    const validDraftData: OnboardingDraftData = {
      currentStep: 1,
      company_info: {
        nama_perusahaan: "PT Test",
        email: "test@example.com",
        nama_pic: "John Doe",
        kontak_pic: "081234567890",
        website: "",
        instagram: "",
        facebook: "",
        linkedin: "",
        contacts: [
          {
            sequence: 1,
            nama: "Contact 1",
            no_hp: "081234567891",
            jabatan: "Manager",
          },
          {
            sequence: 2,
            nama: "Contact 2",
            no_hp: "081234567892",
            jabatan: "Staff",
          },
        ],
      },
      documents: {
        ktp_path: null,
        ktp_number: null,
        npwp_path: null,
        npwp_number: null,
        nib_path: null,
        nib_number: null,
        siup_sbu_path: null,
        company_profile_path: null,
      },
      operational: {
        factory_address: {
          address: "Jl. Test No. 1",
          province: "DKI Jakarta",
          kabupaten: "Jakarta Selatan",
          kecamatan: "Kebayoran Baru",
          postal_code: "12110",
        },
        delivery_areas: [],
        products: [],
        bank_account: {
          bank_name: "BCA",
          account_number: "1234567890",
          account_holder_name: "PT Test",
        },
        cost_inclusions: {
          mobilisasi_demobilisasi: false,
          penginapan_tukang: false,
          biaya_pengiriman: false,
          biaya_langsir: false,
          instalasi: false,
          ppn: false,
        },
        additional_costs: [],
      },
    }

    it("should return error when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await saveDraft(validDraftData, 1)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("should successfully save draft when user is authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockSupabase.from.mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: null }),
      })

      const result = await saveDraft(validDraftData, 1)

      expect(result.success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith("vendor_onboarding_drafts")
    })

    it("should return error when database upsert fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockSupabase.from.mockReturnValue({
        upsert: vi
          .fn()
          .mockResolvedValue({ error: { message: "Database error" } }),
      })

      const result = await saveDraft(validDraftData, 1)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Database error")
    })
  })

  describe("uploadDocumentAction", () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    })

    it("should return error when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await uploadDocumentAction(mockFile, "ktp")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("should successfully upload document", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockAdminClient.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://example.com/file.pdf" },
        }),
      })

      const result = await uploadDocumentAction(mockFile, "ktp")

      expect(result.success).toBe(true)
      expect(result.path).toBe("https://example.com/file.pdf")
    })

    it("should return error when upload fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockAdminClient.storage.from.mockReturnValue({
        upload: vi
          .fn()
          .mockResolvedValue({ error: { message: "Upload failed" } }),
      })

      const result = await uploadDocumentAction(mockFile, "ktp")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Gagal upload ktp")
    })
  })

  describe("submitOnboarding", () => {
    const createMockFormData = (payload: Record<string, unknown>) => {
      const formData = new FormData()
      formData.append("payload", JSON.stringify(payload))
      return formData
    }

    const validPayload = {
      currentStep: 4,
      company_info: {
        nama_perusahaan: "PT Test Indonesia",
        email: "test@example.com",
        nama_pic: "John Doe",
        kontak_pic: "081234567890",
        contacts: [
          {
            sequence: 1,
            nama: "Contact 1",
            no_hp: "081234567891",
            jabatan: "Manager",
          },
          {
            sequence: 2,
            nama: "Contact 2",
            no_hp: "081234567892",
            jabatan: "Staff",
          },
        ],
      },
      documents: {
        ktp_path: null,
        ktp_number: null,
        npwp_path: null,
        npwp_number: "1234567890123456",
        nib_path: null,
        nib_number: "0123456789013",
        siup_sbu_path: null,
        company_profile_path: null,
      },
      operational: {
        factory_address: {
          address: "Jl. Test No. 1",
          province: "DKI Jakarta",
          kabupaten: "Jakarta Selatan",
          kecamatan: "Kebayoran Baru",
          postal_code: "12110",
        },
        delivery_areas: [
          {
            province_id: "31",
            province_name: "DKI Jakarta",
            city_id: "3173",
            city_name: "Jakarta Selatan",
          },
        ],
        products: [
          {
            name: "Product A",
            satuan: "Unit",
            price: 100000,
            dimensions: "10x10",
            material: "Steel",
            finishing: "Paint",
            weight_kg: 10,
            lead_time_days: 7,
            moq: 5,
          },
        ],
        bank_account: {
          bank_name: "BCA",
          account_number: "1234567890",
          account_holder_name: "PT Test Indonesia",
        },
        cost_inclusions: {
          mobilisasi_demobilisasi: true,
          penginapan_tukang: false,
          biaya_pengiriman: true,
          biaya_langsir: false,
          instalasi: false,
          ppn: true,
        },
        additional_costs: [],
      },
    }

    it("should return error when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const formData = createMockFormData(validPayload)
      const result = await submitOnboarding(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("should return error when payload is missing", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const formData = new FormData()
      const result = await submitOnboarding(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Payload tidak ditemukan")
    })

    it("should return error when payload JSON is invalid", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const formData = new FormData()
      formData.append("payload", "invalid json")
      const result = await submitOnboarding(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Format payload tidak valid")
    })

    it("should return error when payload validation fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const invalidPayload = {
        ...validPayload,
        company_info: { ...validPayload.company_info, nama_perusahaan: "" },
      }
      const formData = createMockFormData(invalidPayload)
      const result = await submitOnboarding(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain("company_info.nama_perusahaan")
    })

    it("should successfully submit onboarding with valid data", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      mockSupabase.from.mockImplementation(() => ({
        upsert: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi
          .fn()
          .mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      }))

      const formData = createMockFormData(validPayload)
      const result = await submitOnboarding(formData)

      expect(result.success).toBe(true)
      expect(result.redirectTo).toBe("/vendor/dashboard")
      expect(revalidatePath).toHaveBeenCalledWith("/vendor/onboarding")
      expect(revalidatePath).toHaveBeenCalledWith("/vendor/dashboard")
    })

    it("should handle file uploads during submission", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockFile = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      })

      mockAdminClient.storage.from.mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://example.com/file.pdf" },
        }),
        remove: vi.fn().mockResolvedValue({ error: null }),
      })

      mockSupabase.from.mockImplementation(() => ({
        upsert: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi
          .fn()
          .mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      }))

      const formData = createMockFormData(validPayload)
      formData.append("ktp_file", mockFile)
      formData.append("npwp_file", mockFile)

      const result = await submitOnboarding(formData)

      expect(result.success).toBe(true)
      expect(mockAdminClient.storage.from).toHaveBeenCalledWith(
        "vendor-documents"
      )
    })

    it("should rollback and cleanup on database error", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "vendor_profiles") {
          return {
            upsert: vi
              .fn()
              .mockResolvedValue({ error: new Error("Profile insert failed") }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }
        }
        return {
          upsert: vi.fn().mockResolvedValue({ error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }
      })

      const formData = createMockFormData(validPayload)
      const result = await submitOnboarding(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain("Profile insert failed")
    })

    it("should handle redirect error from Next.js", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      mockSupabase.from.mockImplementation(() => ({
        upsert: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi
          .fn()
          .mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      }))

      vi.mocked(redirect).mockImplementation(() => {
        const error = new Error("NEXT_REDIRECT")
        ;(error as Error & { digest?: string }).digest = "NEXT_REDIRECT"
        throw error
      })

      const formData = createMockFormData(validPayload)
      const result = await submitOnboarding(formData)

      expect(result.success).toBe(true)
      expect(result.redirectTo).toBe("/vendor/dashboard")
    })
  })
})
