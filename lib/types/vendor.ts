import type { Database } from "@/types/database.types"

export type VendorRegistration =
  Database["public"]["Tables"]["vendor_registrations"]["Row"]
export type VendorRegistrationInsert =
  Database["public"]["Tables"]["vendor_registrations"]["Insert"]
export type VendorRegistrationUpdate =
  Database["public"]["Tables"]["vendor_registrations"]["Update"]

export type VendorOnboardingDraft =
  Database["public"]["Tables"]["vendor_onboarding_drafts"]["Row"]
export type VendorOnboardingDraftInsert =
  Database["public"]["Tables"]["vendor_onboarding_drafts"]["Insert"]
export type VendorOnboardingDraftUpdate =
  Database["public"]["Tables"]["vendor_onboarding_drafts"]["Update"]

export type VendorDocument =
  Database["public"]["Tables"]["vendor_documents"]["Row"]
export type VendorDocumentInsert =
  Database["public"]["Tables"]["vendor_documents"]["Insert"]
export type VendorDocumentUpdate =
  Database["public"]["Tables"]["vendor_documents"]["Update"]

export type VendorContacts =
  Database["public"]["Tables"]["vendor_contacts"]["Row"]
export type VendorContactsInsert =
  Database["public"]["Tables"]["vendor_contacts"]["Insert"]
export type VendorContactsUpdate =
  Database["public"]["Tables"]["vendor_contacts"]["Update"]

export type VendorBankAccount =
  Database["public"]["Tables"]["vendor_bank_accounts"]["Row"]
export type VendorBankAccountInsert =
  Database["public"]["Tables"]["vendor_bank_accounts"]["Insert"]
export type VendorBankAccountUpdate =
  Database["public"]["Tables"]["vendor_bank_accounts"]["Update"]

export type VendorFactoryAddress =
  Database["public"]["Tables"]["vendor_factory_addresses"]["Row"]
export type VendorFactoryAddressInsert =
  Database["public"]["Tables"]["vendor_factory_addresses"]["Insert"]
export type VendorFactoryAddressUpdate =
  Database["public"]["Tables"]["vendor_factory_addresses"]["Update"]

export type VendorProduct =
  Database["public"]["Tables"]["vendor_products"]["Row"]
export type VendorProductInsert =
  Database["public"]["Tables"]["vendor_products"]["Insert"]
export type VendorProductUpdate =
  Database["public"]["Tables"]["vendor_products"]["Update"]

export type VendorDeliveryArea =
  Database["public"]["Tables"]["vendor_delivery_areas"]["Row"]
export type VendorDeliveryAreaInsert =
  Database["public"]["Tables"]["vendor_delivery_areas"]["Insert"]
export type VendorDeliveryAreaUpdate =
  Database["public"]["Tables"]["vendor_delivery_areas"]["Update"]

export type VendorCostInclusion =
  Database["public"]["Tables"]["vendor_cost_inclusions"]["Row"]
export type VendorCostInclusionInsert =
  Database["public"]["Tables"]["vendor_cost_inclusions"]["Insert"]
export type VendorCostInclusionUpdate =
  Database["public"]["Tables"]["vendor_cost_inclusions"]["Update"]

export type VendorAdditionalCost =
  Database["public"]["Tables"]["vendor_additional_costs"]["Row"]
export type VendorAdditionalCostInsert =
  Database["public"]["Tables"]["vendor_additional_costs"]["Insert"]
export type VendorAdditionalCostUpdate =
  Database["public"]["Tables"]["vendor_additional_costs"]["Update"]

export type VendorProfile =
  Database["public"]["Tables"]["vendor_profiles"]["Row"]
export type VendorProfileInsert =
  Database["public"]["Tables"]["vendor_profiles"]["Insert"]
export type VendorProfileUpdate =
  Database["public"]["Tables"]["vendor_profiles"]["Update"]

export type Tender = Database["public"]["Tables"]["tenders"]["Row"]
export type TenderInsert = Database["public"]["Tables"]["tenders"]["Insert"]
export type TenderUpdate = Database["public"]["Tables"]["tenders"]["Update"]

export type TenderItem = Database["public"]["Tables"]["tender_items"]["Row"]
export type TenderItemInsert =
  Database["public"]["Tables"]["tender_items"]["Insert"]
export type TenderItemUpdate =
  Database["public"]["Tables"]["tender_items"]["Update"]

export type TenderSubmission =
  Database["public"]["Tables"]["tender_submissions"]["Row"]
export type TenderSubmissionInsert =
  Database["public"]["Tables"]["tender_submissions"]["Insert"]
export type TenderSubmissionUpdate =
  Database["public"]["Tables"]["tender_submissions"]["Update"]

export type TenderSubmissionItem =
  Database["public"]["Tables"]["tender_submission_items"]["Row"]
export type TenderSubmissionItemInsert =
  Database["public"]["Tables"]["tender_submission_items"]["Insert"]
export type TenderSubmissionItemUpdate =
  Database["public"]["Tables"]["tender_submission_items"]["Update"]

export type ProjectMilestone =
  Database["public"]["Tables"]["project_milestones"]["Row"]
export type ProjectMilestoneInsert =
  Database["public"]["Tables"]["project_milestones"]["Insert"]
export type ProjectMilestoneUpdate =
  Database["public"]["Tables"]["project_milestones"]["Update"]

export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type NotificationInsert =
  Database["public"]["Tables"]["notifications"]["Insert"]
export type NotificationUpdate =
  Database["public"]["Tables"]["notifications"]["Update"]

export type PaymentRequest =
  Database["public"]["Tables"]["payment_requests"]["Row"]
export type PaymentRequestInsert =
  Database["public"]["Tables"]["payment_requests"]["Insert"]
export type PaymentRequestUpdate =
  Database["public"]["Tables"]["payment_requests"]["Update"]
