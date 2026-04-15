# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vendor-register.spec.ts >> Vendor Registration Flow >> Draft Persistence >> should show draft restore dialog when returning with saved data
- Location: e2e/vendor-register.spec.ts:216:5

# Error details

```
Error: Channel closed
```

```
Error: page.fill: Target page, context or browser has been closed
Call log:
  - waiting for locator('#kontak_pic')
    - locator resolved to <input id="kontak_pic" data-slot="input" placeholder="081234567890" name="company_info.kontak_pic" class="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cu…/>

```

# Test source

```ts
  47  |   finishing?: string
  48  |   berat?: number
  49  |   lead_time_days?: number
  50  |   moq?: number
  51  |   description?: string
  52  | }
  53  | 
  54  | export interface DeliveryAreaData {
  55  |   city_id: string
  56  |   city_name: string
  57  |   province_id: string
  58  |   province_name: string
  59  | }
  60  | 
  61  | export interface OperationalData {
  62  |   bank: BankData
  63  |   factory_address: FactoryAddressData
  64  |   products: ProductData[]
  65  |   delivery_areas: DeliveryAreaData[]
  66  |   cost_inclusions?: {
  67  |     mobilisasi?: boolean
  68  |     penginapan?: boolean
  69  |     pengiriman?: boolean
  70  |     langsir?: boolean
  71  |     instalasi?: boolean
  72  |     ppn?: boolean
  73  |   }
  74  | }
  75  | 
  76  | export class VendorRegisterPage {
  77  |   readonly page: Page
  78  |   readonly baseURL = "http://localhost:3000"
  79  | 
  80  |   constructor(page: Page) {
  81  |     this.page = page
  82  |   }
  83  | 
  84  |   async goto() {
  85  |     await this.page.goto(`${this.baseURL}/vendor/register`)
  86  |     await this.page.waitForLoadState("domcontentloaded")
  87  |     await this.page.waitForSelector("form", {
  88  |       state: "visible",
  89  |       timeout: 30000,
  90  |     })
  91  |   }
  92  | 
  93  |   async waitForPageReady() {
  94  |     await this.page.waitForLoadState("domcontentloaded")
  95  |     await this.page.waitForSelector("form", {
  96  |       state: "visible",
  97  |       timeout: 30000,
  98  |     })
  99  |   }
  100 | 
  101 |   getContinueButton(): Locator {
  102 |     return this.page.locator('button:has-text("Lanjutkan")')
  103 |   }
  104 | 
  105 |   getSubmitButton(): Locator {
  106 |     return this.page.locator('button:has-text("Kirim Data")')
  107 |   }
  108 | 
  109 |   getBackButton(): Locator {
  110 |     return this.page.locator('button:has-text("Kembali")')
  111 |   }
  112 | 
  113 |   getCancelButton(): Locator {
  114 |     return this.page.locator('button:has-text("Batal")')
  115 |   }
  116 | 
  117 |   getStepHeader(stepIndex: number): Locator {
  118 |     return this.page.locator(`#stepHeader${stepIndex}`)
  119 |   }
  120 | 
  121 |   async clickContinue() {
  122 |     await this.getContinueButton().click()
  123 |     await this.page.waitForTimeout(500)
  124 |   }
  125 | 
  126 |   async clickSubmit() {
  127 |     await this.getSubmitButton().click()
  128 |     await this.page.waitForTimeout(500)
  129 |   }
  130 | 
  131 |   async clickBack() {
  132 |     await this.getBackButton().click()
  133 |     await this.page.waitForTimeout(500)
  134 |   }
  135 | 
  136 |   async clickStep(stepIndex: number) {
  137 |     const step = this.getStepHeader(stepIndex)
  138 |     await step.click()
  139 |     await this.page.waitForTimeout(500)
  140 |   }
  141 | 
  142 |   async fillCompanyInfo(data: CompanyInfoData) {
  143 |     await this.page.waitForSelector("#nama_perusahaan", { timeout: 10000 })
  144 |     await this.page.fill("#nama_perusahaan", data.nama_perusahaan)
  145 |     await this.page.fill("#email", data.email)
  146 |     await this.page.fill("#nama_pic", data.nama_pic)
> 147 |     await this.page.fill("#kontak_pic", data.kontak_pic)
      |                     ^ Error: page.fill: Target page, context or browser has been closed
  148 | 
  149 |     if (data.website) {
  150 |       await this.page.fill("#website", data.website)
  151 |     }
  152 |     if (data.instagram) {
  153 |       await this.page.fill("#instagram", data.instagram)
  154 |     }
  155 |     if (data.facebook) {
  156 |       await this.page.fill("#facebook", data.facebook)
  157 |     }
  158 |     if (data.linkedin) {
  159 |       await this.page.fill("#linkedin", data.linkedin)
  160 |     }
  161 | 
  162 |     await this.page.fill('input[id="contact_1.no_hp"]', data.contact_1.no_hp)
  163 |     await this.page.fill('input[id="contact_1.nama"]', data.contact_1.nama)
  164 |     await this.page.fill(
  165 |       'input[id="contact_1.jabatan"]',
  166 |       data.contact_1.jabatan
  167 |     )
  168 | 
  169 |     await this.page.fill('input[id="contact_2.no_hp"]', data.contact_2.no_hp)
  170 |     await this.page.fill('input[id="contact_2.nama"]', data.contact_2.nama)
  171 |     await this.page.fill(
  172 |       'input[id="contact_2.jabatan"]',
  173 |       data.contact_2.jabatan
  174 |     )
  175 | 
  176 |     if (data.contact_3) {
  177 |       await this.page.fill('input[id="contact_3.no_hp"]', data.contact_3.no_hp)
  178 |       await this.page.fill('input[id="contact_3.nama"]', data.contact_3.nama)
  179 |       await this.page.fill(
  180 |         'input[id="contact_3.jabatan"]',
  181 |         data.contact_3.jabatan
  182 |       )
  183 |     }
  184 |   }
  185 | 
  186 |   async fillLegalDocuments(data: LegalDocumentsData) {
  187 |     if (data.ktp_file) {
  188 |       await this.page.locator('input[type="file"]').first().setInputFiles({
  189 |         name: "ktp.pdf",
  190 |         mimeType: "application/pdf",
  191 |         buffer: data.ktp_file,
  192 |       })
  193 |     }
  194 | 
  195 |     if (data.npwp_nomor) {
  196 |       await this.page.fill("#npwp_nomor", data.npwp_nomor)
  197 |     }
  198 |     if (data.npwp_file) {
  199 |       const npwpInputs = await this.page.locator('input[type="file"]').all()
  200 |       if (npwpInputs.length > 1) {
  201 |         await npwpInputs[1].setInputFiles({
  202 |           name: "npwp.pdf",
  203 |           mimeType: "application/pdf",
  204 |           buffer: data.npwp_file,
  205 |         })
  206 |       }
  207 |     }
  208 | 
  209 |     if (data.nib_nomor) {
  210 |       await this.page.fill("#nib_nomor", data.nib_nomor)
  211 |     }
  212 |     if (data.nib_file) {
  213 |       const nibInputs = await this.page.locator('input[type="file"]').all()
  214 |       if (nibInputs.length > 2) {
  215 |         await nibInputs[2].setInputFiles({
  216 |           name: "nib.pdf",
  217 |           mimeType: "application/pdf",
  218 |           buffer: data.nib_file,
  219 |         })
  220 |       }
  221 |     }
  222 | 
  223 |     if (data.siup_file) {
  224 |       const siupInputs = await this.page.locator('input[type="file"]').all()
  225 |       if (siupInputs.length > 3) {
  226 |         await siupInputs[3].setInputFiles({
  227 |           name: "siup.pdf",
  228 |           mimeType: "application/pdf",
  229 |           buffer: data.siup_file,
  230 |         })
  231 |       }
  232 |     }
  233 | 
  234 |     if (data.compro_file) {
  235 |       const comproInputs = await this.page.locator('input[type="file"]').all()
  236 |       if (comproInputs.length > 4) {
  237 |         await comproInputs[4].setInputFiles({
  238 |           name: "compro.pdf",
  239 |           mimeType: "application/pdf",
  240 |           buffer: data.compro_file,
  241 |         })
  242 |       }
  243 |     }
  244 |   }
  245 | 
  246 |   async fillBankAccount(data: BankData) {
  247 |     await this.page.fill("#bank_nama", data.bank_nama)
```