-- ==========================================================
-- PflegePilot — Komplettes Setup (sicher zum erneut Ausführen)
-- Supabase Dashboard → SQL Editor → Alles einfügen → Run
-- ==========================================================

-- ==========================================================
-- PROFILES
-- ==========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name        TEXT,
  pflegegrad          INT         CHECK (pflegegrad BETWEEN 1 AND 5),
  bundesland          TEXT        NOT NULL DEFAULT '',
  wohnsituation       TEXT        CHECK (wohnsituation IN ('zuhause', 'wg', 'heim')),
  versicherung        TEXT,
  pflegegrad_seit     DATE,
  nutzt_pflegedienst  BOOLEAN     DEFAULT FALSE,
  is_premium          BOOLEAN     DEFAULT FALSE,
  stripe_customer_id  TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_profile" ON profiles;
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ==========================================================
-- PFLEGEBEDUERFTIGER (Mehrpersonenverwaltung)
-- ==========================================================
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

DROP POLICY IF EXISTS "Users manage own persons" ON pflegebeduerftiger;
CREATE POLICY "Users manage own persons"
  ON pflegebeduerftiger
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- BENEFIT_TYPES
-- ==========================================================
CREATE TABLE IF NOT EXISTS benefit_types (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT        NOT NULL,
  slug              TEXT        UNIQUE NOT NULL,
  paragraph_sgb     TEXT,
  description       TEXT,
  short_description TEXT,
  icon              TEXT,
  per_pflegegrad    JSONB       NOT NULL DEFAULT '{}',
  frequency         TEXT        NOT NULL CHECK (frequency IN ('monthly', 'yearly', 'once')),
  deadline_rule     TEXT,
  requires_antrag   BOOLEAN     DEFAULT FALSE,
  category          TEXT        CHECK (category IN ('geld', 'sach', 'sonstig')),
  info_url          TEXT,
  tip               TEXT,
  active_from       DATE        DEFAULT '2025-01-01',
  active_to         DATE
);

ALTER TABLE benefit_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read" ON benefit_types;
CREATE POLICY "public_read" ON benefit_types FOR SELECT USING (true);

-- ==========================================================
-- BUDGETS
-- ==========================================================
CREATE TABLE IF NOT EXISTS budgets (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  benefit_type_id UUID        NOT NULL REFERENCES benefit_types(id),
  year            INT         NOT NULL,
  total_cents     INT         NOT NULL,
  used_cents      INT         DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  status          TEXT        DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, benefit_type_id, year)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_budgets" ON budgets;
CREATE POLICY "own_budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

-- ==========================================================
-- TRANSACTIONS
-- ==========================================================
CREATE TABLE IF NOT EXISTS transactions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id     UUID        NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  amount_cents  INT         NOT NULL CHECK (amount_cents > 0),
  description   TEXT,
  receipt_url   TEXT,
  provider_name TEXT,
  date          DATE        DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_transactions" ON transactions;
CREATE POLICY "own_transactions" ON transactions FOR ALL
  USING (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()));

