-- Fard Vault Database Schema
-- Zero-knowledge password vault with client-side encryption

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Keys Table (stores salt for key derivation)
CREATE TABLE IF NOT EXISTS user_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  salt TEXT NOT NULL, -- Base64 encoded, 16 bytes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vault Entries Table (encrypted password entries)
CREATE TABLE IF NOT EXISTS vault_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Encrypted data (all sensitive info)
  encrypted_data TEXT NOT NULL, -- Base64 JSON: {title, username, password, url, notes}
  iv TEXT NOT NULL, -- Base64, 12 bytes (AES-GCM initialization vector)
  auth_tag TEXT NOT NULL, -- Base64, 16 bytes (authentication tag)
  
  -- Metadata (NOT encrypted, for filtering)
  category TEXT DEFAULT 'other',
  favorite BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ
);

-- Categories Table (user-defined categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📁',
  color TEXT DEFAULT '#39ff14',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT categories_user_name_unique UNIQUE (user_id, name)
);

-- Rate Limiting Table (bot protection)
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL, -- IP address or user_id
  action TEXT NOT NULL, -- 'login', 'register', 'api_call'
  attempt_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  
  CONSTRAINT rate_limits_identifier_action_unique UNIQUE (identifier, action)
);

-- Audit Log Table (security monitoring)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vault_entries_user_id ON vault_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_entries_category ON vault_entries(user_id, category);
CREATE INDEX IF NOT EXISTS idx_vault_entries_favorite ON vault_entries(user_id, favorite);
CREATE INDEX IF NOT EXISTS idx_vault_entries_created ON vault_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id, created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_user_keys_updated_at
  BEFORE UPDATE ON user_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_entries_updated_at
  BEFORE UPDATE ON vault_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories for new users (function)
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (user_id, name, icon, color) VALUES
    (NEW.id, 'Social Media', '🌐', '#1DA1F2'),
    (NEW.id, 'Banking', '💳', '#00C853'),
    (NEW.id, 'Email', '📧', '#EA4335'),
    (NEW.id, 'Work', '💼', '#0078D4'),
    (NEW.id, 'Gaming', '🎮', '#9146FF'),
    (NEW.id, 'Shopping', '🛒', '#FF9800'),
    (NEW.id, 'Other', '📁', '#39ff14');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default categories on user signup
CREATE TRIGGER on_user_created_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_categories();

-- Rate limiting check function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_attempts INTEGER,
  p_window_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_record RECORD;
BEGIN
  -- Get existing rate limit record
  SELECT * INTO v_record
  FROM rate_limits
  WHERE identifier = p_identifier AND action = p_action;
  
  -- Check if blocked
  IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- Reset if window expired
  IF v_record.window_start IS NULL OR v_record.window_start < NOW() - INTERVAL '1 minute' * p_window_minutes THEN
    UPDATE rate_limits
    SET attempt_count = 1, window_start = NOW(), blocked_until = NULL
    WHERE identifier = p_identifier AND action = p_action;
    RETURN TRUE;
  END IF;
  
  -- Check if max attempts reached
  IF v_record.attempt_count >= p_max_attempts THEN
    UPDATE rate_limits
    SET blocked_until = NOW() + INTERVAL '1 hour'
    WHERE identifier = p_identifier AND action = p_action;
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE rate_limits
  SET attempt_count = attempt_count + 1
  WHERE identifier = p_identifier AND action = p_action;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;