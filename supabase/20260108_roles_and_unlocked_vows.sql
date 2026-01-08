-- Migration: Add role system and unlocked vows table
-- Date: 2026-01-08

-- 1. Add role column to profiles table (default: 'user')
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'owner', 'admin'));

-- 2. Create table for storing unlocked vows per user
CREATE TABLE IF NOT EXISTS user_unlocked_vows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vow_type TEXT NOT NULL,
  unlocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vow_type)
);

-- 3. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_unlocked_vows_user_id ON user_unlocked_vows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_unlocked_vows_vow_type ON user_unlocked_vows(vow_type);

-- 4. Enable RLS on user_unlocked_vows
ALTER TABLE user_unlocked_vows ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for user_unlocked_vows

-- Users can view their own unlocked vows
DROP POLICY IF EXISTS "Users can view own unlocked vows" ON user_unlocked_vows;
CREATE POLICY "Users can view own unlocked vows" ON user_unlocked_vows
  FOR SELECT
  USING (auth.uid() = user_id);

-- Owners can view all unlocked vows
DROP POLICY IF EXISTS "Owners can view all unlocked vows" ON user_unlocked_vows;
CREATE POLICY "Owners can view all unlocked vows" ON user_unlocked_vows
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Only owners can insert unlocked vows
DROP POLICY IF EXISTS "Owners can unlock vows" ON user_unlocked_vows;
CREATE POLICY "Owners can unlock vows" ON user_unlocked_vows
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Only owners can delete (revoke) unlocked vows
DROP POLICY IF EXISTS "Owners can revoke unlocked vows" ON user_unlocked_vows;
CREATE POLICY "Owners can revoke unlocked vows" ON user_unlocked_vows
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- 6. RLS policy to prevent users from changing their own role
DROP POLICY IF EXISTS "Users cannot change own role" ON profiles;
CREATE POLICY "Users cannot change own role" ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Allow update if role is not being changed, OR if user is owner/admin
    (role = (SELECT role FROM profiles WHERE user_id = auth.uid())) 
    OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('owner', 'admin')
    )
  );

-- 7. Enable realtime for user_unlocked_vows
ALTER PUBLICATION supabase_realtime ADD TABLE user_unlocked_vows;

-- 8. Function to check if a user has access to a specific vow type
CREATE OR REPLACE FUNCTION check_vow_access(p_user_id UUID, p_vow_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_locked BOOLEAN;
BEGIN
  -- Check if vow type is one of the locked types
  IF p_vow_type IN ('tantric', 'nuns', 'monks', 'pratimoksha') THEN
    -- Check if user has explicit access
    RETURN EXISTS (
      SELECT 1 FROM user_unlocked_vows 
      WHERE user_id = p_user_id AND vow_type = p_vow_type
    );
  ELSE
    -- Non-locked vow types are always accessible
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION check_vow_access TO authenticated;
