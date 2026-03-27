-- Add avatar_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Allow longer text for base64 encoded images
COMMENT ON COLUMN profiles.avatar_url IS 'User avatar image URL or base64 encoded image';
