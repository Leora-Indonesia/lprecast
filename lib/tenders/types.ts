import type { Enums } from "@/types/database.types"

export type TenderStatus = Enums<"tender_status">

export type TenderItem = {
  id: string
  tender_id: string
  name: string
  quantity: number
  unit: string | null
  description: string | null
  created_at: string | null
}

export type TenderProjectSummary = {
  id: string
  name: string
  location: string | null
  status: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
}

export type TenderDetail = {
  id: string
  title: string
  description: string | null
  project_id: string
  status: TenderStatus
  min_vendors: number | null
  submission_deadline_at: string | null
  revision_deadline_hours: number | null
  created_by: string
  created_at: string | null
  updated_at: string | null
  project: TenderProjectSummary | null
  items: TenderItem[]
}

export type VendorOpenTender = {
  tender_id: string
  tender_title: string
  tender_description: string | null
  tender_status: TenderStatus | null
  min_vendors: number | null
  submission_deadline_at?: string | null
  revision_deadline_hours: number | null
  tender_created_at: string | null
  tender_updated_at: string | null
  project_id: string
  project_name: string
  project_location: string | null
  project_start_date: string | null
  project_end_date: string | null
  project_description: string | null
  has_submitted?: boolean
  submission_status?: string | null
}

export type VendorTenderDetail = VendorOpenTender & {
  items: TenderItem[]
}
