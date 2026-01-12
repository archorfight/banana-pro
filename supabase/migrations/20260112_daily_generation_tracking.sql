-- Track daily generation limits for free users
CREATE TABLE IF NOT EXISTS user_daily_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  generation_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT user_daily_generations_user_date_unique UNIQUE (user_id, generation_date)
);

-- Enable RLS
ALTER TABLE user_daily_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own daily generations"
  ON user_daily_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage daily generations"
  ON user_daily_generations FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_daily_generations_user_date
  ON user_daily_generations(user_id, generation_date);

-- Function: Check daily generation limit
CREATE OR REPLACE FUNCTION check_daily_generation_limit(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
  v_count INTEGER;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT generation_count INTO v_count
  FROM user_daily_generations
  WHERE user_id = p_user_id
    AND generation_date = v_today;

  IF v_count IS NULL THEN
    v_count := 0;
  END IF;

  RETURN jsonb_build_object(
    'can_generate', v_count < p_limit,
    'current_count', v_count,
    'limit', p_limit,
    'remaining', GREATEST(0, p_limit - v_count)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment daily generation count
CREATE OR REPLACE FUNCTION increment_daily_generation(
  p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  INSERT INTO user_daily_generations (user_id, generation_date, generation_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, generation_date)
  DO UPDATE SET
    generation_count = user_daily_generations.generation_count + 1,
    updated_at = NOW()
  RETURNING generation_count INTO v_new_count;

  RETURN jsonb_build_object(
    'success', true,
    'new_count', v_new_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
