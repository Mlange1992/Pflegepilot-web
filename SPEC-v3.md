# PflegePilot — MVP-Spezifikation V3

> Der digitale Pflege-Finanzmanager für Familien
> Version 3.0 — März 2026

---

## 1. Vision & Positionierung

PflegePilot ist der persönliche Finanzmanager für Pflegeleistungen. Die App zeigt Familien auf einen Blick, welches Geld ihnen zusteht, wieviel sie verfallen lassen, und hilft beim Abruf — laufend, nicht einmalig.

### Das Problem

- **12 Mrd.€ Pflegeleistungen verfallen jährlich** in Deutschland
- **80%** der Berechtigten rufen den Entlastungsbetrag NICHT ab (4 Mrd.€/Jahr)
- **70%** nutzen die Verhinderungspflege nicht (3,4 Mrd.€/Jahr)
- **93%** haben noch NIE die Tagespflege in Anspruch genommen
- **5,7 Mio.** Pflegebedürftige in DE, 86% zu Hause versorgt, Prognose 2030: ~8 Mio.

### Ursachen

1. **Unwissenheit:** Familien wissen nicht, welche Leistungen existieren und wieviel insgesamt verfällt
2. **Bürokratie:** Kostenerstattungsprinzip → Vorleistung → Belege → Fristen = Überforderung
3. **Kein Tracking:** Pflegegrad-Rechner und Beratung sind EINMALIG — danach trackt niemand laufend
4. **Angebotslücke:** Zugelassene Dienstleister fehlen vor Ort

### Positionierung

**"Das WISO für Pflegeleistungen"** — So wie WISO/Taxfix Menschen hilft, keine Steuererstattung zu verschenken, hilft PflegePilot Familien, keine Pflegeleistungen verfallen zu lassen. Laufend, nicht einmalig.

### Wettbewerbsanalyse (verifiziert März 2026)

**Was GUT existiert (→ nicht nachbauen):**

| Anbieter | Was sie bieten | Warum nicht konkurrieren |
|----------|---------------|-------------------------|
| Verbraucherzentrale | Pflegegrad-Rechner (64 Kriterien, kostenlos, werbefrei) + Widerspruchsgenerator. 34.000+ Nutzer. Staatlich gefördert. | Gegen eine staatlich finanzierte, werbefreie Institution mit Vertrauensbonus anzutreten wäre Verschwendung. |
| Pflegehilfe.org | Pflegegrad-Rechner mit Ergebnis-PDF inkl. Antrags-Vordruck + Widerspruchsvorlage | Gutes Lead-Gen-Modell, aber Kern ist Vermittlung von Pflegediensten |
| pflege.de | Pflegegrad-Rechner + 30+ Rechner + Ratgeber-Artikel | Riesiges SEO-Portal, Content-Maschine |
| pflege-durch-angehoerige.de | Pflegegrad-Rechner + Blog | Community-Fokus |
| Nui Care | Pflege-App (Kalender, Chat, KI-Assistent, Leistungsinfos). Partner: AOK Bayern, Allianz, ADAC. 9,99€/Mo. | Fokus ist Pflege-ORGANISATION, nicht Finanz-Optimierung |

**Was NICHT existiert (→ PflegePilots Lücke):**

| Feature | Status im Markt |
|---------|----------------|
| Persönliches Budget-Dashboard mit ALLEN Töpfen | ❌ Existiert nicht |
| Fristen-Autopilot mit Push/E-Mail-Warnungen | ❌ Existiert nicht |
| "Du verlierst X.XXX€ pro Jahr"-Live-Counter | ❌ Existiert nicht |
| Laufendes Tracking über Jahre (nicht einmalig) | ❌ Existiert nicht |
| Beleg-Management + Erstattungs-Tracking | ❌ Existiert nicht |
| Proaktive Optimierungstipps (Umwandlungsanspruch etc.) | ❌ Existiert nicht |
| Anbieter-Matching nach Bundesland + Kassenzulassung | ❌ Nur rudimentär |

---

## 2. Der Nutzer-Funnel (3 Stufen)

