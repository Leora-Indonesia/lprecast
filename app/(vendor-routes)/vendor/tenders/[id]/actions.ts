"use server"

import { validateVendorTenderSubmission } from "@/lib/tenders/repository"

export async function validateVendorTenderSubmissionAction(tenderId: string) {
  if (!tenderId) {
    return {
      success: false as const,
      error: "Tender tidak ditemukan",
    }
  }

  return validateVendorTenderSubmission(tenderId)
}
