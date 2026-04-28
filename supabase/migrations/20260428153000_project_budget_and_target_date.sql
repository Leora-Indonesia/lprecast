ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS budget_min numeric,
  ADD COLUMN IF NOT EXISTS budget_max numeric,
  ADD COLUMN IF NOT EXISTS target_completion_date date;

COMMENT ON COLUMN public.projects.budget_min IS 'Budget minimum client/project dalam IDR';
COMMENT ON COLUMN public.projects.budget_max IS 'Budget maksimum client/project dalam IDR';
COMMENT ON COLUMN public.projects.target_completion_date IS 'Target tanggal selesai yang diharapkan client';
