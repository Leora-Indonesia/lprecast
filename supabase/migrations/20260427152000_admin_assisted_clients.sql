ALTER TABLE public.client_profiles
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.client_profiles
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS client_profile_id uuid REFERENCES public.client_profiles(id);

CREATE INDEX IF NOT EXISTS idx_projects_client_profile_id
  ON public.projects(client_profile_id);
