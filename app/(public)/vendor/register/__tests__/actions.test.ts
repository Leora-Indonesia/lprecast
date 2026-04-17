import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { signupAction } from "../actions"

describe("signupAction", () => {
  const mockSupabase = {
    auth: {
      signUp: vi.fn(),
    },
    from: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>
    )
  })

  const validSignupValues = {
    email: "test@example.com",
    password: "password123",
    nama_perusahaan: "PT Test Indonesia",
    nama_pic: "John Doe",
  }

  it("should successfully create user and redirect to success page", async () => {
    const mockUser = { id: "user-123", email: validSignupValues.email }
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })

    await signupAction(validSignupValues)

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: validSignupValues.email,
      password: validSignupValues.password,
      options: {
        data: {
          stakeholder_type: "vendor",
          nama: validSignupValues.nama_pic,
          nama_perusahaan: validSignupValues.nama_perusahaan,
        },
        emailRedirectTo: expect.stringContaining("/auth/callback"),
      },
    })
    expect(mockSupabase.from).toHaveBeenCalledWith("users")
    expect(redirect).toHaveBeenCalledWith("/vendor/register/success")
  })

  it("should return error when auth signUp fails with user already exists", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered" },
    })

    const result = await signupAction(validSignupValues)

    expect(result.success).toBe(false)
    expect(result.error).toContain("sudah terdaftar")
  })

  it("should return error for invalid email format", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "invalid email" },
    })

    const result = await signupAction(validSignupValues)

    expect(result.success).toBe(false)
    expect(result.error).toContain("Format email tidak valid")
  })

  it("should return error for weak password", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "weak password" },
    })

    const result = await signupAction(validSignupValues)

    expect(result.success).toBe(false)
    expect(result.error).toContain("Password terlalu lemah")
  })

  it("should return error for rate limit", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "rate limit exceeded", status: 429 },
    })

    const result = await signupAction(validSignupValues)

    expect(result.success).toBe(false)
    expect(result.error).toContain("Terlalu banyak percobaan")
  })

  it("should return error for unconfirmed email", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "Email not confirmed" },
    })

    const result = await signupAction(validSignupValues)

    expect(result.success).toBe(false)
    expect(result.error).toContain("Email belum dikonfirmasi")
  })

  it("should handle duplicate key error from users table gracefully", async () => {
    const mockUser = { id: "user-123", email: validSignupValues.email }
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        error: { code: "23505", message: "duplicate key value" },
      }),
    })

    await signupAction(validSignupValues)

    expect(redirect).toHaveBeenCalledWith("/vendor/register/success")
  })

  it("should handle other insert errors gracefully", async () => {
    const mockUser = { id: "user-123", email: validSignupValues.email }
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        error: { code: "OTHER_ERROR", message: "Some other error" },
      }),
    })

    await signupAction(validSignupValues)

    expect(redirect).toHaveBeenCalledWith("/vendor/register/success")
  })

  it("should return error when no user returned from signup", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await signupAction(validSignupValues)

    expect(result.success).toBe(false)
    expect(result.error).toContain("Gagal membuat akun")
  })

  it("should throw when redirect is called by Next.js", async () => {
    const mockUser = { id: "user-123", email: validSignupValues.email }
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })

    vi.mocked(redirect).mockImplementation(() => {
      const error = new Error("NEXT_REDIRECT")
      ;(error as Error & { digest?: string }).digest = "NEXT_REDIRECT"
      throw error
    })

    await expect(signupAction(validSignupValues)).rejects.toThrow(
      "NEXT_REDIRECT"
    )
  })

  it("should return generic error for unexpected errors", async () => {
    mockSupabase.auth.signUp.mockRejectedValue(new Error("Unexpected error"))

    const result = await signupAction(validSignupValues)

    expect(result.success).toBe(false)
    expect(result.error).toBe("Unexpected error")
  })
})
