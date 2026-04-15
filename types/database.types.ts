export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      master_cities: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          province_id: string
          type: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id: string
          name: string
          province_id: string
          type: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          province_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_cities_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "master_provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      master_provinces: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: Database["public"]["Enums"]["notification_category"]
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_requests: {
        Row: {
          amount: number
          attachments: Json | null
          client_approved_at: string | null
          client_approved_by: string | null
          created_at: string | null
          finance_verified_at: string | null
          finance_verified_by: string | null
          id: string
          notes: string | null
          requested_by: string
          status: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at: string | null
          vendor_spk_id: string
        }
        Insert: {
          amount: number
          attachments?: Json | null
          client_approved_at?: string | null
          client_approved_by?: string | null
          created_at?: string | null
          finance_verified_at?: string | null
          finance_verified_by?: string | null
          id?: string
          notes?: string | null
          requested_by: string
          status?: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at?: string | null
          vendor_spk_id: string
        }
        Update: {
          amount?: number
          attachments?: Json | null
          client_approved_at?: string | null
          client_approved_by?: string | null
          created_at?: string | null
          finance_verified_at?: string | null
          finance_verified_by?: string | null
          id?: string
          notes?: string | null
          requested_by?: string
          status?: Database["public"]["Enums"]["payment_request_status"] | null
          updated_at?: string | null
          vendor_spk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_client_approved_by_fkey"
            columns: ["client_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_finance_verified_by_fkey"
            columns: ["finance_verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_vendor_spk_id_fkey"
            columns: ["vendor_spk_id"]
            isOneToOne: false
            referencedRelation: "vendor_spk"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string
          id: string
          project_id: string
          status: Database["public"]["Enums"]["milestone_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date: string
          id?: string
          project_id: string
          status?: Database["public"]["Enums"]["milestone_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string
          id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["milestone_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          contract_value: number
          created_at: string | null
          customer_name: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          contract_value?: number
          created_at?: string | null
          customer_name: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          contract_value?: number
          created_at?: string | null
          customer_name?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          quantity: number
          tender_id: string
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          quantity: number
          tender_id: string
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          quantity?: number
          tender_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tender_items_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_submission_history: {
        Row: {
          created_at: string | null
          id: string
          revised_by: string
          revision_count: number
          snapshot: Json
          submission_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          revised_by: string
          revision_count: number
          snapshot: Json
          submission_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          revised_by?: string
          revision_count?: number
          snapshot?: Json
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_submission_history_revised_by_fkey"
            columns: ["revised_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_submission_history_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "tender_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_submission_items: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          submission_id: string
          tender_item_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          submission_id: string
          tender_item_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          submission_id?: string
          tender_item_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "tender_submission_items_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "tender_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_submission_items_tender_item_id_fkey"
            columns: ["tender_item_id"]
            isOneToOne: false
            referencedRelation: "tender_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_submissions: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_revised: boolean | null
          last_revised_at: string | null
          notes: string | null
          revision_count: number | null
          status: Database["public"]["Enums"]["tender_submission_status"] | null
          submitted_at: string | null
          tender_id: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_revised?: boolean | null
          last_revised_at?: string | null
          notes?: string | null
          revision_count?: number | null
          status?:
            | Database["public"]["Enums"]["tender_submission_status"]
            | null
          submitted_at?: string | null
          tender_id: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_revised?: boolean | null
          last_revised_at?: string | null
          notes?: string | null
          revision_count?: number | null
          status?:
            | Database["public"]["Enums"]["tender_submission_status"]
            | null
          submitted_at?: string | null
          tender_id?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_submissions_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_submissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          min_vendors: number | null
          project_id: string
          revision_deadline_hours: number | null
          status: Database["public"]["Enums"]["tender_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          min_vendors?: number | null
          project_id: string
          revision_deadline_hours?: number | null
          status?: Database["public"]["Enums"]["tender_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          min_vendors?: number | null
          project_id?: string
          revision_deadline_hours?: number | null
          status?: Database["public"]["Enums"]["tender_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          nama: string
          no_hp: string | null
          signature_image: string | null
          stakeholder_type: Database["public"]["Enums"]["stakeholder_type"]
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          nama: string
          no_hp?: string | null
          signature_image?: string | null
          stakeholder_type?: Database["public"]["Enums"]["stakeholder_type"]
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          nama?: string
          no_hp?: string | null
          signature_image?: string | null
          stakeholder_type?: Database["public"]["Enums"]["stakeholder_type"]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      vendor_additional_costs: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          description: string
          id?: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_contacts: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          jabatan: string | null
          nama: string
          no_hp: string | null
          sequence: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          jabatan?: string | null
          nama: string
          no_hp?: string | null
          sequence: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          jabatan?: string | null
          nama?: string
          no_hp?: string | null
          sequence?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_cost_inclusions: {
        Row: {
          created_at: string | null
          id: string
          inclusion_type: string
          is_included: boolean | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inclusion_type: string
          is_included?: boolean | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inclusion_type?: string
          is_included?: boolean | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_delivery_areas: {
        Row: {
          city_id: string | null
          city_name: string | null
          created_at: string | null
          id: string
          province_id: string | null
          province_name: string | null
          user_id: string
        }
        Insert: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          id?: string
          province_id?: string | null
          province_name?: string | null
          user_id: string
        }
        Update: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          id?: string
          province_id?: string | null
          province_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_documents: {
        Row: {
          document_number: string | null
          document_type: string
          file_name: string | null
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          uploaded_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_number?: string | null
          document_type: string
          file_name?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_number?: string | null
          document_type?: string
          file_name?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      vendor_factory_addresses: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          kabupaten: string | null
          kecamatan: string | null
          latitude: number | null
          longitude: number | null
          map_url: string | null
          postal_code: string | null
          province: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          kabupaten?: string | null
          kecamatan?: string | null
          latitude?: number | null
          longitude?: number | null
          map_url?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          kabupaten?: string | null
          kecamatan?: string | null
          latitude?: number | null
          longitude?: number | null
          map_url?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_kpi_scores: {
        Row: {
          created_at: string | null
          id: string
          period_month: number
          period_year: number
          project_id: string
          score_client_satisfaction: number | null
          score_quality: number | null
          score_report_completeness: number | null
          score_responsiveness: number | null
          score_upload_timeliness: number | null
          total_score: number | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          period_month: number
          period_year: number
          project_id: string
          score_client_satisfaction?: number | null
          score_quality?: number | null
          score_report_completeness?: number | null
          score_responsiveness?: number | null
          score_upload_timeliness?: number | null
          total_score?: number | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          period_month?: number
          period_year?: number
          project_id?: string
          score_client_satisfaction?: number | null
          score_quality?: number | null
          score_report_completeness?: number | null
          score_responsiveness?: number | null
          score_upload_timeliness?: number | null
          total_score?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_kpi_scores_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_kpi_scores_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_onboarding_drafts: {
        Row: {
          created_at: string | null
          current_step: number
          draft_data: Json
          id: string
          last_saved_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_step?: number
          draft_data?: Json
          id?: string
          last_saved_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_step?: number
          draft_data?: Json
          id?: string
          last_saved_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_payment: {
        Row: {
          catatan: string | null
          created_at: string | null
          id: string
          jenis_pembayaran: Database["public"]["Enums"]["vendor_payment_jenis"]
          jumlah: number
          lampiran: Json | null
          tanggal_pembayaran: string
          vendor_spk_id: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          jenis_pembayaran: Database["public"]["Enums"]["vendor_payment_jenis"]
          jumlah: number
          lampiran?: Json | null
          tanggal_pembayaran: string
          vendor_spk_id: string
        }
        Update: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          jenis_pembayaran?: Database["public"]["Enums"]["vendor_payment_jenis"]
          jumlah?: number
          lampiran?: Json | null
          tanggal_pembayaran?: string
          vendor_spk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payment_vendor_spk_id_fkey"
            columns: ["vendor_spk_id"]
            isOneToOne: false
            referencedRelation: "vendor_spk"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_products: {
        Row: {
          created_at: string | null
          description: string | null
          dimensions: string | null
          finishing: string | null
          id: string
          is_active: boolean | null
          lead_time_days: number | null
          material: string | null
          moq: number | null
          name: string
          price: number
          satuan: string
          updated_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          finishing?: string | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          material?: string | null
          moq?: number | null
          name: string
          price?: number
          satuan: string
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          finishing?: string | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          material?: string | null
          moq?: number | null
          name?: string
          price?: number
          satuan?: string
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      vendor_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          email_perusahaan: string | null
          facebook: string | null
          instagram: string | null
          kontak_pic: string | null
          linkedin: string | null
          nama_perusahaan: string
          nama_pic: string
          status: string
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          email_perusahaan?: string | null
          facebook?: string | null
          instagram?: string | null
          kontak_pic?: string | null
          linkedin?: string | null
          nama_perusahaan: string
          nama_pic: string
          status?: string
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          email_perusahaan?: string | null
          facebook?: string | null
          instagram?: string | null
          kontak_pic?: string | null
          linkedin?: string | null
          nama_perusahaan?: string
          nama_pic?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      vendor_progress: {
        Row: {
          catatan: string | null
          created_at: string | null
          id: string
          lampiran: Json | null
          progress_percent: number
          rejection_notes: string | null
          status: Database["public"]["Enums"]["progress_status"] | null
          tanggal: string
          vendor_spk_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          lampiran?: Json | null
          progress_percent: number
          rejection_notes?: string | null
          status?: Database["public"]["Enums"]["progress_status"] | null
          tanggal: string
          vendor_spk_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          lampiran?: Json | null
          progress_percent?: number
          rejection_notes?: string | null
          status?: Database["public"]["Enums"]["progress_status"] | null
          tanggal?: string
          vendor_spk_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_progress_vendor_spk_id_fkey"
            columns: ["vendor_spk_id"]
            isOneToOne: false
            referencedRelation: "vendor_spk"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_progress_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_registrations: {
        Row: {
          approval_notes: string | null
          created_at: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_notes?: string | null
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_notes?: string | null
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_spk: {
        Row: {
          created_at: string | null
          id: string
          nilai_spk: number
          pekerjaan: string
          project_id: string
          status: Database["public"]["Enums"]["vendor_spk_status"] | null
          updated_at: string | null
          vendor_id: string | null
          vendor_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nilai_spk?: number
          pekerjaan: string
          project_id: string
          status?: Database["public"]["Enums"]["vendor_spk_status"] | null
          updated_at?: string | null
          vendor_id?: string | null
          vendor_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nilai_spk?: number
          pekerjaan?: string
          project_id?: string
          status?: Database["public"]["Enums"]["vendor_spk_status"] | null
          updated_at?: string | null
          vendor_id?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_spk_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_spk_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: { Args: never; Returns: string }
      is_client: { Args: never; Returns: boolean }
      is_internal_user: { Args: never; Returns: boolean }
      is_vendor: { Args: never; Returns: boolean }
    }
    Enums: {
      cost_inclusion_type:
        | "mobilisasi_demobilisasi"
        | "penginapan_tukang"
        | "biaya_pengiriman"
        | "biaya_langsir"
        | "instalasi"
        | "ppn"
      customer_payment_termin: "dp" | "term" | "final"
      document_verification_status: "pending" | "verified" | "rejected"
      kebutuhan_type:
        | "Pagar"
        | "Gudang"
        | "Kos/Kontrakan"
        | "Toko/Ruko"
        | "Rumah"
        | "Villa"
        | "Hotel"
        | "Rumah Sakit"
        | "Panel Saja"
        | "U-Ditch"
        | "Plastik Board"
        | "Lapangan"
        | "Sekolah"
        | "Kantor"
        | "Tahu Beton"
      letter_action_type:
        | "CREATED"
        | "SUBMITTED"
        | "APPROVED_REVIEW"
        | "APPROVED_FINAL"
        | "REJECTED"
        | "REVISION_REQUESTED"
        | "REVISED"
        | "CANCELLED"
      letter_status:
        | "DRAFT"
        | "SUBMITTED_TO_REVIEW"
        | "REVIEWED"
        | "APPROVED"
        | "REJECTED"
        | "REVISION_REQUESTED"
      meeting_status_enum: "draft" | "published"
      meeting_type_enum: "internal" | "external"
      milestone_status: "pending" | "completed" | "overdue"
      notification_category:
        | "vendor"
        | "tender"
        | "monitoring"
        | "payment"
        | "document"
        | "rab"
        | "general"
      payment_request_status:
        | "pending"
        | "finance_verified"
        | "client_approved"
        | "paid"
        | "rejected"
      produk_type:
        | "Panel Beton"
        | "Pagar Beton"
        | "Sandwich Panel"
        | "Panel Surya"
        | "Plastik Board"
        | "Ponton Terapung"
        | "Jasa Konstruksi"
        | "Jasa Renovasi"
        | "Jasa RAB/Gambar"
        | "U-Ditch"
        | "Tahu Beton"
      progress_status: "submitted" | "approved" | "rejected"
      project_status:
        | "draft"
        | "open"
        | "in_progress"
        | "completed"
        | "cancelled"
      sales_stage:
        | "IG_Lead"
        | "WA_Negotiation"
        | "Quotation_Sent"
        | "Follow_Up"
        | "Invoice_Deal"
        | "WIP"
        | "Finish"
        | "Cancelled"
      stakeholder_type: "internal" | "vendor" | "client"
      tender_status: "open" | "closed" | "cancelled" | "awarded"
      tender_submission_status: "submitted" | "won" | "lost"
      vendor_document_type:
        | "ktp"
        | "npwp"
        | "nib"
        | "siup_sbu"
        | "company_profile"
      vendor_payment_jenis: "dp" | "term" | "pelunasan"
      vendor_profile_status: "active" | "suspended" | "blacklisted"
      vendor_registration_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "revision_requested"
      vendor_spk_status: "active" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cost_inclusion_type: [
        "mobilisasi_demobilisasi",
        "penginapan_tukang",
        "biaya_pengiriman",
        "biaya_langsir",
        "instalasi",
        "ppn",
      ],
      customer_payment_termin: ["dp", "term", "final"],
      document_verification_status: ["pending", "verified", "rejected"],
      kebutuhan_type: [
        "Pagar",
        "Gudang",
        "Kos/Kontrakan",
        "Toko/Ruko",
        "Rumah",
        "Villa",
        "Hotel",
        "Rumah Sakit",
        "Panel Saja",
        "U-Ditch",
        "Plastik Board",
        "Lapangan",
        "Sekolah",
        "Kantor",
        "Tahu Beton",
      ],
      letter_action_type: [
        "CREATED",
        "SUBMITTED",
        "APPROVED_REVIEW",
        "APPROVED_FINAL",
        "REJECTED",
        "REVISION_REQUESTED",
        "REVISED",
        "CANCELLED",
      ],
      letter_status: [
        "DRAFT",
        "SUBMITTED_TO_REVIEW",
        "REVIEWED",
        "APPROVED",
        "REJECTED",
        "REVISION_REQUESTED",
      ],
      meeting_status_enum: ["draft", "published"],
      meeting_type_enum: ["internal", "external"],
      milestone_status: ["pending", "completed", "overdue"],
      notification_category: [
        "vendor",
        "tender",
        "monitoring",
        "payment",
        "document",
        "rab",
        "general",
      ],
      payment_request_status: [
        "pending",
        "finance_verified",
        "client_approved",
        "paid",
        "rejected",
      ],
      produk_type: [
        "Panel Beton",
        "Pagar Beton",
        "Sandwich Panel",
        "Panel Surya",
        "Plastik Board",
        "Ponton Terapung",
        "Jasa Konstruksi",
        "Jasa Renovasi",
        "Jasa RAB/Gambar",
        "U-Ditch",
        "Tahu Beton",
      ],
      progress_status: ["submitted", "approved", "rejected"],
      project_status: [
        "draft",
        "open",
        "in_progress",
        "completed",
        "cancelled",
      ],
      sales_stage: [
        "IG_Lead",
        "WA_Negotiation",
        "Quotation_Sent",
        "Follow_Up",
        "Invoice_Deal",
        "WIP",
        "Finish",
        "Cancelled",
      ],
      stakeholder_type: ["internal", "vendor", "client"],
      tender_status: ["open", "closed", "cancelled", "awarded"],
      tender_submission_status: ["submitted", "won", "lost"],
      vendor_document_type: [
        "ktp",
        "npwp",
        "nib",
        "siup_sbu",
        "company_profile",
      ],
      vendor_payment_jenis: ["dp", "term", "pelunasan"],
      vendor_profile_status: ["active", "suspended", "blacklisted"],
      vendor_registration_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "revision_requested",
      ],
      vendor_spk_status: ["active", "completed"],
    },
  },
} as const
