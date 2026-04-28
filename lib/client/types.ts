export type ClientProfileRecord = {
  id: string
  user_id: string | null
  client_name: string | null
  email: string | null
  phone: string | null
  client_type: string | null
  company_name_legal: string | null
  pic_name: string | null
  pic_position: string | null
  office_address: string | null
  province_id: string | null
  city_id: string | null
  verification_status: string | null
  verification_notes: string | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

export type ClientAccountSummary = {
  user_id: string
  nama: string
  nama_perusahaan: string | null
  email: string
  no_hp: string | null
}

export type ClientProfileView = ClientProfileRecord & {
  province_name: string | null
  city_name: string | null
}

export type ClientProjectListItem = {
  id: string
  name: string
  status: string | null
  location: string | null
  created_at: string | null
  updated_at: string | null
  job_type: string | null
}
