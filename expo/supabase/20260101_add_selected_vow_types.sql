-- Add selected_vow_types column to profiles table as JSONB for better compatibility
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS selected_vow_types JSONB DEFAULT NULL;

-- Comment on column
COMMENT ON COLUMN public.profiles.selected_vow_types IS 'Array of selected vow type identifiers for the user';
