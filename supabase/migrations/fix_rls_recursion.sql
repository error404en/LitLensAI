BEGIN;

-- Drop the recursive select policy on users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
-- Recreate it using direct clerk_id check
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (clerk_id = auth.jwt()->>'sub');

-- Drop the recursive update policy on users
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
-- Recreate it using direct clerk_id check
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (clerk_id = auth.jwt()->>'sub');

COMMIT;
