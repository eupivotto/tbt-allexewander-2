-- Add extra chair fields to tables
ALTER TABLE public.tables
  ADD COLUMN IF NOT EXISTS extra_chair_name  TEXT,
  ADD COLUMN IF NOT EXISTS extra_chair_phone TEXT,
  ADD COLUMN IF NOT EXISTS extra_chair_price NUMERIC(10, 2);