### Stufe 1: Pflege-Quick-Check (Einstieg & SEO-Magnet)

**WICHTIG: Kein aufwändiger 64-Fragen-Pflegegrad-Rechner!** Die Verbraucherzentrale hat das besser gelöst als wir es je könnten. Stattdessen: ein schneller 5-Fragen-Hook der den Euro-Betrag triggert.

**Der Quick-Check (5 Fragen, 60 Sekunden, kein Login):**

1. "Hat die Person bereits einen Pflegegrad?" → Ja (welchen?) / Nein / Unsicher
2. "Wird die Person zu Hause versorgt?" → Ja / Nein / Teilweise
3. "In welchem Bundesland?" → Dropdown
4. "Welche Leistungen werden aktuell genutzt?" → Checkboxen (Pflegegeld, Pflegedienst, Entlastung, Verhinderung, keine, weiß nicht)
5. "Nutzen Sie einen ambulanten Pflegedienst?" → Ja / Nein (→ für Umwandlungsanspruch relevant)

**Ergebnis-Screen (der Money-Shot):**

```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Mit Pflegegrad 3 stehen Ihrer Familie            │
│                                                   │
│         15.847 € pro Jahr                         │
│                                                   │
│  zu. Sie nutzen aktuell ca. 6.876 €.              │
│                                                   │
│  ⚠️ Sie lassen 8.971 € verfallen.                │
│                                                   │
│  [Kostenlos registrieren → Dashboard freischalten] │
│                                                   │
│  Noch keinen Pflegegrad?                          │
│  → Nutzen Sie den kostenlosen Pflegegrad-Rechner  │
│    der Verbraucherzentrale [externer Link]         │
│                                                   │
└─────────────────────────────────────────────────┘
```

**Warum dieser Ansatz besser ist:**
- 60 Sekunden statt 15 Minuten = höhere Conversion
- Kein Wettbewerb mit Verbraucherzentrale — stattdessen Verlinkung (Vertrauensbonus!)
- Der Euro-Betrag ist der Hook, nicht der Pflegegrad (den kennen die meisten bereits)
- Sofortige Weiterleitung zum eigentlichen Produkt (Dashboard)

**Für Nutzer OHNE Pflegegrad:**
- Link zum Verbraucherzentrale Pflegegradrechner (extern)
- Eigene Kurzinfo: "So beantragen Sie einen Pflegegrad in 3 Schritten" (SEO-Content)
- CTA: "Kommen Sie nach dem Pflegegrad-Bescheid zurück — wir zeigen Ihnen dann, welches Geld Ihnen zusteht"
- Optional: E-Mail-Reminder "Pflegegrad erhalten? Jetzt Budget freischalten"

### Stufe 2: Budget-Dashboard & Fristen-Autopilot (Kern-Produkt, Premium)

**Das Herzstück — hierfür gibt es KEINE Alternative am Markt.**

**Budget-Dashboard:**
- Echtzeit-Übersicht ALLER Töpfe als Karten mit Fortschrittsbalken:
  - Entlastungsbetrag (§ 45b) — 131€/Mo
  - Pflegegeld (§ 37)
  - Verhinderungspflege (§ 39)
  - Kurzzeitpflege (§ 42)
  - Gemeinsames Entlastungsbudget (§ 42a, ab 07/2025) — 3.539€/Jahr
  - Pflegehilfsmittel (§ 40) — 40€/Mo
  - Wohnumfeldverbesserung (§ 40) — 4.180€
  - DiPA-Budget (§ 40a) — bis 53€/Mo
  - Umwandlungsanspruch (40% ungenutzter Sachleistungen)
  - Pflegesachleistungen (§ 36)
- Pro Topf: Anspruch/Jahr, bereits genutzt, noch verfügbar, Verfall-Datum
- Fortschrittsbalken (grün = genutzt, grau = offen, rot = verfällt bald)
- Header-Summe: "Dir stehen noch X.XXX€ zu — X.XXX€ davon verfallen in Y Tagen"

