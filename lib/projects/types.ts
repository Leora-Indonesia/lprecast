import type { Enums } from "@/types/database.types"

import type { ProjectAttachmentMetadata, ProjectFormSection } from "@/lib/validations/project"

export type ProjectStatus = Enums<"project_status">
export type MilestoneStatus = Enums<"milestone_status">

export type ProjectListItem = {
  id: string
  name: string
  location: string | null
  status: ProjectStatus
  start_date: string | null
  end_date: string | null
  created_at: string | null
  updated_at: string | null
}

export type ProjectSummary = {
  total: number
  draft: number
  open: number
  in_progress: number
  completed: number
  cancelled: number
}

export type ProjectAttachment = ProjectAttachmentMetadata & {
  download_url?: string | null
}

export type ProjectMilestone = {
  id: string
  project_id: string
  title: string
  description: string | null
  due_date: string
  status: MilestoneStatus
  created_at: string | null
  updated_at: string | null
  completed_at: string | null
}

export type ProjectDetail = {
  id: string
  name: string
  location: string | null
  status: ProjectStatus
  start_date: string | null
  end_date: string | null
  description: string | null
  customer_name: string | null
  client_id: string | null
  client_profile_id: string | null
  contract_value: number
  site_address_full: string | null
  province_id: string | null
  city_id: string | null
  site_coordinates: string | null
  job_type: string | null
  estimated_length_or_area: number | null
  measurement_unit: string | null
  target_completion_date: string | null
  budget_min: number | null
  budget_max: number | null
  initial_description: string | null
  site_condition: string | null
  vehicle_access: string | null
  special_requirements: string | null
  estimated_height: string | null
  foundation_preference: string | null
  internal_notes: string | null
  qualification_status: string | null
  qualification_notes: string | null
  created_at: string | null
  updated_at: string | null
  attachments: ProjectAttachment[]
  milestones: ProjectMilestone[]
}

export type ProjectSectionMeta = {
  id: ProjectFormSection
  title: string
  description: string
}

export type ProjectListFilters = {
  search?: string
  status?: ProjectStatus | "all"
}
