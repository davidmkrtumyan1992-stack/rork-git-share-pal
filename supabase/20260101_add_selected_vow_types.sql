-- Add selected_vow_types column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS selected_vow_types TEXT[] DEFAULT NULL;

-- Comment on column
COMMENT ON COLUMN public.profiles.selected_vow_types IS 'Array of selected vow type identifiers for the user';
