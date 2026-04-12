-- Fix corrupted selected_vow_types data
-- Clear any non-array values that may have been stored as strings

UPDATE public.profiles
SET selected_vow_types = NULL
WHERE selected_vow_types IS NOT NULL
  AND jsonb_typeof(selected_vow_types) != 'array';

-- Add a check constraint to ensure only arrays or null are stored
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS selected_vow_types_is_array;

ALTER TABLE public.profiles
ADD CONSTRAINT selected_vow_types_is_array
CHECK (
  selected_vow_types IS NULL 
  OR jsonb_typeof(selected_vow_types) = 'array'
);

COMMENT ON CONSTRAINT selected_vow_types_is_array ON public.profiles 
IS 'Ensures selected_vow_types is either NULL or a valid JSON array';