**Fristen-Autopilot:**
- Automatische Fristen-Berechnung pro Topf
- Push/E-Mail-Notifications: 90 Tage, 30 Tage, 7 Tage vor Verfall
- Fristen-Timeline in Sidebar: "Nächste 3 Monate"
- Countdown-Timer auf Dashboard für dringendste Frist

**Optimierungs-Engine:**
- Proaktive Tipps: "Du nutzt nur 30% deiner Sachleistungen. Wusstest du, dass du 40% in Entlastung umwandeln kannst? Das sind 304€ extra."
- "Du hast noch 1.200€ Entlastungsbetrag übrig. Hier sind 3 Anbieter in deiner Nähe die das abrechnen können."
- Jährliche Leistungsänderungen: "Ab 2027 steigen die Leistungen um X%. Dein neues Budget: ..."

### Stufe 3: Leistungen abrufen & verwalten

**Antrags-Helfer:**
- Pro Leistung: Was? Wer? Wie? + Antragsvorlage als PDF
- Vorgefüllt mit persönlichen Daten aus Profil
- Checkliste: "Diese Unterlagen brauchst du für den Antrag"
- Status-Tracking: Eingereicht → In Bearbeitung → Genehmigt/Abgelehnt

**Beleg-Manager:**
- Quittung fotografieren → App ordnet dem richtigen Topf zu
- Erstattungsantrag an Pflegekasse generieren
- Historie: Alle eingereichten Belege auf einen Blick

**Anbieter-Suche (Phase 2):**
- Zugelassene Dienstleister im Umkreis (PLZ-basiert)
- Filter: Bundesland, Leistungsart, Kassenzulassung
- Start: Baden-Württemberg, dann bundesweit expandieren

**Pflegehilfsmittel-Bestellung (Affiliate):**
- Direkt-Link zur Bestellung der monatlichen 40€ Pflegehilfsmittel
- Automatische Erinnerung: "Du hast diesen Monat noch keine Hilfsmittel bestellt"

---

## 3. Tech Stack

| Schicht | Technologie | Begründung |
|---------|-------------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS | SSR für SEO, React-basiert |
| Backend/DB | Supabase (PostgreSQL + Auth + RLS + Edge Functions) | Kostenloser Tier, Auth/DB/Storage in einem |
| Hosting | Vercel + Supabase Cloud | Zero-Config, kostenlos für MVP |
| E-Mail | Resend | Fristen-Notifications, kostenlos bis 3k/Mo |
| PDF | @react-pdf/renderer | Antrags- und Report-Generierung |
| Payments | Stripe (Checkout + Billing Portal) | Standard SaaS-Billing |
| KI (Phase 2) | Claude API (Anthropic) | KI-Pflege-Finanzberater |
| Analytics | PostHog | DSGVO-konform, Funnel-Tracking |

---

## 4. Datenmodell (Supabase + Row Level Security)

