# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vendor-register.spec.ts >> Vendor Registration Flow >> Step 3: Operational >> should navigate to step 4 when all operational fields valid
- Location: e2e/vendor-register.spec.ts:142:5

# Error details

```
TimeoutError: page.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#bank_nama')

```

# Page snapshot

```yaml
- generic:
  - generic:
    - banner:
      - generic:
        - generic:
          - link:
            - /url: /
            - generic:
              - img
            - generic: LPrecast
          - generic:
            - generic: Sudah punya akun?
            - button: Login
    - generic:
      - generic:
        - generic:
          - heading [level=1]: Pendaftaran Vendor Baru
          - paragraph: LPrecast Vendor Portal
        - generic:
          - generic:
            - generic:
              - generic:
                - img
              - generic: Informasi Perusahaan
            - generic:
              - generic:
                - img
              - generic: Dokumen Legal
            - generic:
              - generic:
                - generic: "3"
              - generic: Operasional
            - generic:
              - generic:
                - generic: "4"
              - generic: Review & Submit
        - generic:
          - generic:
            - generic:
              - heading [level=2]: Informasi Operasional & Produk
              - generic:
                - generic:
                  - generic: Nama Bank*
                  - combobox:
                    - text: Cari bank...
                    - img
                - generic:
                  - generic: Nomor Rekening*
                  - textbox:
                    - /placeholder: 10-16 digit angka
                  - paragraph: Masukkan nomor rekening 10-16 digit tanpa spasi atau tanda baca
                - generic:
                  - generic: Nama Pemilik Rekening (Sesuai Buku Bank)*
                  - textbox:
                    - /placeholder: PT. Maju Jaya
              - generic:
                - generic: Alamat Pabrik / Workshop Utama*
                - generic:
                  - generic:
                    - generic: Alamat Detail*
                    - textbox:
                      - /placeholder: Jl. Industri No. 123, Kawasan Industri Jababeka, Cikarang
                    - paragraph: "Contoh: Jl. Industri No. 123, Kawasan Industri Jababeka, Cikarang"
                  - generic:
                    - generic:
                      - generic: Provinsi*
                      - combobox:
                        - text: Cari Provinsi...
                        - img
                    - generic:
                      - generic: Kabupaten/Kota*
                      - combobox [disabled]:
                        - text: Pilih Provinsi dulu
                        - img
                  - generic:
                    - generic:
                      - generic: Kecamatan*
                      - textbox:
                        - /placeholder: Cikarang Selatan
                    - generic:
                      - generic: Kode Pos*
                      - textbox:
                        - /placeholder: "17530"
                  - generic:
                    - button:
                      - img
                      - text: Tampilkan Peta
              - generic:
                - generic:
                  - generic:
                    - heading [level=3]: Daftar Harga Produk
                    - paragraph: Kelola produk dan harga
                  - button:
                    - img
                    - text: Tambah Produk
                - generic:
                  - table:
                    - rowgroup:
                      - row:
                        - columnheader: "#"
                        - columnheader: Nama Item
                        - columnheader: Satuan
                        - columnheader: Harga (Rp)
                        - columnheader: Lead Time
                        - columnheader: MOQ
                        - columnheader: Aksi
                    - rowgroup:
                      - row:
                        - cell:
                          - generic:
                            - img
                            - paragraph: Belum ada produk ditambahkan
                            - paragraph: Klik "Tambah Produk" untuk memulai
                - paragraph:
                  - img
                  - text: Klik "Edit" untuk tambah informasi spesifikasi, lead time, MOQ, dan informasi tambahan lainnya
              - generic:
                - generic:
                  - generic:
                    - heading [level=3]: Area Pengiriman
                    - paragraph: Wilayah yang dapat dilayani
                - generic:
                  - img
                  - paragraph: Belum ada area pengiriman
                  - paragraph: Tambahkan area yang dapat Anda layani
                  - button:
                    - img
                    - text: Tambah Area
              - generic:
                - heading [level=3]: Biaya & Inklusi
                - paragraph: Komponen biaya dan inklusi dalam penawaran
                - generic:
                  - generic: Checklist Inklusi Biaya
                  - generic:
                    - generic:
                      - checkbox
                      - checkbox
                      - text: Mobilisasi & demobilisasi tukang
                    - generic:
                      - checkbox
                      - checkbox
                      - text: Penginapan tukang
                    - generic:
                      - checkbox
                      - checkbox
                      - text: Biaya pengiriman
                    - generic:
                      - checkbox
                      - checkbox
                      - text: Biaya langsir/bongkar muat
                    - generic:
                      - checkbox
                      - checkbox
                      - text: Instalasi/pemasangan
                    - generic:
                      - checkbox
                      - checkbox
                      - text: PPN 11%
                - generic:
                  - generic: Biaya Tambahan Lain
                  - generic:
                    - paragraph: Belum ada biaya tambahan
                  - button:
                    - img
                    - text: Tambah Biaya
          - generic:
            - button:
              - img
              - text: Kembali
            - button:
              - generic: Lanjutkan
              - img
      - generic: © 2024 LPrecast Vendor Portal. Butuh bantuan? Hubungi Admin.
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e6] [cursor=pointer]:
    - img [ref=e7]
  - alert
  - dialog "Draft Tersimpan" [ref=e11]:
    - generic [ref=e12]:
      - heading "Draft Tersimpan" [level=2] [ref=e13]
      - paragraph [ref=e14]: Ditemukan draft yang tersimpan pada 14 Apr 2026, 15.17. Apakah Anda ingin melanjutkan draft tersebut?
    - generic [ref=e15]:
      - button "Mulai Baru" [active] [ref=e16]
      - button "Lanjutkan" [ref=e17]
    - button "Close" [ref=e18]:
      - img [ref=e19]
      - generic [ref=e22]: Close
```

