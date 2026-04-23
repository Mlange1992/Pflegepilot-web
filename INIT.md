# PflegePilot – Projekt Init & Kontext

> Letzte Aktualisierung: 2026-03-14
> Ziel: Digitaler Pflege-Finanzmanager für deutsche Familien mit Pflegebedürftigen.

---

## Zwei Produkte (beide aktiv)

| Produkt | Technologie | Ordner |
|---------|-------------|--------|
| **Web-App** | Next.js 14, TypeScript, Tailwind, Supabase | `/` (root) |
| **iOS-App** | SwiftUI iOS 17+, Supabase Swift SDK | `ios/` |

---

## Supabase

- **URL:** `https://mufdniwzxudlszureljw.supabase.co`
- **Anon Key:** In `ios/PflegePilot/Services/SupabaseService.swift` und `.env.local`
- **Migration:** Manuell im Supabase Dashboard ausgeführt (`supabase/migrations/001_initial_schema.sql`)
- **Seed:** `supabase/seed.sql` – 9 Leistungen in `benefit_types`

### Tabellen
- `profiles` — userId, pflegegrad, bundesland, nutzt_pflegedienst, is_premium
- `benefit_types` — slug, name, icon, paragraph_sgb, amounts_json
- `budgets` — user_id, benefit_type_id, year, betrag_cent, verbraucht_cent
- `transactions` — budget_id, betrag_cent, datum, notiz
- `notifications` — user_id, typ, titel, body, gelesen
- `providers` — user_id, name, typ, kontakt
- `applications` — user_id, benefit_type_id, status, datum

---

## Web-App (Next.js)

### Starten
```bash
cd /Users/markuslange/Dev/app/PflegePilot
npm run dev   # http://localhost:3000
```

### Wichtige Dateien
| Datei | Zweck |
|-------|-------|
| `app/page.tsx` | Landingpage |
| `app/check/page.tsx` | 5-Schritt Quick-Check Wizard |
| `app/ergebnis/page.tsx` | Ergebnis-Screen (Money-Shot) |
| `app/auth/page.tsx` | Magic Link + Google OAuth |
| `app/(app)/dashboard/page.tsx` | Budget-Dashboard (auth-geschützt) |
| `app/(app)/dashboard/setup/page.tsx` | Onboarding-Formular |
| `app/(app)/dashboard/[slug]/page.tsx` | Budget-Detail + Buchungen |
| `app/leistungen/page.tsx` | SEO-Übersicht aller Leistungen |
| `app/leistungen/[slug]/page.tsx` | SEO-Detailseite je Leistung |
| `app/preise/page.tsx` | Pricing (9,90€ / 14,90€) |
| `app/pflegegrad-info/page.tsx` | Pflegegrad beantragen + VZ-Link |
| `app/api/cron/check-deadlines/route.ts` | Täglicher Cron (Frist-Check) |
| `app/api/stripe/create-checkout/route.ts` | Stripe Checkout |
| `app/api/stripe/webhook/route.ts` | Stripe Webhook |
| `lib/pflegerecht/engine.ts` | Berechnungslogik alle Leistungen |
| `lib/pflegerecht/leistungen-2026.json` | Beträge 2026 (Cent) |
| `lib/utils/constants.ts` | BUNDESLAENDER, PRICES, URLS |
| `middleware.ts` | Auth-Guard für /dashboard |
| `vercel.json` | Cron: täglich 08:00 Uhr |

