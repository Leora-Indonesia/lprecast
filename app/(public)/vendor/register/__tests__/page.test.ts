import { describe, it, expect } from "vitest"
import { z } from "zod"

const signupSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
    nama_perusahaan: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
    nama_pic: z.string().min(2, "Nama PIC minimal 2 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

type SignupForm = z.infer<typeof signupSchema>

describe("Vendor Register Page - signupSchema validation", () => {
  describe("Valid inputs", () => {
    it("should validate complete valid form data", () => {
      const validData: SignupForm = {
        email: "vendor@example.com",
        password: "securepass123",
        confirmPassword: "securepass123",
        nama_perusahaan: "PT Vendor Indonesia",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should accept company name with 2 characters", () => {
      const data: SignupForm = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        nama_perusahaan: "PT",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it("should accept PIC name with 2 characters", () => {
      const data: SignupForm = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        nama_perusahaan: "PT Test",
        nama_pic: "JD",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it("should accept password with exactly 8 characters", () => {
      const data: SignupForm = {
        email: "test@example.com",
        password: "pass1234",
        confirmPassword: "pass1234",
        nama_perusahaan: "PT Test",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe("Email validation", () => {
    it("should reject invalid email format", () => {
      const invalidEmails = [
        "not-an-email",
        "@example.com",
        "test@",
        "test@.com",
        "test..test@example.com",
      ]

      for (const email of invalidEmails) {
        const data = {
          email,
          password: "password123",
          confirmPassword: "password123",
          nama_perusahaan: "PT Test",
          nama_pic: "John Doe",
        }

        const result = signupSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          const emailError = result.error.issues.find((issue) =>
            issue.path.includes("email")
          )
          expect(emailError).toBeDefined()
        }
      }
    })

    it("should accept valid email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.id",
        "user+tag@example.com",
        "firstname.lastname@company.io",
      ]

      for (const email of validEmails) {
        const data = {
          email,
          password: "password123",
          confirmPassword: "password123",
          nama_perusahaan: "PT Test",
          nama_pic: "John Doe",
        }

        const result = signupSchema.safeParse(data)
        expect(result.success).toBe(true)
      }
    })
  })

  describe("Password validation", () => {
    it("should reject passwords shorter than 8 characters", () => {
      const shortPasswords = ["", "a", "1234567", "pass"]

      for (const password of shortPasswords) {
        const data = {
          email: "test@example.com",
          password,
          confirmPassword: password,
          nama_perusahaan: "PT Test",
          nama_pic: "John Doe",
        }

        const result = signupSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          const passwordError = result.error.issues.find((issue) =>
            issue.path.includes("password")
          )
          expect(passwordError).toBeDefined()
        }
      }
    })

    it("should accept long passwords", () => {
      const data = {
        email: "test@example.com",
        password: "a".repeat(100),
        confirmPassword: "a".repeat(100),
        nama_perusahaan: "PT Test",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe("Password confirmation validation", () => {
    it("should reject when passwords do not match", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
        nama_perusahaan: "PT Test",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        const confirmError = result.error.issues.find((issue) =>
          issue.path.includes("confirmPassword")
        )
        expect(confirmError?.message).toBe("Password tidak cocok")
      }
    })

    it("should accept when passwords match", () => {
      const data = {
        email: "test@example.com",
        password: "mypassword123",
        confirmPassword: "mypassword123",
        nama_perusahaan: "PT Test",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it("should reject when confirmPassword is empty", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "",
        nama_perusahaan: "PT Test",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe("Company name validation", () => {
    it("should reject company name with less than 2 characters", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        nama_perusahaan: "P",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        const companyError = result.error.issues.find((issue) =>
          issue.path.includes("nama_perusahaan")
        )
        expect(companyError?.message).toBe("Nama perusahaan minimal 2 karakter")
      }
    })

    it("should reject empty company name", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        nama_perusahaan: "",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe("PIC name validation", () => {
    it("should reject PIC name with less than 2 characters", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        nama_perusahaan: "PT Test",
        nama_pic: "A",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        const picError = result.error.issues.find((issue) =>
          issue.path.includes("nama_pic")
        )
        expect(picError?.message).toBe("Nama PIC minimal 2 karakter")
      }
    })

    it("should reject empty PIC name", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        nama_perusahaan: "PT Test",
        nama_pic: "",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe("Edge cases", () => {
    it("should handle all empty fields", () => {
      const data = {
        email: "",
        password: "",
        confirmPassword: "",
        nama_perusahaan: "",
        nama_pic: "",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })

    it("should handle whitespace-only values", () => {
      const data = {
        email: "   ",
        password: "        ",
        confirmPassword: "        ",
        nama_perusahaan: "  ",
        nama_pic: "  ",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it("should handle special characters in company name", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        nama_perusahaan: "PT. Test & Co., Ltd.",
        nama_pic: "John Doe",
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
