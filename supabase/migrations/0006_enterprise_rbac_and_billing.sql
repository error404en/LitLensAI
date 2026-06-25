-- 0006_enterprise_rbac_and_billing.sql

-- 1. Add org_id to core tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE papers ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE papers ADD COLUMN IF NOT EXISTS embedding_hash TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS org_id TEXT;
ALTER TABLE comparisons ADD COLUMN IF NOT EXISTS org_id TEXT;

-- 2. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- 3. Create org_usage table
CREATE TABLE IF NOT EXISTS org_usage (
  org_id TEXT PRIMARY KEY,
  plan_type TEXT DEFAULT 'free',
  monthly_generations INTEGER DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  embedding_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE org_usage ENABLE ROW LEVEL SECURITY;

-- 4. Helper function to check if the current user belongs to the org_id
-- We assume Clerk injects `org_id` into the JWT.
CREATE OR REPLACE FUNCTION current_user_org_id()
RETURNS TEXT AS $$
  SELECT auth.jwt()->>'org_id';
$$ LANGUAGE sql STABLE;

-- 5. Update RLS Policies
-- We need to DROP existing policies and recreate them to include OR org_id = current_user_org_id()
-- Note: if current_user_org_id() is null (personal workspace), it falls back to user_id check.

-- Projects
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING ((user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id())));

DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

-- Papers
DROP POLICY IF EXISTS "Users can view their own papers" ON papers;
CREATE POLICY "Users can view their own papers" ON papers FOR SELECT USING ((user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id())));

DROP POLICY IF EXISTS "Users can update their own papers" ON papers;
CREATE POLICY "Users can update their own papers" ON papers FOR UPDATE USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

DROP POLICY IF EXISTS "Users can delete their own papers" ON papers;
CREATE POLICY "Users can delete their own papers" ON papers FOR DELETE USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

-- Conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
CREATE POLICY "Users can update their own conversations" ON conversations FOR UPDATE USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;
CREATE POLICY "Users can delete their own conversations" ON conversations FOR DELETE USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

-- Activities
DROP POLICY IF EXISTS "Users can view their own activities" ON activities;
CREATE POLICY "Users can view their own activities" ON activities FOR SELECT USING (user_id::text = get_current_user_id()::text OR (org_id IS NOT NULL AND org_id = current_user_org_id()));

-- Audit Logs RLS
CREATE POLICY "Users can view org audit logs" ON audit_logs FOR SELECT USING (org_id = current_user_org_id());
CREATE POLICY "Users can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (user_id::text = get_current_user_id()::text);

-- Org Usage RLS
CREATE POLICY "Users can view their org usage" ON org_usage FOR SELECT USING (org_id = current_user_org_id());
