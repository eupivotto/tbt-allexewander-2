-- Remove tables 33-37, only 32 tables exist in the venue
DELETE FROM public.tables WHERE table_number > 32;
