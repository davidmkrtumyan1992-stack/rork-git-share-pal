-- Create user_selected_vows table for multiple vow tracking
CREATE TABLE public.user_selected_vows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vow_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vow_type)
);

-- Enable RLS
ALTER TABLE public.user_selected_vows ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own selected vows" 
  ON public.user_selected_vows FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own selected vows" 
  ON public.user_selected_vows FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own selected vows" 
  ON public.user_selected_vows FOR DELETE 
  USING (auth.uid() = user_id);

-- Migrate existing selected_vow data from profiles
INSERT INTO public.user_selected_vows (user_id, vow_type)
SELECT user_id, selected_vow 
FROM public.profiles 
WHERE selected_vow IS NOT NULL
ON CONFLICT (user_id, vow_type) DO NOTHING;