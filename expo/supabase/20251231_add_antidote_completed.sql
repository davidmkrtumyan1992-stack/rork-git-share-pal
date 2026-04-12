-- Add antidote_completed column to vow_entries table
ALTER TABLE public.vow_entries 
ADD COLUMN IF NOT EXISTS antidote_completed BOOLEAN DEFAULT FALSE;

-- Create index for faster queries on broken entries with incomplete antidotes
CREATE INDEX IF NOT EXISTS idx_vow_entries_antidote_status 
ON public.vow_entries (user_id, status, antidote_completed) 
WHERE status = 'broken' AND antidote_completed = false;

-- Add comment for documentation
COMMENT ON COLUMN public.vow_entries.antidote_completed IS 'Indicates whether the antidote practice has been completed for a broken vow';
