-- Add antidote_completed field to vow_entries table
ALTER TABLE public.vow_entries
ADD COLUMN antidote_completed BOOLEAN DEFAULT false;