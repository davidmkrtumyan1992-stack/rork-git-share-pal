-- CRITICAL FIX: Properly create selected_vow_types column
-- This migration fixes the "Could not find the 'selected_vow_types' column" error

-- Step 1: Drop existing column and any constraints
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS selected_vow_types_is_array;

ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS selected_vow_types CASCADE;

-- Step 2: Create column with proper PostgreSQL TEXT ARRAY type
ALTER TABLE public.profiles 
ADD COLUMN selected_vow_types TEXT[] DEFAULT NULL;

-- Step 3: Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_selected_vow_types 
ON public.profiles USING GIN (selected_vow_types);

-- Step 4: Add comment
COMMENT ON COLUMN public.profiles.selected_vow_types 
IS 'Array of selected vow type identifiers (native PostgreSQL TEXT[] type)';

-- Step 5: Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