```sql
-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  pflegegrad INT CHECK (pflegegrad BETWEEN 1 AND 5),
  bundesland TEXT NOT NULL,
  wohnsituation TEXT CHECK (wohnsituation IN ('zuhause','wg','heim')),
  versicherung TEXT, -- Name der Pflegekasse
  pflegegrad_seit DATE,
  nutzt_pflegedienst BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- benefit_types (Leistungsarten — aus JSON-Config geseedet, selten geändert)
CREATE TABLE benefit_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- z.B. 'Entlastungsbetrag'
  slug TEXT UNIQUE NOT NULL,
  paragraph_sgb TEXT, -- z.B. '§ 45b SGB XI'
  description TEXT,
  short_description TEXT, -- Für Dashboard-Cards
  icon TEXT,
  per_pflegegrad JSONB NOT NULL, -- {"1": 15720, "2": 15720, ...} in Cents/Periode
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly','yearly','once')),
  deadline_rule TEXT, -- z.B. 'verfaellt_30_juni_folgejahr'
  requires_antrag BOOLEAN DEFAULT FALSE,
  category TEXT CHECK (category IN ('geld','sach','sonstig')),
  info_url TEXT, -- Link zu Erklärseite
  active_from DATE DEFAULT '2025-01-01',
  active_to DATE
);

-- budgets (persönliche Budget-Tracks pro Nutzer + Leistung + Jahr)
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  benefit_type_id UUID NOT NULL REFERENCES benefit_types(id),
  year INT NOT NULL,
  total_cents INT NOT NULL,
  used_cents INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','expiring','expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, benefit_type_id, year)
);

-- transactions (Buchungen/Belege pro Budget)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL,
  description TEXT,
  receipt_url TEXT, -- Supabase Storage URL
  provider_name TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- notifications (Fristen-Erinnerungen + Tipps)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id),
  type TEXT NOT NULL CHECK (type IN (
    'reminder_90d','reminder_30d','reminder_7d','expired',
    'tip_umwandlung','tip_hilfsmittel','tip_hoeherstufung',
    'yearly_update','welcome'
  )),
  title TEXT NOT NULL,
  body TEXT,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email','push','in_app'))
);

-- providers (zugelassene Dienstleister — Phase 2)
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  plz TEXT,
  ort TEXT,
  bundesland TEXT,
  lat DECIMAL,
  lng DECIMAL,
  services TEXT[], -- z.B. {'entlastung', 'verhinderung', 'haushaltshilfe'}
  kassen_zugelassen BOOLEAN DEFAULT FALSE,
  phone TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- applications (generierte Anträge — Phase 2)
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  benefit_type_id UUID REFERENCES benefit_types(id),
  type TEXT NOT NULL CHECK (type IN (
    'entlastung','verhinderung','kurzzeitpflege',
    'wohnumfeld','pflegehilfsmittel','hoeherstufung','widerspruch'
  )),
  status TEXT DEFAULT 'entwurf' CHECK (status IN ('entwurf','eingereicht','genehmigt','abgelehnt')),
  pdf_url TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security

```sql
-- Alle Nutzer-Tabellen: Jeder sieht NUR eigene Daten
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_transactions" ON transactions FOR ALL
  USING (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()));

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_applications" ON applications FOR ALL USING (auth.uid() = user_id);