# Test source

```ts
  147 |     await this.page.fill("#kontak_pic", data.kontak_pic)
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
> 247 |     await this.page.fill("#bank_nama", data.bank_nama)
      |                     ^ TimeoutError: page.fill: Timeout 30000ms exceeded.
  248 |     await this.page.fill("#bank_nomor", data.bank_nomor)
  249 |     await this.page.fill("#bank_atas_nama", data.bank_atas_nama)
  250 |   }
  251 | 
  252 |   async fillFactoryAddress(data: FactoryAddressData) {
  253 |     await this.page.fill("#alamat_detail", data.alamat_detail)
  254 | 
  255 |     await this.page.click('[data-slot="select-trigger"] >> text=Pilih Provinsi')
  256 |     await this.page.waitForTimeout(300)
  257 |     await this.page.keyboard.type(data.provinsi_id, { delay: 100 })
  258 |     await this.page.keyboard.press("Enter")
  259 |     await this.page.waitForTimeout(500)
  260 | 
  261 |     await this.page.click(
  262 |       '[data-slot="select-trigger"] >> text=Pilih Kabupaten'
  263 |     )
  264 |     await this.page.waitForTimeout(300)
  265 |     await this.page.keyboard.type(data.kabupaten_id, { delay: 100 })
  266 |     await this.page.keyboard.press("Enter")
  267 |     await this.page.waitForTimeout(500)
  268 | 
  269 |     await this.page.fill("#kecamatan", data.kecamatan)
  270 |     await this.page.fill("#kode_pos", data.kode_pos)
  271 |   }
  272 | 
  273 |   async addProduct(product: ProductData) {
  274 |     await this.page.click('button:has-text("Tambah Produk")')
  275 |     await this.page.waitForTimeout(500)
  276 | 
  277 |     await this.page.fill('input[id="product-name"]', product.name)
  278 |     await this.page.fill('input[id="product-satuan"]', product.satuan)
  279 |     await this.page.fill('input[id="product-price"]', product.price.toString())
  280 | 
  281 |     if (product.dimensions) {
  282 |       await this.page.fill('input[id="product-dimensions"]', product.dimensions)
  283 |     }
  284 |     if (product.material) {
  285 |       await this.page.fill('input[id="product-material"]', product.material)
  286 |     }
  287 |     if (product.finishing) {
  288 |       await this.page.fill('input[id="product-finishing"]', product.finishing)
  289 |     }
  290 |     if (product.berat) {
  291 |       await this.page.fill(
  292 |         'input[id="product-berat"]',
  293 |         product.berat.toString()
  294 |       )
  295 |     }
  296 |     if (product.lead_time_days) {
  297 |       await this.page.fill(
  298 |         'input[id="product-lead-time"]',
  299 |         product.lead_time_days.toString()
  300 |       )
  301 |     }
  302 |     if (product.moq) {
  303 |       await this.page.fill('input[id="product-moq"]', product.moq.toString())
  304 |     }
  305 |     if (product.description) {
  306 |       await this.page.fill(
  307 |         'textarea[id="product-description"]',
  308 |         product.description
  309 |       )
  310 |     }
  311 | 
  312 |     await this.page.click('button:has-text("Simpan")')
  313 |     await this.page.waitForTimeout(500)
  314 |   }
  315 | 
  316 |   async addDeliveryArea(area: DeliveryAreaData) {
  317 |     await this.page.click('button:has-text("Tambah Area")')
  318 |     await this.page.waitForTimeout(500)
  319 | 
  320 |     await this.page.keyboard.type(area.city_name, { delay: 100 })
  321 |     await this.page.waitForTimeout(300)
  322 |     await this.page.keyboard.press("Enter")
  323 |     await this.page.waitForTimeout(500)
  324 | 
  325 |     await this.page.click('button:has-text("Simpan")')
  326 |     await this.page.waitForTimeout(500)
  327 |   }
  328 | 
  329 |   async fillCostInclusions(inclusions: OperationalData["cost_inclusions"]) {
  330 |     if (!inclusions) return
  331 | 
  332 |     if (inclusions.mobilisasi) {
  333 |       await this.page.check("#mobilisasi")
  334 |     }
  335 |     if (inclusions.penginapan) {
  336 |       await this.page.check("#penginapan")
  337 |     }
  338 |     if (inclusions.pengiriman) {
  339 |       await this.page.check("#pengiriman")
  340 |     }
  341 |     if (inclusions.langsir) {
  342 |       await this.page.check("#langsir")
  343 |     }
  344 |     if (inclusions.instalasi) {
  345 |       await this.page.check("#instalasi")
  346 |     }
  347 |     if (inclusions.ppn) {
```