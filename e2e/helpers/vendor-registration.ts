import { Page, type Locator } from "@playwright/test"

export interface CompanyInfoData {
  nama_perusahaan: string
  email: string
  nama_pic: string
  kontak_pic: string
  website?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  contact_1: { no_hp: string; nama: string; jabatan: string }
  contact_2: { no_hp: string; nama: string; jabatan: string }
  contact_3?: { no_hp: string; nama: string; jabatan: string }
}

export interface LegalDocumentsData {
  ktp_file: Buffer
  npwp_nomor?: string
  npwp_file?: Buffer
  nib_nomor?: string
  nib_file?: Buffer
  siup_file?: Buffer
  compro_file?: Buffer
}

export interface BankData {
  bank_nama: string
  bank_nomor: string
  bank_atas_nama: string
}

export interface FactoryAddressData {
  alamat_detail: string
  provinsi_id: string
  kabupaten_id: string
  kecamatan: string
  kode_pos: string
}

export interface ProductData {
  name: string
  satuan: string
  price: number
  dimensions?: string
  material?: string
  finishing?: string
  berat?: number
  lead_time_days?: number
  moq?: number
  description?: string
}

export interface DeliveryAreaData {
  city_id: string
  city_name: string
  province_id: string
  province_name: string
}

export interface OperationalData {
  bank: BankData
  factory_address: FactoryAddressData
  products: ProductData[]
  delivery_areas: DeliveryAreaData[]
  cost_inclusions?: {
    mobilisasi?: boolean
    penginapan?: boolean
    pengiriman?: boolean
    langsir?: boolean
    instalasi?: boolean
    ppn?: boolean
  }
}

