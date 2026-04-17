import { test, expect } from "@playwright/test"
import {
  VendorRegisterPage,
  defaultCompanyInfo,
  defaultLegalDocuments,
  defaultBank,
  defaultFactoryAddress,
  defaultProduct,
  defaultDeliveryArea,
} from "./helpers/vendor-registration"

test.describe("Vendor Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    const registerPage = new VendorRegisterPage(page)
    await registerPage.goto()
    await registerPage.waitForPageReady()
    await registerPage.dismissDraftDialog()
  })

  test.describe("Step 1: Company Info", () => {
    test("should show validation errors when submitting empty form", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)
      await registerPage.clickContinue()

      const toast = await registerPage.getToastMessage()
      expect(toast).toContain("Lengkapi semua field")
    })

    test("should fill company info and navigate to step 2", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await registerPage.clickContinue()

      const onStep2 = await registerPage.isOnStep(1)
      expect(onStep2).toBe(true)
    })

    test("should show specific field errors for company info", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.page.fill("#nama_perusahaan", "")
      await registerPage.page.fill("#email", "invalid-email")
      await registerPage.page.fill("#kontak_pic", "123")
      await registerPage.clickContinue()

      await expect(
        page.locator("text=Nama perusahaan wajib diisi")
      ).toBeVisible()
      await expect(page.locator("text=Format email tidak valid")).toBeVisible()
    })
  })

  test.describe("Step 2: Legal Documents", () => {
    test.beforeEach(async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)
      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await registerPage.clickContinue()
    })

    test("should require KTP file", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.clickContinue()

      const toast = await registerPage.getToastMessage()
      expect(toast).toContain("Lengkapi semua field")
    })

    test("should fill legal documents and navigate to step 3", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillLegalDocuments(defaultLegalDocuments)
      await registerPage.clickContinue()

      const onStep3 = await registerPage.isOnStep(2)
      expect(onStep3).toBe(true)
    })

    test("should show NPWP number validation error", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.page.fill("#npwp_nomor", "123")
      await registerPage.clickContinue()

      await expect(page.locator("text=NPWP harus 16 digit")).toBeVisible()
    })

    test("should show NIB number validation error", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.page.fill("#nib_nomor", "123")
      await registerPage.clickContinue()

      await expect(page.locator("text=NIB harus 13 digit")).toBeVisible()
    })
  })

  test.describe("Step 3: Operational", () => {
    test.beforeEach(async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)
      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await registerPage.clickContinue()
      await registerPage.fillLegalDocuments(defaultLegalDocuments)
      await registerPage.clickContinue()
    })

    test("should show validation errors for empty bank and address", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.clickContinue()

      const toast = await registerPage.getToastMessage()
      expect(toast).toContain("Lengkapi semua field")
    })

    test("should fill operational form completely", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillBankAccount(defaultBank)
      await registerPage.fillFactoryAddress(defaultFactoryAddress)

      await expect(page.locator("#bank_nama")).toHaveValue(
        defaultBank.bank_nama
      )
      await expect(page.locator("#bank_nomor")).toHaveValue(
        defaultBank.bank_nomor
      )
    })

    test("should navigate to step 4 when all operational fields valid", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillBankAccount(defaultBank)
      await registerPage.fillFactoryAddress(defaultFactoryAddress)
      await registerPage.addProduct(defaultProduct)
      await registerPage.addDeliveryArea(defaultDeliveryArea)
      await registerPage.clickContinue()

      const onStep4 = await registerPage.isOnStep(3)
      expect(onStep4).toBe(true)
    })
  })

  test.describe("Step 4: Review & Submit", () => {
    test.beforeEach(async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)
      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await registerPage.clickContinue()
      await registerPage.fillLegalDocuments(defaultLegalDocuments)
      await registerPage.clickContinue()
      await registerPage.fillBankAccount(defaultBank)
      await registerPage.fillFactoryAddress(defaultFactoryAddress)
      await registerPage.addProduct(defaultProduct)
      await registerPage.addDeliveryArea(defaultDeliveryArea)
      await registerPage.clickContinue()
    })

    test("should show review page with all data", async ({ page }) => {
      await expect(page.locator("text=Review & Submit")).toBeVisible()
      await expect(page.locator("text=PT Test Vendor Indonesia")).toBeVisible()
    })

    test("should show validation error when legal agreement not checked", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.clickSubmit()

      const toast = await registerPage.getToastMessage()
      expect(toast).toContain("Lengkapi semua field")
    })

    test("should allow navigation back to previous steps", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.clickBack()

      const onStep3 = await registerPage.isOnStep(2)
      expect(onStep3).toBe(true)
    })
  })

  test.describe("Step Navigation", () => {
    test("should allow clicking on completed steps", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await registerPage.clickContinue()

      await registerPage.clickBack()
      const onStep1 = await registerPage.isOnStep(0)
      expect(onStep1).toBe(true)

      await registerPage.clickStep(0)
      const backOnStep1 = await registerPage.isOnStep(0)
      expect(backOnStep1).toBe(true)
    })
  })

  test.describe("Draft Persistence", () => {
    test("should show draft restore dialog when returning with saved data", async ({
      page,
    }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await page.waitForTimeout(1000)

      await registerPage.goto()

      const dialog = page.locator('[role="dialog"]')
      await expect(dialog).toBeVisible()
      await expect(page.locator("text=Draft Tersimpan")).toBeVisible()
    })

    test("should start fresh when clicking Mulai Baru", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await page.waitForTimeout(1000)

      await registerPage.goto()

      await page.click('button:has-text("Mulai Baru")')
      await page.waitForTimeout(500)

      await expect(page.locator("#nama_perusahaan")).toHaveValue("")
    })

    test("should continue draft when clicking Lanjutkan", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await page.waitForTimeout(1000)

      await registerPage.goto()

      await page.click('button:has-text("Lanjutkan")')
      await page.waitForTimeout(500)

      await expect(page.locator("#nama_perusahaan")).toHaveValue(
        defaultCompanyInfo.nama_perusahaan
      )
    })
  })

  test.describe("Full Registration Flow", () => {
    test("should complete full registration flow @slow", async ({ page }) => {
      const registerPage = new VendorRegisterPage(page)

      await registerPage.fillCompanyInfo(defaultCompanyInfo)
      await registerPage.clickContinue()

      await registerPage.fillLegalDocuments(defaultLegalDocuments)
      await registerPage.clickContinue()

      await registerPage.fillBankAccount(defaultBank)
      await registerPage.fillFactoryAddress(defaultFactoryAddress)
      await registerPage.addProduct(defaultProduct)
      await registerPage.addDeliveryArea(defaultDeliveryArea)
      await registerPage.clickContinue()

      await registerPage.acceptLegalAgreement()
      await registerPage.clickSubmit()

      await registerPage.waitForSuccessRedirect()
      await expect(page).toHaveURL("**/vendor/register/success")
    })
  })
})
