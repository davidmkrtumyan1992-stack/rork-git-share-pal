-- Add is_first_login column to profiles table
-- This column tracks whether the user has completed onboarding

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true;

-- Update existing profiles to mark them as not first login
-- (existing users have already been using the app)
UPDATE profiles
SET is_first_login = false
WHERE is_first_login IS NULL OR is_first_login = true;

-- Add comment for documentation
COMMENT ON COLUMN profiles.is_first_login IS 'Tracks if user needs to complete onboarding. Set to false after first login setup.';