export class VendorRegisterPage {
  readonly page: Page
  readonly baseURL = "http://localhost:3000"

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/vendor/register`)
    await this.page.waitForLoadState("domcontentloaded")
    await this.page.waitForSelector("form", {
      state: "visible",
      timeout: 30000,
    })
  }

  async waitForPageReady() {
    await this.page.waitForLoadState("domcontentloaded")
    await this.page.waitForSelector("form", {
      state: "visible",
      timeout: 30000,
    })
  }

  getContinueButton(): Locator {
    return this.page.locator('button:has-text("Lanjutkan")')
  }

  getSubmitButton(): Locator {
    return this.page.locator('button:has-text("Kirim Data")')
  }

  getBackButton(): Locator {
    return this.page.locator('button:has-text("Kembali")')
  }

  getCancelButton(): Locator {
    return this.page.locator('button:has-text("Batal")')
  }

  getStepHeader(stepIndex: number): Locator {
    return this.page.locator(`#stepHeader${stepIndex}`)
  }

  async clickContinue() {
    await this.getContinueButton().click()
    await this.page.waitForTimeout(500)
  }

  async clickSubmit() {
    await this.getSubmitButton().click()
    await this.page.waitForTimeout(500)
  }

  async clickBack() {
    await this.getBackButton().click()
    await this.page.waitForTimeout(500)
  }

  async clickStep(stepIndex: number) {
    const step = this.getStepHeader(stepIndex)
    await step.click()
    await this.page.waitForTimeout(500)
  }

  async fillCompanyInfo(data: CompanyInfoData) {
    await this.page.waitForSelector("#nama_perusahaan", { timeout: 10000 })
    await this.page.fill("#nama_perusahaan", data.nama_perusahaan)
    await this.page.fill("#email", data.email)
    await this.page.fill("#nama_pic", data.nama_pic)
    await this.page.fill("#kontak_pic", data.kontak_pic)

    if (data.website) {
      await this.page.fill("#website", data.website)
    }
    if (data.instagram) {
      await this.page.fill("#instagram", data.instagram)
    }
    if (data.facebook) {
      await this.page.fill("#facebook", data.facebook)
    }
    if (data.linkedin) {
      await this.page.fill("#linkedin", data.linkedin)
    }

    await this.page.fill('input[id="contact_1.no_hp"]', data.contact_1.no_hp)
    await this.page.fill('input[id="contact_1.nama"]', data.contact_1.nama)
    await this.page.fill(
      'input[id="contact_1.jabatan"]',
      data.contact_1.jabatan
    )

    await this.page.fill('input[id="contact_2.no_hp"]', data.contact_2.no_hp)
    await this.page.fill('input[id="contact_2.nama"]', data.contact_2.nama)
    await this.page.fill(
      'input[id="contact_2.jabatan"]',
      data.contact_2.jabatan
    )

    if (data.contact_3) {
      await this.page.fill('input[id="contact_3.no_hp"]', data.contact_3.no_hp)
      await this.page.fill('input[id="contact_3.nama"]', data.contact_3.nama)
      await this.page.fill(
        'input[id="contact_3.jabatan"]',
        data.contact_3.jabatan
      )
    }
  }

  async fillLegalDocuments(data: LegalDocumentsData) {
    if (data.ktp_file) {
      await this.page.locator('input[type="file"]').first().setInputFiles({
        name: "ktp.pdf",
        mimeType: "application/pdf",
        buffer: data.ktp_file,
      })
    }

    if (data.npwp_nomor) {
      await this.page.fill("#npwp_nomor", data.npwp_nomor)
    }
    if (data.npwp_file) {
      const npwpInputs = await this.page.locator('input[type="file"]').all()
      if (npwpInputs.length > 1) {
        await npwpInputs[1].setInputFiles({
          name: "npwp.pdf",
          mimeType: "application/pdf",
          buffer: data.npwp_file,
        })
      }
    }

    if (data.nib_nomor) {
      await this.page.fill("#nib_nomor", data.nib_nomor)
    }
    if (data.nib_file) {
      const nibInputs = await this.page.locator('input[type="file"]').all()
      if (nibInputs.length > 2) {
        await nibInputs[2].setInputFiles({
          name: "nib.pdf",
          mimeType: "application/pdf",
          buffer: data.nib_file,
        })
      }
    }

    if (data.siup_file) {
      const siupInputs = await this.page.locator('input[type="file"]').all()
      if (siupInputs.length > 3) {
        await siupInputs[3].setInputFiles({
          name: "siup.pdf",
          mimeType: "application/pdf",
          buffer: data.siup_file,
        })
      }
    }

    if (data.compro_file) {
      const comproInputs = await this.page.locator('input[type="file"]').all()
      if (comproInputs.length > 4) {
        await comproInputs[4].setInputFiles({
          name: "compro.pdf",
          mimeType: "application/pdf",
          buffer: data.compro_file,
        })
      }
    }
  }

  async fillBankAccount(data: BankData) {
    await this.page.fill("#bank_nama", data.bank_nama)
    await this.page.fill("#bank_nomor", data.bank_nomor)
    await this.page.fill("#bank_atas_nama", data.bank_atas_nama)
  }

  async fillFactoryAddress(data: FactoryAddressData) {
    await this.page.fill("#alamat_detail", data.alamat_detail)

    await this.page.click('[data-slot="select-trigger"] >> text=Pilih Provinsi')
    await this.page.waitForTimeout(300)
    await this.page.keyboard.type(data.provinsi_id, { delay: 100 })
    await this.page.keyboard.press("Enter")
    await this.page.waitForTimeout(500)

    await this.page.click(
      '[data-slot="select-trigger"] >> text=Pilih Kabupaten'
    )
    await this.page.waitForTimeout(300)
    await this.page.keyboard.type(data.kabupaten_id, { delay: 100 })
    await this.page.keyboard.press("Enter")
    await this.page.waitForTimeout(500)

    await this.page.fill("#kecamatan", data.kecamatan)
    await this.page.fill("#kode_pos", data.kode_pos)
  }

  async addProduct(product: ProductData) {
    await this.page.click('button:has-text("Tambah Produk")')
    await this.page.waitForTimeout(500)

    await this.page.fill('input[id="product-name"]', product.name)
    await this.page.fill('input[id="product-satuan"]', product.satuan)
    await this.page.fill('input[id="product-price"]', product.price.toString())

    if (product.dimensions) {
      await this.page.fill('input[id="product-dimensions"]', product.dimensions)
    }
    if (product.material) {
      await this.page.fill('input[id="product-material"]', product.material)
    }
    if (product.finishing) {
      await this.page.fill('input[id="product-finishing"]', product.finishing)
    }
    if (product.berat) {
      await this.page.fill(
        'input[id="product-berat"]',
        product.berat.toString()
      )
    }
    if (product.lead_time_days) {
      await this.page.fill(
        'input[id="product-lead-time"]',
        product.lead_time_days.toString()
      )
    }
    if (product.moq) {
      await this.page.fill('input[id="product-moq"]', product.moq.toString())
    }
    if (product.description) {
      await this.page.fill(
        'textarea[id="product-description"]',
        product.description
      )
    }

    await this.page.click('button:has-text("Simpan")')
    await this.page.waitForTimeout(500)
  }

  async addDeliveryArea(area: DeliveryAreaData) {
    await this.page.click('button:has-text("Tambah Area")')
    await this.page.waitForTimeout(500)

    await this.page.keyboard.type(area.city_name, { delay: 100 })
    await this.page.waitForTimeout(300)
    await this.page.keyboard.press("Enter")
    await this.page.waitForTimeout(500)

    await this.page.click('button:has-text("Simpan")')
    await this.page.waitForTimeout(500)
  }

  async fillCostInclusions(inclusions: OperationalData["cost_inclusions"]) {
    if (!inclusions) return

    if (inclusions.mobilisasi) {
      await this.page.check("#mobilisasi")
    }
    if (inclusions.penginapan) {
      await this.page.check("#penginapan")
    }
    if (inclusions.pengiriman) {
      await this.page.check("#pengiriman")
    }
    if (inclusions.langsir) {
      await this.page.check("#langsir")
    }
    if (inclusions.instalasi) {
      await this.page.check("#instalasi")
    }
    if (inclusions.ppn) {
      await this.page.check("#ppn")
    }
  }

  async acceptLegalAgreement() {
    await this.page.check("#legal_agreement")
  }

  async acceptDocumentConfirmation() {
    await this.page.check("#document_confirmation")
  }

  async waitForSuccessRedirect() {
    await this.page.waitForURL("**/vendor/register/success", { timeout: 30000 })
  }

  async getCurrentStep(): Promise<number> {
    const stepText = await this.page
      .locator(".border-b-2.border-b-primary")
      .textContent()
    if (stepText?.includes("1")) return 0
    if (stepText?.includes("2")) return 1
    if (stepText?.includes("3")) return 2
    if (stepText?.includes("4")) return 3
    return 0
  }

  async isOnStep(stepIndex: number): Promise<boolean> {
    const current = await this.getCurrentStep()
    return current === stepIndex
  }

  async getToastMessage(): Promise<string | null> {
    try {
      const toast = this.page.locator("[data-sonner-toast]")
      await toast.first().waitFor({ state: "visible", timeout: 3000 })
      return await toast.textContent()
    } catch {
      return null
    }
  }

  async dismissDraftDialog() {
    try {
      const dialog = this.page.locator('[role="dialog"]')
      if (await dialog.isVisible({ timeout: 2000 })) {
        await this.page.click('button:has-text("Mulai Baru")')
        await this.page.waitForTimeout(500)
      }
    } catch {
      // Dialog not visible
    }
  }
}

