-- ============================================================
-- Migration: 003_server_rate_limiting.sql
-- Adds two RPC functions for server-side login rate limiting,
-- replacing the client-side localStorage approach.
-- ============================================================

-- record_failed_login
-- Called on every failed login. Returns:
--   { locked: bool, locked_for_seconds: int, attempts_remaining: int }
CREATE OR REPLACE FUNCTION record_failed_login(p_identifier TEXT)
RETURNS JSON AS $$
DECLARE
  v_max_attempts   CONSTANT INTEGER   := 5;
  v_window_minutes CONSTANT INTEGER   := 15;
  v_lockout_secs   CONSTANT INTEGER   := 900; -- 15 minutes
  v_record         rate_limits%ROWTYPE;
  v_now            TIMESTAMPTZ        := NOW();
BEGIN
  -- Upsert: create or load the rate limit record for this identifier + action
  INSERT INTO rate_limits (identifier, action, attempt_count, window_start)
    VALUES (p_identifier, 'login', 1, v_now)
    ON CONFLICT (identifier, action) DO UPDATE
      SET attempt_count = CASE
            -- Reset window if it has expired
            WHEN rate_limits.window_start < v_now - INTERVAL '1 minute' * v_window_minutes
            THEN 1
            ELSE rate_limits.attempt_count + 1
          END,
          window_start = CASE
            WHEN rate_limits.window_start < v_now - INTERVAL '1 minute' * v_window_minutes
            THEN v_now
            ELSE rate_limits.window_start
          END,
          blocked_until = CASE
            -- Set blockade when this increment hits the limit
            WHEN (CASE
                    WHEN rate_limits.window_start < v_now - INTERVAL '1 minute' * v_window_minutes
                    THEN 1
                    ELSE rate_limits.attempt_count + 1
                  END) >= v_max_attempts
            THEN v_now + (v_lockout_secs || ' seconds')::INTERVAL
            ELSE rate_limits.blocked_until
          END;

  SELECT * INTO v_record
    FROM rate_limits
   WHERE identifier = p_identifier AND action = 'login';

  -- If currently blocked, return locked state with seconds remaining
  IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > v_now THEN
    RETURN json_build_object(
      'locked',              true,
      'locked_for_seconds',  EXTRACT(EPOCH FROM (v_record.blocked_until - v_now))::INTEGER,
      'attempts_remaining',  0
    );
  END IF;

  RETURN json_build_object(
    'locked',              false,
    'locked_for_seconds',  0,
    'attempts_remaining',  GREATEST(0, v_max_attempts - v_record.attempt_count)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- reset_failed_logins
-- Called on successful login to clear the attempt counter.
CREATE OR REPLACE FUNCTION reset_failed_logins(p_identifier TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE rate_limits
     SET attempt_count = 0,
         blocked_until = NULL,
         window_start  = NOW()
   WHERE identifier = p_identifier
     AND action     = 'login';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to the anon role so the client can call these via RPC
GRANT EXECUTE ON FUNCTION record_failed_login(TEXT)  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION reset_failed_logins(TEXT)  TO anon, authenticated;
