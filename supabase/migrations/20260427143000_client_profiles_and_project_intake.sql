CREATE TABLE IF NOT EXISTS public.client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  client_type text,
  company_name_legal text,
  pic_name text,
  pic_position text,
  office_address text,
  province_id text REFERENCES public.master_provinces(id),
  city_id text REFERENCES public.master_cities(id),
  verification_status text DEFAULT 'pending',
  verification_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id
  ON public.client_profiles(user_id);

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS site_address_full text,
  ADD COLUMN IF NOT EXISTS province_id text REFERENCES public.master_provinces(id),
  ADD COLUMN IF NOT EXISTS city_id text REFERENCES public.master_cities(id),
  ADD COLUMN IF NOT EXISTS site_coordinates text,
  ADD COLUMN IF NOT EXISTS job_type text,
  ADD COLUMN IF NOT EXISTS estimated_length_or_area numeric,
  ADD COLUMN IF NOT EXISTS measurement_unit text,
  ADD COLUMN IF NOT EXISTS target_completion_preference text,
  ADD COLUMN IF NOT EXISTS budget_range text,
  ADD COLUMN IF NOT EXISTS initial_description text,
  ADD COLUMN IF NOT EXISTS site_condition text,
  ADD COLUMN IF NOT EXISTS vehicle_access text,
  ADD COLUMN IF NOT EXISTS special_requirements text,
  ADD COLUMN IF NOT EXISTS estimated_height text,
  ADD COLUMN IF NOT EXISTS foundation_preference text,
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS qualification_status text,
  ADD COLUMN IF NOT EXISTS qualification_notes text;