export function createTestPdfFile(size: number = 1024): Buffer {
  const buffer = Buffer.alloc(size)
  buffer.write("%PDF-1.4 test file", 0)
  return buffer
}

export function createTestJpgFile(size: number = 1024): Buffer {
  const buffer = Buffer.alloc(size)
  buffer.write("\xFF\xD8\xFF\xE0\x00\x10JFIF", 0)
  return buffer
}

export function createTestPngFile(size: number = 1024): Buffer {
  const buffer = Buffer.alloc(size)
  buffer.write("\x89PNG\r\n\x1a\n", 0)
  return buffer
}

export const defaultCompanyInfo: CompanyInfoData = {
  nama_perusahaan: "PT Test Vendor Indonesia",
  email: "vendor@testvendor.com",
  nama_pic: "John Doe",
  kontak_pic: "081234567890",
  website: "https://testvendor.com",
  instagram: "@testvendor",
  facebook: "facebook.com/testvendor",
  linkedin: "linkedin.com/company/testvendor",
  contact_1: {
    no_hp: "081234567891",
    nama: "Jane Smith",
    jabatan: "Supervisor",
  },
  contact_2: {
    no_hp: "081234567892",
    nama: "Bob Johnson",
    jabatan: "Finance",
  },
}

export const defaultLegalDocuments: LegalDocumentsData = {
  ktp_file: createTestPdfFile(),
  npwp_nomor: "1234567890123456",
  npwp_file: createTestPdfFile(),
  nib_nomor: "0123456789013",
  nib_file: createTestPdfFile(),
}

export const defaultBank: BankData = {
  bank_nama: "Bank Central Asia (BCA)",
  bank_nomor: "1234567890",
  bank_atas_nama: "PT Test Vendor Indonesia",
}

export const defaultFactoryAddress: FactoryAddressData = {
  alamat_detail: "Jl. Test No. 123, Jakarta Selatan",
  provinsi_id: "DKI Jakarta",
  kabupaten_id: "Jakarta Selatan",
  kecamatan: "Kebayoran Baru",
  kode_pos: "12110",
}

export const defaultProduct: ProductData = {
  name: "Produk Test A",
  satuan: "Unit",
  price: 1000000,
  dimensions: "100x50x50 cm",
  material: "Baja",
  finishing: "Cat",
  berat: 25,
  lead_time_days: 7,
  moq: 10,
  description: "Produk test untuk automation",
}

export const defaultDeliveryArea: DeliveryAreaData = {
  city_id: "3173",
  city_name: "Jakarta Selatan",
  province_id: "31",
  province_name: "DKI Jakarta",
}
