-- Fix RLS policies for vow_cycle_positions table
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own cycle positions" ON public.vow_cycle_positions;
DROP POLICY IF EXISTS "Users can insert their own cycle positions" ON public.vow_cycle_positions;
DROP POLICY IF EXISTS "Users can update their own cycle positions" ON public.vow_cycle_positions;

-- Recreate policies with proper checks
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
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add delete policy in case needed
CREATE POLICY "Users can delete their own cycle positions"
  ON public.vow_cycle_positions
  FOR DELETE
  USING (auth.uid() = user_id);
