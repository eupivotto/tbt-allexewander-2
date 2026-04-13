-- Add status to extra chair
ALTER TABLE public.tables
  ADD COLUMN IF NOT EXISTS extra_chair_status TEXT
    CHECK (extra_chair_status IN ('available', 'reserved', 'paid'));
