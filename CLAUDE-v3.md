# CLAUDE.md — Projektanweisungen für Claude Code

## Projekt

PflegePilot — Digitaler Pflege-Finanzmanager für deutsche Familien.
Lies SPEC.md für die vollständige Produktspezifikation (V3).

## Kernidee in einem Satz

PflegePilot zeigt pflegenden Familien, wieviel Geld sie von der Pflegekasse verschenken — und hilft beim Abruf.

## Was PflegePilot NICHT ist

- KEIN Pflegegrad-Rechner (Verbraucherzentrale ist besser → verlinken)
- KEIN Pflege-Organizer (Nui Care ist besser)
- KEIN Ratgeber-Portal (pflege.de ist besser)

## Was PflegePilot IST

- Ein persönliches Budget-Dashboard für ALLE Pflegeleistungen
- Ein Fristen-Autopilot der warnt, bevor Geld verfällt
- Ein "Du verlierst X.XXX€"-Trigger der zum Handeln motiviert
- Ein Antrags- und Beleg-Manager für den laufenden Abruf

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security, Edge Functions)
- **E-Mail:** Resend
- **PDF:** @react-pdf/renderer
- **Payments:** Stripe
- **Deployment:** Vercel

## Sprache

ALLES auf Deutsch — UI-Texte, Labels, Fehlermeldungen, Validierungen, Platzhalter.
Beträge im deutschen Format: 1.572,00 €
Verwende `Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })` für Formatierung.

## Code-Konventionen

- TypeScript strict mode
- Funktionale React-Komponenten mit benannten Exports
- Tailwind für Styling, keine separaten CSS-Dateien
- Supabase Client: `lib/supabase/client.ts` (Browser) + `lib/supabase/server.ts` (Server)
- Pflegerecht-Daten: `lib/pflegerecht/*.json` — OHNE Code-Änderung aktualisierbar
- Alle Supabase-Tabellen mit Row Level Security
- Alle Beträge intern als Integer in Cents (vermeidet Float-Probleme)

## Ordnerstruktur

```
pflegepilot/
├── app/
│   ├── (marketing)/        # Öffentlich: Landing, Preise, Blog, Leistungen
│   │   ├── page.tsx         # Landing Page mit inline Quick-Check
│   │   ├── preise/
│   │   ├── leistungen/
│   │   │   └── [slug]/
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   └── pflegegrad-info/
│   ├── (app)/               # Auth-geschützt: Dashboard, Anträge
│   │   ├── dashboard/
│   │   │   ├── page.tsx     # Budget-Dashboard (KERN)
│   │   │   └── [slug]/      # Detail pro Leistung
│   │   └── layout.tsx       # Auth-Check Wrapper
│   ├── check/               # Quick-Check (KEIN Login)
│   │   └── page.tsx
│   ├── ergebnis/            # Ergebnis (KEIN Login)
│   │   └── page.tsx
│   ├── auth/
│   │   └── page.tsx
│   ├── api/
│   │   ├── webhooks/stripe/
│   │   └── notifications/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                  # Button, Card, Badge, Progress, Input...
│   ├── check/               # Quick-Check Wizard Komponenten
│   ├── dashboard/           # Budget-Cards, DeadlineTimeline, OptTips
│   └── marketing/           # Hero, Features, Pricing, Footer
├── lib/
│   ├── pflegerecht/
│   │   ├── leistungen-2026.json
│   │   ├── fristen.json
│   │   └── engine.ts        # calculateBenefits(), formatEuro() etc.
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── utils/
│       ├── format.ts        # formatEuro(), formatDate()
│       └── constants.ts     # Bundesländer-Liste etc.
├── supabase/
│   └── migrations/          # SQL Migrations
├── SPEC.md
└── CLAUDE.md
```

## Entwicklungsreihenfolge

Befolge Kapitel 9 in SPEC.md. Starte mit:
1. Supabase + Datenmodell + Auth + RLS
2. Pflegerecht-Engine (JSON + TypeScript)
3. Quick-Check (5 Fragen → Euro-Ergebnis, KEIN Login)

## Wichtige Regeln

- Quick-Check und Ergebnis funktionieren OHNE Login
- Dashboard ist Premium (nach Login + Abo)
- Disclaimer auf jeder Seite: "PflegePilot ersetzt keine Rechtsberatung."
- Bei Pflegegrad-Fragen → Link zur Verbraucherzentrale, NICHT selbst bauen
- Mobile First (70%+ mobile Nutzer)
- DSGVO-konform (RLS, EU-Server, Cookie-Banner)
- Alle Beträge intern als Cents (Integer), Anzeige via formatEuro()
