-- Row Level Security (RLS) Policies
-- Ensures users can only access their own data

-- Enable RLS on all tables
ALTER TABLE user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER_KEYS POLICIES
-- ============================================

-- Users can read their own salt
CREATE POLICY "Users can view their own salt"
  ON user_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own salt (only once during registration)
CREATE POLICY "Users can insert their own salt"
  ON user_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update salt (immutable after creation)
-- No update policy = cannot update

-- Users cannot delete their own salt
-- No delete policy = cannot delete

-- ============================================
-- VAULT_ENTRIES POLICIES
-- ============================================

-- Users can view their own vault entries
CREATE POLICY "Users can view their own entries"
  ON vault_entries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own vault entries
CREATE POLICY "Users can insert their own entries"
  ON vault_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own vault entries
CREATE POLICY "Users can update their own entries"
  ON vault_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own vault entries
CREATE POLICY "Users can delete their own entries"
  ON vault_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CATEGORIES POLICIES
-- ============================================

-- Users can view their own categories
CREATE POLICY "Users can view their own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own categories
CREATE POLICY "Users can insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own categories
CREATE POLICY "Users can update their own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own categories
CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- AUDIT_LOG POLICIES
-- ============================================

-- Users can view their own audit logs (read-only)
CREATE POLICY "Users can view their own audit logs"
  ON audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert audit logs
-- (No insert policy for users, done via service role)

-- Users cannot update or delete audit logs
-- No update/delete policies = immutable logs

-- ============================================
-- RATE_LIMITS TABLE
-- ============================================

-- Rate limits table doesn't need RLS (managed by functions)
-- No policies needed