-- Create table to track cycle positions for each user and vow type
CREATE TABLE public.vow_cycle_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vow_type TEXT NOT NULL,
  current_position INTEGER NOT NULL DEFAULT 0,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vow_type)
);

-- Enable RLS
ALTER TABLE public.vow_cycle_positions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own cycle positions"
  ON public.vow_cycle_positions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cycle positions"
  ON public.vow_cycle_positions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycle positions"
  ON public.vow_cycle_positions
  FOR UPDATE
  USING (auth.uid() = user_id);