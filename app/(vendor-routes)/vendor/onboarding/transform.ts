import type { VendorRegistrationFormData } from "@/lib/validations/vendor-registration"
import type { OnboardingDraftData } from "./types"

export function transformToDraftData(
  formData: VendorRegistrationFormData
): OnboardingDraftData {
  return {
    currentStep: 1,
    company_info: {
      nama_perusahaan: formData.company_info.nama_perusahaan,
      email: formData.company_info.email,
      nama_pic: formData.company_info.nama_pic,
      kontak_pic: formData.company_info.kontak_pic,
      website: formData.company_info.website || "",
      instagram: formData.company_info.instagram || "",
      facebook: formData.company_info.facebook || "",
      linkedin: formData.company_info.linkedin || "",
      contacts: [
        { sequence: 1, ...formData.company_info.contact_1 },
        { sequence: 2, ...formData.company_info.contact_2 },
        formData.company_info.contact_3?.nama
          ? { sequence: 3, ...formData.company_info.contact_3 }
          : null,
      ].filter(Boolean) as OnboardingDraftData["company_info"]["contacts"],
    },
    documents: {
      ktp_path: null,
      ktp_number: null,
      npwp_path: null,
      npwp_number: formData.legal_documents.npwp_nomor || null,
      nib_path: null,
      nib_number: formData.legal_documents.nib_nomor || null,
      siup_sbu_path: null,
      company_profile_path: null,
    },
    operational: {
      factory_address: {
        address: formData.operational.factory_address.alamat_detail || "",
        province: formData.operational.factory_address.provinsi_name || "",
        kabupaten: formData.operational.factory_address.kabupaten_name || "",
        kecamatan: formData.operational.factory_address.kecamatan || "",
        postal_code: formData.operational.factory_address.kode_pos || "",
      },
      delivery_areas: formData.operational.delivery_areas.map((area) => ({
        province_id: area.province_id || "",
        province_name: area.province_name || "",
        city_id: area.city_id || "",
        city_name: area.city_name || "",
      })),
      products: formData.operational.products.map((p) => ({
        name: p.name,
        satuan: p.satuan,
        price: p.price,
        dimensions: p.dimensions || "",
        material: p.material || "",
        finishing: p.finishing || "",
        weight_kg: (p as { berat?: number }).berat || 0,
        lead_time_days: p.lead_time_days || 0,
        moq: p.moq || 0,
      })),
      bank_account: {
        bank_name: formData.operational.bank.bank_nama,
        account_number: formData.operational.bank.bank_nomor,
        account_holder_name: formData.operational.bank.bank_atas_nama,
      },
      cost_inclusions: {
        mobilisasi_demobilisasi:
          formData.operational.cost_inclusions.mobilisasi,
        penginapan_tukang: formData.operational.cost_inclusions.penginapan,
        biaya_pengiriman: formData.operational.cost_inclusions.pengiriman,
        biaya_langsir: formData.operational.cost_inclusions.langsir,
        instalasi: formData.operational.cost_inclusions.instalasi,
        ppn: formData.operational.cost_inclusions.ppn,
      },
      additional_costs: formData.operational.additional_costs.map((c) => ({
        description: c.description || "",
        amount: c.amount || 0,
        unit: c.unit || "",
      })),
    },
  }
}
