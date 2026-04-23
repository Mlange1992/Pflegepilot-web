-- ==========================================================
-- PflegePilot — Seed: benefit_types aus leistungen-2026.json
-- Ausführen im Supabase Dashboard > SQL Editor
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
    'monthly', NULL, true, 'geld', NULL,
    '2025-01-01', NULL
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
    'Wenn die Hauptpflegeperson verhindert ist (Urlaub, Krankheit), übernimmt die Pflegekasse die Kosten für eine Ersatzpflege. Ab 01.07.2025 Teil des gemeinsamen Entlastungsbudgets.',
    'Ersatzpflege bei Ausfall der Pflegeperson', '🔄',
    '{"1": 0, "2": 161200, "3": 161200, "4": 161200, "5": 161200}',
    'yearly', 'jahresende', false, 'sach', NULL,
    '2025-01-01', '2025-06-30'
  ),
  (
    'kurzzeitpflege', 'Kurzzeitpflege', '§ 42 SGB XI',
    'Kurzzeitpflege kann z.B. nach einem Krankenhausaufenthalt oder in einer Krisensituation genutzt werden. Bis zu 8 Wochen pro Jahr.',
    'Vorübergehende stationäre Pflege', '🏥',
    '{"1": 0, "2": 177400, "3": 177400, "4": 177400, "5": 177400}',
    'yearly', 'jahresende', false, 'sach', NULL,
    '2025-01-01', '2025-06-30'
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
    'once', NULL, true, 'sonstig', NULL,
    '2025-01-01', NULL
  ),
  (
    'dipa-budget', 'DiPA-Budget', '§ 40a SGB XI',
    'Für zugelassene digitale Pflege-Apps (DiPA).',
    'Budget für digitale Pflegeanwendungen', '📱',
    '{"1": 5300, "2": 5300, "3": 5300, "4": 5300, "5": 5300}',
    'monthly', NULL, true, 'sonstig', NULL,
    '2025-01-01', NULL
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  per_pflegegrad = EXCLUDED.per_pflegegrad,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description;