-- benefit_types + providers: Öffentlich lesbar
ALTER TABLE benefit_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON benefit_types FOR SELECT USING (true);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON providers FOR SELECT USING (true);
```

---

## 5. Pflegerecht-Engine

JSON-Konfigurationsdateien unter `lib/pflegerecht/` — OHNE Code-Änderung aktualisierbar.

### leistungen-2026.json

```json
[
  {
    "slug": "entlastungsbetrag",
    "name": "Entlastungsbetrag",
    "paragraph": "§ 45b SGB XI",
    "icon": "💰",
    "short_description": "Monatliches Budget für Alltagsentlastung",
    "description": "Der Entlastungsbetrag steht allen Pflegebedürftigen mit Pflegegrad 1-5 zu. Er kann für Angebote zur Unterstützung im Alltag eingesetzt werden, z.B. Haushaltshilfe, Betreuung oder Alltagsbegleitung. Nur zugelassene Anbieter können mit der Pflegekasse abrechnen.",
    "frequency": "monthly",
    "category": "sach",
    "per_pflegegrad": { "1": 13100, "2": 13100, "3": 13100, "4": 13100, "5": 13100 },
    "deadline_rule": "verfaellt_30_juni_folgejahr",
    "requires_antrag": false,
    "tip": "Nicht genutzte Beträge können bis zum 30.06. des Folgejahres angespart werden. Danach verfallen sie!"
  },
  {
    "slug": "pflegegeld",
    "name": "Pflegegeld",
    "paragraph": "§ 37 SGB XI",
    "icon": "🏠",
    "short_description": "Monatliche Geldleistung bei häuslicher Pflege",
    "description": "Pflegegeld erhalten Pflegebedürftige ab Pflegegrad 2, die zu Hause von Angehörigen oder Freunden gepflegt werden. Es wird direkt an den Pflegebedürftigen ausgezahlt.",
    "frequency": "monthly",
    "category": "geld",
    "per_pflegegrad": { "1": 0, "2": 33200, "3": 57300, "4": 76500, "5": 94700 },
    "deadline_rule": null,
    "requires_antrag": true
  },
  {
    "slug": "verhinderungspflege",
    "name": "Verhinderungspflege",
    "paragraph": "§ 39 SGB XI",
    "icon": "🔄",
    "short_description": "Ersatzpflege bei Ausfall der Pflegeperson",
    "description": "Wenn die Hauptpflegeperson verhindert ist (Urlaub, Krankheit), übernimmt die Pflegekasse die Kosten für eine Ersatzpflege. Ab 01.07.2025 Teil des gemeinsamen Entlastungsbudgets.",
    "frequency": "yearly",
    "category": "sach",
    "per_pflegegrad": { "1": 0, "2": 161200, "3": 161200, "4": 161200, "5": 161200 },
    "deadline_rule": "jahresende",
    "requires_antrag": false,
    "tip": "70% der Berechtigten nutzen die Verhinderungspflege NICHT. Das sind 3,4 Mrd.€ die jährlich verfallen."
  },
  {
    "slug": "kurzzeitpflege",
    "name": "Kurzzeitpflege",
    "paragraph": "§ 42 SGB XI",
    "icon": "🏥",
    "short_description": "Vorübergehende stationäre Pflege",
    "description": "Kurzzeitpflege kann z.B. nach einem Krankenhausaufenthalt oder in einer Krisensituation genutzt werden. Ab 01.07.2025 Teil des gemeinsamen Entlastungsbudgets.",
    "frequency": "yearly",
    "category": "sach",
    "per_pflegegrad": { "1": 0, "2": 177400, "3": 177400, "4": 177400, "5": 177400 },
    "deadline_rule": "jahresende",
    "requires_antrag": false
  },
  {
    "slug": "entlastungsbudget",
    "name": "Gemeinsames Entlastungsbudget",
    "paragraph": "§ 42a SGB XI",
    "icon": "🔀",
    "short_description": "Frei aufteilbar für Verhinderungs- und Kurzzeitpflege",
    "description": "Ab 01.07.2025: Verhinderungs- und Kurzzeitpflege werden zu einem gemeinsamen Budget zusammengefasst. Sie können frei entscheiden, wie Sie die 3.539€ aufteilen.",
    "frequency": "yearly",
    "category": "sach",
    "per_pflegegrad": { "1": 0, "2": 353900, "3": 353900, "4": 353900, "5": 353900 },
    "deadline_rule": "jahresende",
    "requires_antrag": false,
    "active_from": "2025-07-01"
  },
  {
    "slug": "pflegehilfsmittel",
    "name": "Pflegehilfsmittel zum Verbrauch",
    "paragraph": "§ 40 Abs. 2 SGB XI",
    "icon": "🧤",
    "short_description": "Monatliches Budget für Verbrauchsmaterialien",
    "description": "Handschuhe, Bettschutzeinlagen, Desinfektionsmittel etc. Können direkt bei Anbietern bestellt werden, die mit der Pflegekasse abrechnen.",
    "frequency": "monthly",
    "category": "sach",
    "per_pflegegrad": { "1": 4000, "2": 4000, "3": 4000, "4": 4000, "5": 4000 },
    "deadline_rule": null,
    "requires_antrag": true,
    "tip": "Einmal beantragen, dann kommt die Box jeden Monat automatisch. Viele Anbieter übernehmen auch den Antrag."
  },
  {
    "slug": "wohnumfeldverbesserung",
    "name": "Wohnumfeldverbesserung",
    "paragraph": "§ 40 Abs. 4 SGB XI",
    "icon": "🏗️",
    "short_description": "Zuschuss für barrierefreien Umbau",
    "description": "Für Maßnahmen wie barrierefreies Bad, Türverbreiterung, Rampen. Bis zu 4.180€ pro Maßnahme, bei mehreren Pflegebedürftigen im Haushalt bis zu 16.720€.",
    "frequency": "once",
    "category": "sonstig",
    "per_pflegegrad": { "1": 418000, "2": 418000, "3": 418000, "4": 418000, "5": 418000 },
    "deadline_rule": null,
    "requires_antrag": true
  },
  {
    "slug": "dipa-budget",
    "name": "DiPA-Budget",
    "paragraph": "§ 40a SGB XI",
    "icon": "📱",
    "short_description": "Budget für digitale Pflegeanwendungen",
    "description": "Für zugelassene digitale Pflege-Apps (DiPA). Aktuell sind noch keine DiPA im offiziellen Verzeichnis zugelassen.",
    "frequency": "monthly",
    "category": "sonstig",
    "per_pflegegrad": { "1": 5300, "2": 5300, "3": 5300, "4": 5300, "5": 5300 },
    "deadline_rule": null,
    "requires_antrag": true
  },
  {
    "slug": "pflegesachleistungen",
    "name": "Pflegesachleistungen",
    "paragraph": "§ 36 SGB XI",
    "icon": "👩‍⚕️",
    "short_description": "Budget für ambulante Pflegedienste",
    "description": "Für professionelle Pflege durch ambulante Pflegedienste. Kann mit Pflegegeld kombiniert werden (Kombinationsleistung).",
    "frequency": "monthly",
    "category": "sach",
    "per_pflegegrad": { "1": 0, "2": 76100, "3": 143200, "4": 177800, "5": 220000 },
    "deadline_rule": null,
    "requires_antrag": true,
    "tip": "Bis zu 40% ungenutzter Sachleistungen können in zusätzlichen Entlastungsbetrag umgewandelt werden!"
  }
]
```

### fristen.json

```json
{
  "verfaellt_30_juni_folgejahr": {
    "label": "Verfällt am 30.06. des Folgejahres",
    "description": "Nicht genutzte Beträge aus dem Vorjahr können bis zum 30. Juni des Folgejahres eingesetzt werden. Danach verfallen sie unwiderruflich.",
    "reminder_days_before": [90, 30, 7],
    "calculate": "YEAR_END_PLUS_6_MONTHS"
  },
  "jahresende": {
    "label": "Verfällt am 31.12.",
    "description": "Budget muss im laufenden Kalenderjahr genutzt werden.",
    "reminder_days_before": [90, 30, 7],
    "calculate": "YEAR_END"
  }
}
```

### Kern-Funktionen (lib/pflegerecht/engine.ts)

```typescript
// Berechnet alle zustehenden Leistungen für ein Profil
calculateBenefits(pflegegrad: number, bundesland: string, nutztPflegedienst: boolean): Benefit[]

