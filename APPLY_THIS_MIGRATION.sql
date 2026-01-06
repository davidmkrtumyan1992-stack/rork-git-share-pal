-- CRITICAL FIX: Rebuild selected_vow_types column with proper type
-- Run this migration in your Supabase SQL Editor

-- Step 1: Drop existing column and constraints
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS selected_vow_types_is_array;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS selected_vow_types;

-- Step 2: Add column with TEXT ARRAY type (native PostgreSQL array)
ALTER TABLE public.profiles 
ADD COLUMN selected_vow_types TEXT[] DEFAULT NULL;

-- Step 3: Add comment
COMMENT ON COLUMN public.profiles.selected_vow_types IS 'Array of selected vow type identifiers (uses native PostgreSQL array type)';

-- Step 4: Reload the schema cache
NOTIFY pgrst, 'reload schema';
