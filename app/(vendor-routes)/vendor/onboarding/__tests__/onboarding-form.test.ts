import { describe, it, expect } from "vitest"
import { transformToDraftData } from "../transform"
import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"

const validFormData: VendorRegistrationFormData = {
  company_info: {
    nama_perusahaan: "PT Test Indonesia",
    email: "vendor@test.com",
    nama_pic: "John Doe",
    kontak_pic: "081234567890",
    website: "https://test.com",
    instagram: "@test",
    facebook: "fb.com/test",
    linkedin: "linkedin.com/test",
    contact_1: {
      no_hp: "081234567891",
      nama: "Jane Smith",
      jabatan: "Supervisor",
    },
    contact_2: {
      no_hp: "081234567892",
      nama: "Bob Wilson",
      jabatan: "Finance",
    },
    contact_3: {
      no_hp: "081234567893",
      nama: "Charlie Brown",
      jabatan: "Manager",
    },
  },
  legal_documents: {
    ktp_file: undefined,
    npwp_nomor: "1234567890123456",
    npwp_file: undefined,
    nib_nomor: "0123456789013",
    nib_file: undefined,
    siup_file: undefined,
    compro_file: undefined,
  },
  operational: {
    bank: {
      bank_nama: "Bank Central Asia (BCA)",
      bank_nomor: "1234567890",
      bank_atas_nama: "PT Test Indonesia",
    },
    factory_address: {
      alamat_detail: "Jl. Test No. 123, Jakarta Selatan",
      provinsi_id: "31",
      provinsi_name: "DKI Jakarta",
      kabupaten_id: "3173",
      kabupaten_name: "Jakarta Selatan",
      kecamatan: "Kebayoran Baru",
      kode_pos: "12110",
    },
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
    delivery_areas: [
      {
        city_id: "3173",
        city_name: "Jakarta Selatan",
        province_id: "31",
        province_name: "DKI Jakarta",
      },
    ],
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
  review: {
    legal_agreement: true,
  },
}

const formDataWithOptionalFieldsEmpty = {
  company_info: {
    nama_perusahaan: "PT Minimal",
    email: "minimal@test.com",
    nama_pic: "Admin",
    kontak_pic: "081234567890",
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    contact_1: {
      no_hp: "081234567891",
      nama: "Contact Person",
      jabatan: "Manager",
    },
    contact_2: {
      no_hp: "",
      nama: "",
      jabatan: "",
    },
    contact_3: { no_hp: "", nama: "", jabatan: "" },
  },
  legal_documents: {
    ktp_file: undefined,
    npwp_nomor: "",
    npwp_file: undefined,
    nib_nomor: "",
    nib_file: undefined,
    siup_file: undefined,
    compro_file: undefined,
  },
  operational: {
    bank: {
      bank_nama: "BNI",
      bank_nomor: "123456789012",
      bank_atas_nama: "PT Minimal",
    },
    factory_address: {
      alamat_detail: "Alamat Pabrik",
      provinsi_id: "",
      provinsi_name: "",
      kabupaten_id: "",
      kabupaten_name: "",
      kecamatan: "Kecamatan",
      kode_pos: "54321",
    },
    products: [
      {
        name: "Produk",
        satuan: "Unit",
        price: 50000,
      },
    ],
    delivery_areas: [
      {
        city_id: "1",
        city_name: "Kota",
        province_id: "1",
        province_name: "Provinsi",
      },
    ],
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
  review: {
    legal_agreement: false,
  },
} as VendorRegistrationFormData

describe("transformToDraftData", () => {
  it("should transform full valid VendorRegistrationFormData to correct OnboardingDraftData", () => {
    const result = transformToDraftData(validFormData)

    expect(result.currentStep).toBe(1)
    expect(result.company_info.nama_perusahaan).toBe("PT Test Indonesia")
    expect(result.company_info.email).toBe("vendor@test.com")
    expect(result.company_info.nama_pic).toBe("John Doe")
    expect(result.company_info.kontak_pic).toBe("081234567890")
    expect(result.company_info.website).toBe("https://test.com")
    expect(result.company_info.instagram).toBe("@test")
    expect(result.company_info.facebook).toBe("fb.com/test")
    expect(result.company_info.linkedin).toBe("linkedin.com/test")

    expect(result.company_info.contacts).toHaveLength(3)
    expect(result.company_info.contacts[0]).toEqual({
      sequence: 1,
      no_hp: "081234567891",
      nama: "Jane Smith",
      jabatan: "Supervisor",
    })
    expect(result.company_info.contacts[1]).toEqual({
      sequence: 2,
      no_hp: "081234567892",
      nama: "Bob Wilson",
      jabatan: "Finance",
    })
    expect(result.company_info.contacts[2]).toEqual({
      sequence: 3,
      no_hp: "081234567893",
      nama: "Charlie Brown",
      jabatan: "Manager",
    })

    expect(result.documents.ktp_path).toBeNull()
    expect(result.documents.ktp_number).toBeNull()
    expect(result.documents.npwp_path).toBeNull()
    expect(result.documents.npwp_number).toBe("1234567890123456")
    expect(result.documents.nib_path).toBeNull()
    expect(result.documents.nib_number).toBe("0123456789013")

    expect(result.operational.factory_address.address).toBe(
      "Jl. Test No. 123, Jakarta Selatan"
    )
    expect(result.operational.factory_address.province).toBe("DKI Jakarta")
    expect(result.operational.factory_address.kabupaten).toBe("Jakarta Selatan")
    expect(result.operational.factory_address.kecamatan).toBe("Kebayoran Baru")
    expect(result.operational.factory_address.postal_code).toBe("12110")

    expect(result.operational.delivery_areas).toHaveLength(1)
    expect(result.operational.delivery_areas[0]).toEqual({
      province_id: "31",
      province_name: "DKI Jakarta",
      city_id: "3173",
      city_name: "Jakarta Selatan",
    })

    expect(result.operational.products).toHaveLength(1)
    expect(result.operational.products[0]).toEqual({
      name: "Produk A",
      satuan: "Unit",
      price: 1000000,
      dimensions: "100x50x50",
      material: "Baja",
      finishing: "Cat",
      weight_kg: 25,
      lead_time_days: 7,
      moq: 10,
    })

    expect(result.operational.bank_account.bank_name).toBe(
      "Bank Central Asia (BCA)"
    )
    expect(result.operational.bank_account.account_number).toBe("1234567890")
    expect(result.operational.bank_account.account_holder_name).toBe(
      "PT Test Indonesia"
    )
  })

  it("should transform with optional fields empty and use default values", () => {
    const result = transformToDraftData(formDataWithOptionalFieldsEmpty)

    expect(result.company_info.website).toBe("")
    expect(result.company_info.instagram).toBe("")
    expect(result.company_info.facebook).toBe("")
    expect(result.company_info.linkedin).toBe("")

    expect(result.documents.npwp_number).toBeNull()
    expect(result.documents.nib_number).toBeNull()

    expect(result.operational.factory_address.province).toBe("")
    expect(result.operational.factory_address.kabupaten).toBe("")
  })

  it("should filter out contact_3 when it is null", () => {
    const formDataWithNoContact3 = {
      ...validFormData,
      company_info: {
        ...validFormData.company_info,
        contact_3: { no_hp: "", nama: "", jabatan: "" },
      },
    }

    const result = transformToDraftData(
      formDataWithNoContact3 as VendorRegistrationFormData
    )

    expect(
      result.company_info.contacts.filter((c) => c.nama && c.no_hp && c.jabatan)
    ).toHaveLength(2)
  })

  it("should pass cost_inclusions keys through directly to DB format", () => {
    const result = transformToDraftData(validFormData)

    expect(result.operational.cost_inclusions.mobilisasi_demobilisasi).toBe(
      true
    )
    expect(result.operational.cost_inclusions.penginapan_tukang).toBe(false)
    expect(result.operational.cost_inclusions.biaya_pengiriman).toBe(true)
    expect(result.operational.cost_inclusions.biaya_langsir).toBe(false)
    expect(result.operational.cost_inclusions.instalasi).toBe(false)
    expect(result.operational.cost_inclusions.ppn).toBe(true)
  })

  it("should transform additional_costs correctly", () => {
    const result = transformToDraftData(validFormData)

    expect(result.operational.additional_costs).toHaveLength(1)
    expect(result.operational.additional_costs[0]).toEqual({
      description: "Biaya packing",
      amount: 500000,
      unit: "kali",
    })
  })
})
