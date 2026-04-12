-- Add vow_index column to vow_entries table to track which specific vow was checked
ALTER TABLE public.vow_entries 
ADD COLUMN vow_index INTEGER;

-- Add index for better query performance
CREATE INDEX idx_vow_entries_date_index ON public.vow_entries(entry_date, vow_index);