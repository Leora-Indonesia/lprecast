import { describe, it, expect } from "vitest"
import { submitPayloadSchema } from "../types"

const validFullPayload = {
  currentStep: 1,
  company_info: {
    nama_perusahaan: "PT Test Indonesia",
    email: "vendor@test.com",
    nama_pic: "John Doe",
    kontak_pic: "081234567890",
    website: "https://test.com",
    instagram: "@test",
    facebook: "fb.com/test",
    linkedin: "linkedin.com/test",
    contacts: [
      {
        sequence: 1,
        nama: "Jane Smith",
        no_hp: "081234567891",
        jabatan: "Supervisor",
      },
      {
        sequence: 2,
        nama: "Bob Wilson",
        no_hp: "081234567892",
        jabatan: "Finance",
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
      address: "Jl. Test No. 123",
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
        name: "Produk A",
        satuan: "Unit",
        price: 1000000,
        dimensions: "100x50x50",
        material: "Baja",
        finishing: "Cat",
        weight_kg: 25,
        lead_time_days: 7,
        moq: 10,
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
    additional_costs: [
      {
        description: "Biaya packing",
        amount: 500000,
        unit: "kali",
      },
    ],
  },
}

const minimalValidPayload = {
  currentStep: 1,
  company_info: {
    nama_perusahaan: "PT Minimal",
    email: "minimal@test.com",
    nama_pic: "Admin",
    kontak_pic: "081234567890",
    contacts: [
      {
        sequence: 1,
        nama: "Contact",
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
      address: "Alamat",
      province: "",
      kabupaten: "",
      kecamatan: "Kec",
      postal_code: "12345",
    },
    delivery_areas: [
      {
        province_id: "1",
        province_name: "Provinsi",
        city_id: "1",
        city_name: "Kota",
      },
    ],
    products: [
      {
        name: "Produk",
        satuan: "Unit",
        price: 100000,
      },
    ],
    bank_account: {
      bank_name: "BNI",
      account_number: "123456789012",
      account_holder_name: "PT Minimal",
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

describe("submitPayloadSchema", () => {
  describe("Valid payloads", () => {
    it("should pass with full valid payload", () => {
      const result = submitPayloadSchema.safeParse(validFullPayload)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.currentStep).toBe(1)
        expect(result.data.company_info.nama_perusahaan).toBe(
          "PT Test Indonesia"
        )
      }
    })

    it("should pass with minimal valid payload (only required fields)", () => {
      const result = submitPayloadSchema.safeParse(minimalValidPayload)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.company_info.nama_perusahaan).toBe("PT Minimal")
      }
    })
  })

  describe("company_info validation", () => {
    it("should fail when nama_perusahaan is empty", () => {
      const payload = {
        ...validFullPayload,
        company_info: {
          ...validFullPayload.company_info,
          nama_perusahaan: "",
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("company_info.nama_perusahaan")
      }
    })

    it("should fail when email format is invalid", () => {
      const payload = {
        ...validFullPayload,
        company_info: {
          ...validFullPayload.company_info,
          email: "invalid-email",
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("company_info.email")
      }
    })

    it("should fail when kontak_pic HP format is invalid", () => {
      const invalidPhones = ["123", "08123"]
      for (const phone of invalidPhones) {
        const payload = {
          currentStep: 1,
          company_info: {
            nama_perusahaan: "PT Test Indonesia",
            email: "vendor@test.com",
            nama_pic: "John Doe",
            kontak_pic: phone,
            website: "https://test.com",
            instagram: "@test",
            facebook: "fb.com/test",
            linkedin: "linkedin.com/test",
            contacts: [
              {
                sequence: 1,
                nama: "Jane Smith",
                no_hp: "081234567891",
                jabatan: "Supervisor",
              },
              {
                sequence: 2,
                nama: "Bob Wilson",
                no_hp: "081234567892",
                jabatan: "Finance",
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
          operational: validFullPayload.operational,
        }
        const result = submitPayloadSchema.safeParse(payload)
        expect(result.success).toBe(false)
        if (!result.success) {
          const path = result.error.issues[0].path.join(".")
          expect(path).toBe("company_info.kontak_pic")
        }
      }
    })

    it("should fail when contacts array is empty", () => {
      const payload = {
        ...validFullPayload,
        company_info: {
          ...validFullPayload.company_info,
          contacts: [],
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("company_info.contacts")
      }
    })

    it("should fail when contact no_hp format is invalid", () => {
      const payload = {
        ...validFullPayload,
        company_info: {
          ...validFullPayload.company_info,
          contacts: [
            {
              sequence: 1,
              nama: "Contact",
              no_hp: "123",
              jabatan: "Manager",
            },
          ],
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("company_info.contacts.0.no_hp")
      }
    })
  })

  describe("documents validation", () => {
    it("should fail when npwp_number is not 16 digits", () => {
      const invalidNpwp = ["123", "123456789012345", "12345678901234567"]
      for (const npwp of invalidNpwp) {
        const payload = {
          ...validFullPayload,
          documents: {
            ...validFullPayload.documents,
            npwp_number: npwp,
          },
        }
        const result = submitPayloadSchema.safeParse(payload)
        expect(result.success).toBe(false)
        if (!result.success) {
          const path = result.error.issues[0].path.join(".")
          expect(path).toBe("documents.npwp_number")
        }
      }
    })

    it("should fail when nib_number is not 13 digits", () => {
      const invalidNib = ["123", "01234567890134"] // 3 digits, 14 digits
      for (const nib of invalidNib) {
        const payload = {
          ...validFullPayload,
          documents: {
            ...validFullPayload.documents,
            nib_number: nib,
          },
        }
        const result = submitPayloadSchema.safeParse(payload)
        expect(result.success).toBe(false)
        if (!result.success) {
          const path = result.error.issues[0].path.join(".")
          expect(path).toBe("documents.nib_number")
        }
      }
    })

    it("should pass when npwp_number is empty string (optional)", () => {
      const payload = {
        ...validFullPayload,
        documents: {
          ...validFullPayload.documents,
          npwp_number: "",
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(true)
    })

    it("should pass when nib_number is empty string (optional)", () => {
      const payload = {
        ...validFullPayload,
        documents: {
          ...validFullPayload.documents,
          nib_number: "",
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(true)
    })
  })

  describe("operational validation", () => {
    it("should fail when factory_address.address is empty", () => {
      const payload = {
        ...validFullPayload,
        operational: {
          ...validFullPayload.operational,
          factory_address: {
            ...validFullPayload.operational.factory_address,
            address: "",
          },
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("operational.factory_address.address")
      }
    })

    it("should fail when postal_code is not 5 digits", () => {
      const invalidPostalCodes = ["123", "1234", "123456", "abcde"]
      for (const postal of invalidPostalCodes) {
        const payload = {
          ...validFullPayload,
          operational: {
            ...validFullPayload.operational,
            factory_address: {
              ...validFullPayload.operational.factory_address,
              postal_code: postal,
            },
          },
        }
        const result = submitPayloadSchema.safeParse(payload)
        expect(result.success).toBe(false)
        if (!result.success) {
          const path = result.error.issues[0].path.join(".")
          expect(path).toBe("operational.factory_address.postal_code")
        }
      }
    })

    it("should fail when bank_account.account_number is not 10-16 digits", () => {
      const invalidAccounts = ["123", "123456789", "123456789012345678"]
      for (const account of invalidAccounts) {
        const payload = {
          ...validFullPayload,
          operational: {
            ...validFullPayload.operational,
            bank_account: {
              ...validFullPayload.operational.bank_account,
              account_number: account,
            },
          },
        }
        const result = submitPayloadSchema.safeParse(payload)
        expect(result.success).toBe(false)
        if (!result.success) {
          const path = result.error.issues[0].path.join(".")
          expect(path).toBe("operational.bank_account.account_number")
        }
      }
    })

    it("should fail when bank_account.bank_name is empty", () => {
      const payload = {
        ...validFullPayload,
        operational: {
          ...validFullPayload.operational,
          bank_account: {
            ...validFullPayload.operational.bank_account,
            bank_name: "",
          },
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("operational.bank_account.bank_name")
      }
    })

    it("should fail when products array is empty", () => {
      const payload = {
        ...validFullPayload,
        operational: {
          ...validFullPayload.operational,
          products: [],
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("operational.products")
      }
    })

    it("should fail when delivery_areas array is empty", () => {
      const payload = {
        ...validFullPayload,
        operational: {
          ...validFullPayload.operational,
          delivery_areas: [],
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("operational.delivery_areas")
      }
    })

    it("should fail when product name is empty", () => {
      const payload = {
        ...validFullPayload,
        operational: {
          ...validFullPayload.operational,
          products: [
            {
              name: "",
              satuan: "Unit",
              price: 100000,
            },
          ],
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("operational.products.0.name")
      }
    })

    it("should fail when product price is negative", () => {
      const payload = {
        ...validFullPayload,
        operational: {
          ...validFullPayload.operational,
          products: [
            {
              name: "Produk",
              satuan: "Unit",
              price: -100000,
            },
          ],
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const path = result.error.issues[0].path.join(".")
        expect(path).toBe("operational.products.0.price")
      }
    })
  })

  describe("Edge cases", () => {
    it("should fail with proper error paths when payload has no required fields at all", () => {
      const payload = {
        currentStep: 1,
        company_info: {
          nama_perusahaan: "",
          email: "",
          nama_pic: "",
          kontak_pic: "",
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
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
      if (!result.success) {
        const firstErrorPath = result.error.issues[0].path.join(".")
        expect(firstErrorPath).toBeTruthy()
      }
    })

    it("should pass and strip unknown fields (extra fields are ignored)", () => {
      const payload = {
        ...validFullPayload,
        extra_field: "should be stripped",
        another_extra: 123,
        company_info: {
          ...validFullPayload.company_info,
          extra_field_company: "should be stripped",
        },
      }
      const result = submitPayloadSchema.safeParse(payload)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(
          (result.data as Record<string, unknown>).extra_field
        ).toBeUndefined()
        expect(
          (result.data.company_info as Record<string, unknown>)
            .extra_field_company
        ).toBeUndefined()
      }
    })
  })
})
