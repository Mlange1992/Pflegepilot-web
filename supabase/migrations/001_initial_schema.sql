-- ==========================================================
-- PflegePilot — Initial Schema Migration V3
-- Erstellt: 2026-03
-- ==========================================================

-- ==========================================================
-- PROFILES
-- ==========================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  pflegegrad INT CHECK (pflegegrad BETWEEN 1 AND 5),
  bundesland TEXT NOT NULL DEFAULT '',
  wohnsituation TEXT CHECK (wohnsituation IN ('zuhause', 'wg', 'heim')),
  versicherung TEXT,
  pflegegrad_seit DATE,
  nutzt_pflegedienst BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Auto-Profil beim Signup erstellen
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ==========================================================
-- BENEFIT_TYPES (Leistungsarten — aus leistungen-2026.json geseedet)
-- ==========================================================
CREATE TABLE benefit_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  paragraph_sgb TEXT,
  description TEXT,
  short_description TEXT,
  icon TEXT,
  per_pflegegrad JSONB NOT NULL DEFAULT '{}',
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'yearly', 'once')),
  deadline_rule TEXT,
  requires_antrag BOOLEAN DEFAULT FALSE,
  category TEXT CHECK (category IN ('geld', 'sach', 'sonstig')),
  info_url TEXT,
  tip TEXT,
  active_from DATE DEFAULT '2025-01-01',
  active_to DATE
);

ALTER TABLE benefit_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON benefit_types FOR SELECT USING (true);

-- ==========================================================
-- BUDGETS (persönliche Budget-Tracks pro Nutzer + Leistung + Jahr)
-- ==========================================================
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  benefit_type_id UUID NOT NULL REFERENCES benefit_types(id),
  year INT NOT NULL,
  total_cents INT NOT NULL,
  used_cents INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, benefit_type_id, year)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

-- ==========================================================
-- TRANSACTIONS (Buchungen/Belege pro Budget)
-- ==========================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL CHECK (amount_cents > 0),
  description TEXT,
  receipt_url TEXT,
  provider_name TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_transactions" ON transactions FOR ALL
  USING (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()));

-- ==========================================================
-- NOTIFICATIONS (Fristen-Erinnerungen + Tipps)
-- ==========================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN (
    'reminder_90d', 'reminder_30d', 'reminder_7d', 'expired',
    'tip_umwandlung', 'tip_hilfsmittel', 'tip_hoeherstufung',
    'yearly_update', 'welcome'
  )),
  title TEXT NOT NULL,
  body TEXT,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'push', 'in_app')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ==========================================================
-- PROVIDERS (zugelassene Dienstleister — Phase 2)
-- ==========================================================
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  plz TEXT,
  ort TEXT,
  bundesland TEXT,
  lat DECIMAL(9, 6),
  lng DECIMAL(9, 6),
  services TEXT[],
  kassen_zugelassen BOOLEAN DEFAULT FALSE,
  phone TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON providers FOR SELECT USING (true);

-- ==========================================================
-- APPLICATIONS (generierte Anträge — Phase 2)
-- ==========================================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  benefit_type_id UUID REFERENCES benefit_types(id),
  type TEXT NOT NULL CHECK (type IN (
    'entlastung', 'verhinderung', 'kurzzeitpflege',
    'wohnumfeld', 'pflegehilfsmittel', 'hoeherstufung', 'widerspruch'
  )),
  status TEXT DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'eingereicht', 'genehmigt', 'abgelehnt')),
  pdf_url TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_applications" ON applications FOR ALL USING (auth.uid() = user_id);

-- ==========================================================
-- INDIZES
-- ==========================================================
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_year ON budgets(year);
CREATE INDEX idx_budgets_status ON budgets(status);
CREATE INDEX idx_budgets_expires_at ON budgets(expires_at);

CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

CREATE INDEX idx_providers_plz ON providers(plz);
CREATE INDEX idx_providers_bundesland ON providers(bundesland);

CREATE INDEX idx_applications_user_id ON applications(user_id);
