-- ========================================
-- ВАЖНО: Выполните этот SQL в Supabase Dashboard
-- ========================================
-- 1. Откройте https://supabase.com/dashboard
-- 2. Выберите ваш проект
-- 3. Перейдите в SQL Editor
-- 4. Скопируйте и выполните этот код

-- Добавить колонку selected_vow_types как JSONB
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS selected_vow_types JSONB DEFAULT NULL;

-- Очистить некорректные данные (если были)
UPDATE public.profiles
SET selected_vow_types = NULL
WHERE selected_vow_types IS NOT NULL
  AND jsonb_typeof(selected_vow_types) != 'array';

-- Добавить ограничение на тип данных
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS selected_vow_types_is_array;

ALTER TABLE public.profiles
ADD CONSTRAINT selected_vow_types_is_array
CHECK (
  selected_vow_types IS NULL 
  OR jsonb_typeof(selected_vow_types) = 'array'
);

-- Комментарии
COMMENT ON COLUMN public.profiles.selected_vow_types IS 'Array of selected vow type identifiers for the user';
COMMENT ON CONSTRAINT selected_vow_types_is_array ON public.profiles 
IS 'Ensures selected_vow_types is either NULL or a valid JSON array';