-- ==========================================================
-- NOTIFICATIONS
-- ==========================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  budget_id  UUID        REFERENCES budgets(id) ON DELETE SET NULL,
  type       TEXT        NOT NULL CHECK (type IN (
               'reminder_90d', 'reminder_30d', 'reminder_7d', 'expired',
               'tip_umwandlung', 'tip_hilfsmittel', 'tip_hoeherstufung',
               'yearly_update', 'welcome'
             )),
  title      TEXT        NOT NULL,
  body       TEXT,
  sent_at    TIMESTAMPTZ,
  read_at    TIMESTAMPTZ,
  channel    TEXT        DEFAULT 'email' CHECK (channel IN ('email', 'push', 'in_app')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_notifications" ON notifications;
CREATE POLICY "own_notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ==========================================================
-- PROVIDERS
-- ==========================================================
CREATE TABLE IF NOT EXISTS providers (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  address             TEXT,
  plz                 TEXT,
  ort                 TEXT,
  bundesland          TEXT,
  lat                 DECIMAL(9,6),
  lng                 DECIMAL(9,6),
  services            TEXT[],
  kassen_zugelassen   BOOLEAN     DEFAULT FALSE,
  phone               TEXT,
  website             TEXT,
  verified            BOOLEAN     DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_providers" ON providers;
CREATE POLICY "public_read_providers" ON providers FOR SELECT USING (true);

-- ==========================================================
-- APPLICATIONS
-- ==========================================================
CREATE TABLE IF NOT EXISTS applications (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  benefit_type_id UUID        REFERENCES benefit_types(id),
  type            TEXT        NOT NULL CHECK (type IN (
                    'entlastung', 'verhinderung', 'kurzzeitpflege',
                    'wohnumfeld', 'pflegehilfsmittel', 'hoeherstufung', 'widerspruch'
                  )),
  status          TEXT        DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'eingereicht', 'genehmigt', 'abgelehnt')),
  pdf_url         TEXT,
  notes           TEXT,
  submitted_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_applications" ON applications;
CREATE POLICY "own_applications" ON applications FOR ALL USING (auth.uid() = user_id);

-- ==========================================================
-- INDIZES
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_budgets_user_id       ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_year          ON budgets(year);
CREATE INDEX IF NOT EXISTS idx_budgets_status        ON budgets(status);
CREATE INDEX IF NOT EXISTS idx_budgets_expires_at    ON budgets(expires_at);
CREATE INDEX IF NOT EXISTS idx_transactions_budget   ON transactions(budget_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date     ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread  ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_providers_plz         ON providers(plz);
CREATE INDEX IF NOT EXISTS idx_providers_bundesland  ON providers(bundesland);
CREATE INDEX IF NOT EXISTS idx_applications_user     ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_persons_user          ON pflegebeduerftiger(user_id);

-- ==========================================================
-- SEED: benefit_types (9 Leistungen 2026)
-- ==========================================================
INSERT INTO benefit_types
  (slug, name, paragraph_sgb, description, short_description, icon, per_pflegegrad, frequency, deadline_rule, requires_antrag, category, tip, active_from, active_to)
VALUES
  (
    'entlastungsbetrag', 'Entlastungsbetrag', '§ 45b SGB XI',
    'Der Entlastungsbetrag steht allen Pflegebedürftigen mit Pflegegrad 1-5 zu. Er kann für Angebote zur Unterstützung im Alltag eingesetzt werden, z.B. Haushaltshilfe, Betreuung oder Alltagsbegleitung.',
    'Monatliches Budget für Alltagsentlastung', '💰',
    '{"1": 13100, "2": 13100, "3": 13100, "4": 13100, "5": 13100}',
    'monthly', 'verfaellt_30_juni_folgejahr', false, 'sach',
    'Nicht genutzte Beträge können bis zum 30.06. des Folgejahres angespart werden. Danach verfallen sie unwiderruflich!',
    '2025-01-01', NULL
  ),
  (
    'pflegegeld', 'Pflegegeld', '§ 37 SGB XI',
    'Pflegegeld erhalten Pflegebedürftige ab Pflegegrad 2, die zu Hause von Angehörigen oder Freunden gepflegt werden. Es wird direkt an den Pflegebedürftigen ausgezahlt.',
    'Monatliche Geldleistung bei häuslicher Pflege', '🏠',
    '{"1": 0, "2": 33200, "3": 57300, "4": 76500, "5": 94700}',
    'monthly', NULL, true, 'geld', NULL, '2025-01-01', NULL
  ),
  (
    'pflegesachleistungen', 'Pflegesachleistungen', '§ 36 SGB XI',
    'Für professionelle Pflege durch ambulante Pflegedienste. Kann mit Pflegegeld kombiniert werden (Kombinationsleistung).',
    'Budget für ambulante Pflegedienste', '👩‍⚕️',
    '{"1": 0, "2": 76100, "3": 143200, "4": 177800, "5": 220000}',
    'monthly', NULL, true, 'sach',
    'Bis zu 40% ungenutzter Sachleistungen können in zusätzlichen Entlastungsbetrag umgewandelt werden!',
    '2025-01-01', NULL
  ),
  (
    'entlastungsbudget', 'Gemeinsames Entlastungsbudget', '§ 42a SGB XI',
    'Ab 01.07.2025: Verhinderungs- und Kurzzeitpflege werden zu einem gemeinsamen Budget zusammengefasst. Die 3.539€ können frei aufgeteilt werden.',
    'Frei aufteilbar für Verhinderungs- und Kurzzeitpflege', '🔀',
    '{"1": 0, "2": 353900, "3": 353900, "4": 353900, "5": 353900}',
    'yearly', 'jahresende', false, 'sach',
    '70% der Berechtigten nutzen die Verhinderungspflege NICHT. Das sind 3,4 Mrd.€ die jährlich verfallen.',
    '2025-07-01', NULL
  ),
  (
    'verhinderungspflege', 'Verhinderungspflege', '§ 39 SGB XI',
    'Wenn die Hauptpflegeperson verhindert ist (Urlaub, Krankheit), übernimmt die Pflegekasse die Kosten für eine Ersatzpflege.',
    'Ersatzpflege bei Ausfall der Pflegeperson', '🔄',
    '{"1": 0, "2": 161200, "3": 161200, "4": 161200, "5": 161200}',
    'yearly', 'jahresende', false, 'sach', NULL, '2025-01-01', '2025-06-30'
  ),
  (
    'kurzzeitpflege', 'Kurzzeitpflege', '§ 42 SGB XI',
    'Kurzzeitpflege kann z.B. nach einem Krankenhausaufenthalt oder in einer Krisensituation genutzt werden. Bis zu 8 Wochen pro Jahr.',
    'Vorübergehende stationäre Pflege', '🏥',
    '{"1": 0, "2": 177400, "3": 177400, "4": 177400, "5": 177400}',
    'yearly', 'jahresende', false, 'sach', NULL, '2025-01-01', '2025-06-30'
  ),
  (
    'pflegehilfsmittel', 'Pflegehilfsmittel zum Verbrauch', '§ 40 Abs. 2 SGB XI',
    'Für Verbrauchsmaterialien wie Einmalhandschuhe, Bettschutzeinlagen und Desinfektionsmittel.',
    'Monatliches Budget für Verbrauchsmaterialien', '🧤',
    '{"1": 4000, "2": 4000, "3": 4000, "4": 4000, "5": 4000}',
    'monthly', NULL, true, 'sach',
    'Einmal beantragen, dann kommt die Box jeden Monat automatisch.',
    '2025-01-01', NULL
  ),
  (
    'wohnumfeldverbesserung', 'Wohnumfeldverbesserung', '§ 40 Abs. 4 SGB XI',
    'Für Maßnahmen wie barrierefreies Bad, Türverbreiterung, Rampen. Bis zu 4.180€ pro Maßnahme.',
    'Zuschuss für barrierefreien Umbau', '🏗️',
    '{"1": 418000, "2": 418000, "3": 418000, "4": 418000, "5": 418000}',
    'once', NULL, true, 'sonstig', NULL, '2025-01-01', NULL
  ),
  (
    'dipa-budget', 'DiPA-Budget', '§ 40a SGB XI',
    'Für zugelassene digitale Pflege-Apps (DiPA).',
    'Budget für digitale Pflegeanwendungen', '📱',
    '{"1": 5300, "2": 5300, "3": 5300, "4": 5300, "5": 5300}',
    'monthly', NULL, true, 'sonstig', NULL, '2025-01-01', NULL
  )
ON CONFLICT (slug) DO UPDATE SET
  name              = EXCLUDED.name,
  per_pflegegrad    = EXCLUDED.per_pflegegrad,
  description       = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  tip               = EXCLUDED.tip;
