-- Migration: person_id zu budgets hinzufügen
-- Supabase SQL Editor → einfügen → Run

-- 1. Spalte hinzufügen (falls noch nicht vorhanden)
ALTER TABLE budgets
  ADD COLUMN IF NOT EXISTS person_id UUID REFERENCES pflegebeduerftiger(id) ON DELETE CASCADE;

-- 2. Alte UNIQUE-Constraint entfernen
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_user_id_benefit_type_id_year_key;

-- 3. Neue UNIQUE-Constraint mit person_id
ALTER TABLE budgets
  ADD CONSTRAINT budgets_user_person_benefit_year
  UNIQUE (user_id, person_id, benefit_type_id, year);

-- 4. Index für person_id
CREATE INDEX IF NOT EXISTS idx_budgets_person_id ON budgets(person_id);

-- 5. Alte Budgets ohne person_id löschen (die sind unbrauchbar)
DELETE FROM budgets WHERE person_id IS NULL;
