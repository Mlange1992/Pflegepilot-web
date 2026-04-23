-- Migration 002: Pflegebedürftige (Mehrpersonenverwaltung)
-- Führe dieses SQL im Supabase Dashboard → SQL Editor aus

CREATE TABLE IF NOT EXISTS pflegebeduerftiger (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT        NOT NULL,
  pflegegrad          INTEGER     CHECK (pflegegrad BETWEEN 1 AND 5),
  bundesland          TEXT        NOT NULL DEFAULT 'BY',
  nutzt_pflegedienst  BOOLEAN     NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pflegebeduerftiger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own persons"
  ON pflegebeduerftiger
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
