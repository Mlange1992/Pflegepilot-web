-- Migration 003: Affiliate Events Tracking
-- Führe dieses SQL im Supabase Dashboard → SQL Editor aus

CREATE TABLE IF NOT EXISTS affiliate_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_id   TEXT        NOT NULL,                    -- z.B. 'pflegehilfsmittel', 'hausnotruf'
  partner_name TEXT        NOT NULL,                    -- Anzeigename
  context      TEXT        NOT NULL DEFAULT 'unknown',  -- 'dashboard', 'ratgeber', 'nba_result'
  platform     TEXT        NOT NULL DEFAULT 'web',      -- 'ios', 'web'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kein RLS auf Events — nur server-seitig/anonym schreibbar
-- Lesezugriff nur für Service-Role (Analytics)
ALTER TABLE affiliate_events ENABLE ROW LEVEL SECURITY;

-- Anonyme und eingeloggte Nutzer dürfen Events einfügen (kein Lesen)
CREATE POLICY "Insert affiliate events"
  ON affiliate_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Nur Service-Role darf lesen (Analytics)
-- (kein SELECT policy → authenticated/anon sehen nichts)