// Berechnet Gesamtsumme aller zustehenden Leistungen pro Jahr (in Cents)
calculateTotalEntitlement(pflegegrad: number): number

// Berechnet den Umwandlungsanspruch (40% ungenutzter Sachleistungen)
calculateUmwandlung(pflegegrad: number, genutzterAnteilSachleistungen: number): number

// Gibt alle Fristen zurück, sortiert nach Dringlichkeit
getUpcomingDeadlines(budgets: Budget[]): Deadline[]

// Generiert Optimierungsvorschläge
getOptimizationTips(profile: Profile, budgets: Budget[]): Tip[]

// Formatiert Cents zu Euro-String (deutsches Format)
formatEuro(cents: number): string  // 15720 → "157,20 €"
```

---

## 6. Seiten & Routes

| Route | Beschreibung | Auth | Premium |
|-------|-------------|------|---------|
| `/` | Landing: "12 Mrd.€ verfallen" + Pflege-Quick-Check inline + Features + Pricing | Nein | Nein |
| `/check` | Eigenständiger Quick-Check (5 Fragen → Euro-Ergebnis) | **Nein** | Nein |
| `/ergebnis` | Ergebnis: Alle Leistungen + Verfall-Betrag + CTA Registrierung | Nein | Nein |
| `/auth` | Login/Signup (Magic Link + Google via Supabase) | — | — |
| `/dashboard` | **KERN:** Budget-Dashboard + Fristen + Optimierungs-Tipps | Ja | **Ja** |
| `/dashboard/[slug]` | Detail-Ansicht pro Leistung mit Transaktionen | Ja | Ja |
| `/leistungen` | Übersicht aller Leistungen (SEO-Index) | Nein | Nein |
| `/leistungen/[slug]` | Erklärseite pro Leistung (SEO-optimiert) | Nein | Nein |
| `/anbieter` | Dienstleister-Suche mit PLZ (Phase 2) | Ja | Ja |
| `/preise` | Free vs. Premium (9,90€) vs. Familie (14,90€) | Nein | Nein |
| `/blog/[slug]` | SEO-Blog | Nein | Nein |
| `/pflegegrad-info` | "So beantragen Sie einen Pflegegrad" + Link Verbraucherzentrale | Nein | Nein |

**Quick-Check OHNE Login** → Ergebnis OHNE Login → Registrierung für Dashboard (Premium)

---

## 7. Design-Richtlinien

- **Farben:** Primär Teal (#0891B2), Warm-Orange für Warnungen (#F59E0B), Rot für Verfall (#EF4444), Grün für genutzt (#10B981)
- **Große, emotionale Zahlen.** Der Verfall-Betrag muss WEHTUN.
- **Tone:** Warm, empathisch, einfach. "Wir helfen dir, kein Geld zu verlieren" — nicht "Leistungsoptimierung"
- **Mobile First.** 70%+ Smartphones. Touch-Targets min. 48px.
- **WCAG 2.1 AA.** Hoher Kontrast, Screenreader-kompatibel.
- **DSGVO:** Cookie-Banner, Datenschutz, RLS, EU-Server.
- **Beträge:** Deutsches Format: 1.572,00 € (Punkt = Tausender, Komma = Dezimal)
- **Disclaimer:** "PflegePilot ersetzt keine Rechtsberatung. Alle Angaben ohne Gewähr."

---

## 8. Monetarisierung

| Säule | Was | Preis | Phase |
|-------|-----|-------|-------|
| Premium Abo | Dashboard, Fristen, Anträge, Beleg-Scanner | 9,90€/Mo (Single) / 14,90€/Mo (Familie) | 1 |
| Affiliate | Pflegehilfsmittel-Box, Hausnotruf, Versicherung | 5-200€/Lead | 2 |
| Anbieter-Leads | Qualifizierte Leads an Pflegedienste | 50-150€/Lead | 2 |
| B2B White-Label | Lizenz an Krankenkassen / Arbeitgeber | Lizenz + pro Nutzer | 3 |
| DiPA-Zulassung | Pflegekasse erstattet App-Kosten | Bis 53€/Mo/Nutzer | 4 |

---

## 9. Entwicklungsreihenfolge

1. **Supabase Setup** — Datenmodell, Auth (Magic Link + Google), RLS-Policies
2. **Pflegerecht-Engine** — JSON-Configs laden, calculateBenefits(), formatEuro()
3. **Quick-Check** (`/check`) — 5 Fragen → Euro-Ergebnis. DER erste testbare Flow.
4. **Ergebnis-Screen** (`/ergebnis`) — Leistungsliste + Verfall-Summe + CTA
5. **Budget-Dashboard** (`/dashboard`) — Cards, Fortschrittsbalken, Verfall-Counter
6. **Fristen-System** — Deadline-Berechnung + Resend E-Mail-Notifications
7. **Stripe-Integration** — Premium Abo mit Checkout + Billing Portal
8. **Landing Page** (`/`) — Hero, Quick-Check inline, Features, Pricing
9. **Leistungs-Seiten** (`/leistungen/[slug]`) — SEO-Content
10. **Antrags-Helfer** — PDF-Export pro Leistung (Phase 2)

---

## 10. Wichtige Regeln

- Alle Texte auf Deutsch
- Beträge: deutsches Format (1.572,00 €)
- Pflegerecht-Daten als JSON-Config, ohne Code-Änderung aktualisierbar
- TypeScript strict mode, funktionale React-Komponenten
- Supabase RLS auf ALLEN Tabellen
- Quick-Check funktioniert OHNE Login
- Kein medizinischer oder juristischer Rat
- Bei Pflegegrad-Fragen: Link zur Verbraucherzentrale, nicht selbst lösen
- Server in EU (DSGVO)