### Umgebungsvariablen (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://mufdniwzxudlszureljw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
STRIPE_SECRET_KEY=sk_test_...        # noch leer
STRIPE_WEBHOOK_SECRET=whsec_...      # noch leer
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # noch leer
CRON_SECRET=<random-string>
```

### Stripe (noch nicht konfiguriert)
- Preise in `lib/utils/constants.ts`: Single 9,90€/Mo, Familie 14,90€/Mo
- Price-IDs in `.env.local` eintragen nach Stripe-Dashboard-Setup
- Webhook-Endpoint: `/api/stripe/webhook`

### Resend (noch nicht konfiguriert)
- `RESEND_API_KEY` in `.env.local` eintragen
- Deadline-Checker: `lib/notifications/deadline-checker.ts`

---

## iOS-App (SwiftUI)

### Build
```bash
cd ios/
xcodegen generate   # erzeugt PflegePilot.xcodeproj
open PflegePilot.xcodeproj
# In Xcode: Signing & Capabilities → Team auswählen
# Build & Run auf Device/Simulator
```

### Dateistruktur
```
ios/
├── project.yml                          ← XcodeGen Spec
└── PflegePilot/
    ├── PflegePilotApp.swift             ← @main Entry
    ├── ContentView.swift                ← Router (Onboarding/Auth/Dashboard)
    ├── Models/
    │   └── Pflegegrad.swift             ← Enums + Structs (Pflegegrad, Leistung, Budget, Profile)
    ├── Services/
    │   ├── AuthService.swift            ← Magic Link OTP
    │   ├── BenefitEngine.swift          ← 6 Leistungen + Int.formatEuro
    │   └── SupabaseService.swift        ← Supabase Client + API calls
    ├── Views/
    │   ├── Components/
    │   │   ├── Color+Hex.swift          ← Color(hex:) Extension
    │   │   ├── BudgetCard.swift
    │   │   ├── ProgressBar.swift
    │   │   └── EuroText.swift
    │   ├── Onboarding/
    │   │   └── OnboardingView.swift
    │   ├── Auth/
    │   │   └── AuthView.swift
    │   ├── QuickCheck/
    │   │   ├── QuickCheckView.swift     ← 5-Schritt Wizard
    │   │   └── QuickCheckResultView.swift
    │   └── Dashboard/
    │       └── DashboardView.swift      ← Tab-Bar + Dashboard + Leistungen + Profil
    └── Assets.xcassets/
        └── AppIcon.appiconset/
            ├── AppIcon-1024.png         ← Teal Icon mit Haus + Herz
            └── Contents.json
```

### Signing
- `DEVELOPMENT_TEAM` in `project.yml` ist leer → muss in Xcode manuell gesetzt werden
- Oder in `project.yml` die Team-ID eintragen (Format: `XXXXXXXXXX`)

### Supabase Key im iOS Code
- `ios/PflegePilot/Services/SupabaseService.swift` — Anon Key direkt hardcoded
- Für Production: in `Config.plist` auslagern (noch nicht gemacht)

---

## Primärfarbe
- Teal: `#0891B2` (CSS: `primary-600`, iOS: `Color(hex: "0891B2")`)

## Externe Links
- Pflegegrad-Rechner: `https://www.verbraucherzentrale.de/gesundheit-pflege/pflegegradrechner-lohnt-sich-ein-pflegeantrag-oder-ein-widerspruch-93979`
- Im Code: `lib/utils/constants.ts` → `VERBRAUCHERZENTRALE_URL`
- Im iOS Code: `QuickCheckView.swift` → direkte URL

---

## Offene Aufgaben (Stand 2026-03-14)

- [ ] **Stripe** — Price-IDs konfigurieren, Webhook-URL in Stripe Dashboard eintragen
- [ ] **Resend** — API Key eintragen, E-Mail-Templates gestalten
- [ ] **iOS Signing** — Team-ID in Xcode setzen für Device-Build
- [ ] **App Store** — App Store Connect Eintrag erstellen
- [ ] **Supabase RLS** — Policies testen (anon key + service role)
- [ ] **Push-Notifications iOS** — APNs-Zertifikat + Supabase Push konfigurieren
- [ ] **Google OAuth** — `NEXT_PUBLIC_SITE_URL` in Supabase Auth-Einstellungen setzen
- [ ] **Onboarding-Flow iOS** — Nach QuickCheck direkt in Dashboard weiterleiten
- [ ] **Transaktionen iOS** — Budget-Buchungen in der iOS-App ermöglichen
- [ ] **Premium-Paywall iOS** — StoreKit 2 Integration für iOS-seitiges Abo

---

## Bekannte Fixes (bereits erledigt)

- `next.config.ts` → `next.config.mjs` (Next.js 14 unterstützt kein .ts config)
- `CookieOptions` Typ-Import in `server.ts` und `middleware.ts`
- `SupabaseService.updateProfile` — `ProfileUpdate: Encodable` struct statt Dict
- AppIcon PNG erstellt (1024×1024, teal, Haus+Herz Design)
- Verbraucherzentrale URL korrigiert (alte URL war 404)
- `border-border` Tailwind-Klasse entfernt
