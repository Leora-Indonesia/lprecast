import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"
import {
  getUserRegistrationData,
  getRegistrationStatus,
  loadDraft,
  getInitialOnboardingData,
} from "../queries"
import type { OnboardingDraftData } from "../types"

describe("queries", () => {
  const mockUser = { id: "user-123", email: "test@example.com" }
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>
    )
  })

  describe("getUserRegistrationData", () => {
    it("should return null when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await getUserRegistrationData()

      expect(result).toBeNull()
    })

    it("should return user registration data when authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                nama: "John Doe",
                email: "test@example.com",
                nama_perusahaan: "PT Test",
                no_hp: "081234567890",
              },
              error: null,
            }),
          }),
        }),
      })

      const result = await getUserRegistrationData()

      expect(result).toEqual({
        nama_perusahaan: "PT Test",
        nama_pic: "John Doe",
        email: "test@example.com",
        kontak_pic: "081234567890",
      })
    })

    it("should return null when database query fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Database error" },
            }),
          }),
        }),
      })

      const result = await getUserRegistrationData()

      expect(result).toBeNull()
    })
  })

  describe("getRegistrationStatus", () => {
    it("should return default status when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await getRegistrationStatus()

      expect(result).toEqual({
        status: "none",
        hasDraft: false,
        hasRegistration: false,
      })
    })

    it("should return status with draft and no registration", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "vendor_onboarding_drafts") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "draft-123" },
                  error: null,
                }),
              }),
            }),
          }
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "PGRST116" },
              }),
            }),
          }),
        }
      })

      const result = await getRegistrationStatus()

      expect(result.status).toBe("none")
      expect(result.hasDraft).toBe(true)
      expect(result.hasRegistration).toBe(false)
    })

    it("should return status with registration and no draft", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "vendor_onboarding_drafts") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: "PGRST116" },
                }),
              }),
            }),
          }
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { status: "submitted" },
                error: null,
              }),
            }),
          }),
        }
      })

      const result = await getRegistrationStatus()

      expect(result.status).toBe("submitted")
      expect(result.hasDraft).toBe(false)
      expect(result.hasRegistration).toBe(true)
    })
  })

  describe("loadDraft", () => {
    const mockDraftData: OnboardingDraftData = {
      currentStep: 1,
      company_info: {
        nama_perusahaan: "PT Test",
        email: "test@example.com",
        nama_pic: "John",
        kontak_pic: "081234567890",
        website: "",
        instagram: "",
        facebook: "",
        linkedin: "",
        contacts: [],
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
          address: "",
          province: "",
          kabupaten: "",
          kecamatan: "",
          postal_code: "",
        },
        delivery_areas: [],
        products: [],
        bank_account: {
          bank_name: "",
          account_number: "",
          account_holder_name: "",
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

      const result = await loadDraft()

      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("should return null data when no draft exists", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: "PGRST116" },
            }),
          }),
        }),
      })

      const result = await loadDraft()

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })

    it("should return draft data when draft exists", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                draft_data: mockDraftData,
                current_step: 2,
              },
              error: null,
            }),
          }),
        }),
      })

      const result = await loadDraft()

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        ...mockDraftData,
        currentStep: 2,
      })
    })

    it("should return error when database query fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: "OTHER_ERROR", message: "Database error" },
            }),
          }),
        }),
      })

      const result = await loadDraft()

      expect(result.success).toBe(false)
      expect(result.error).toBe("Database error")
    })
  })

  describe("getInitialOnboardingData", () => {
    it("should return all initial data", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      mockSupabase.from.mockImplementation((table: string) => {
        const responses: Record<string, unknown> = {
          vendor_onboarding_drafts: {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: "PGRST116" },
                }),
              }),
            }),
          },
          vendor_profiles: {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: "PGRST116" },
                }),
              }),
            }),
          },
          users: {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    nama: "John",
                    email: "test@example.com",
                    nama_perusahaan: "PT Test",
                    no_hp: "081234567890",
                  },
                  error: null,
                }),
              }),
            }),
          },
        }
        return responses[table] as ReturnType<typeof mockSupabase.from>
      })

      const result = await getInitialOnboardingData()

      expect(result.status).toBeDefined()
      expect(result.userData).toBeDefined()
      expect(result.draft).toBeDefined()
    })
  })
})
