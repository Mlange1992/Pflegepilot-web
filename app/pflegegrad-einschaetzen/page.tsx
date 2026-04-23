'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'

// ─── Typen ───────────────────────────────────────────────────────────────────

type Antwort = 0 | 1 | 2 | 3

interface Frage {
  id: string
  text: string
  modul: number
}

// ─── Fragen (6 Module, vereinfacht) ──────────────────────────────────────────

const FRAGEN: Frage[] = [
  // Modul 1: Kognition & Kommunikation
  { id: 'm1_1', text: 'Personen aus dem näheren Umfeld erkennen', modul: 1 },
  { id: 'm1_2', text: 'Örtliche Orientierung (weiß wo man sich befindet)', modul: 1 },
  { id: 'm1_3', text: 'Zeitliche Orientierung (Datum, Wochentag, Uhrzeit)', modul: 1 },
  { id: 'm1_4', text: 'Eigene Bedürfnisse verständlich machen', modul: 1 },

  // Modul 2: Mobilität
  { id: 'm2_1', text: 'Selbstständiges Aufstehen aus dem Bett / Stuhl', modul: 2 },
  { id: 'm2_2', text: 'Treppensteigen', modul: 2 },
  { id: 'm2_3', text: 'Gehen auf ebenem Untergrund', modul: 2 },
  { id: 'm2_4', text: 'Positionswechsel im Bett', modul: 2 },

  // Modul 3: Verhaltensweisen
  { id: 'm3_1', text: 'Motorisch geprägte Verhaltensauffälligkeiten (Unruhe, Umherlaufen)', modul: 3 },
  { id: 'm3_2', text: 'Nächtliche Unruhe', modul: 3 },
  { id: 'm3_3', text: 'Ängste / Aggressionen gegenüber Pflegepersonen', modul: 3 },

  // Modul 4: Selbstversorgung
  { id: 'm4_1', text: 'Waschen des Oberkörpers', modul: 4 },
  { id: 'm4_2', text: 'Duschen / Baden', modul: 4 },
  { id: 'm4_3', text: 'An- und Auskleiden des Oberkörpers', modul: 4 },
  { id: 'm4_4', text: 'Mundgerechtes Zubereiten der Nahrung', modul: 4 },
  { id: 'm4_5', text: 'Essen und Trinken', modul: 4 },
  { id: 'm4_6', text: 'Blasenentleerung (Kontinenz)', modul: 4 },
  { id: 'm4_7', text: 'Darmkontrolle (Kontinenz)', modul: 4 },

  // Modul 5: Krankheitsbewältigung
  { id: 'm5_1', text: 'Medikamente selbstständig einnehmen', modul: 5 },
  { id: 'm5_2', text: 'Arzttermine selbstständig wahrnehmen', modul: 5 },
  { id: 'm5_3', text: 'Blutzucker / Blutdruck selbst messen', modul: 5 },

  // Modul 6: Alltag & soziale Kontakte
  { id: 'm6_1', text: 'Tagesablauf selbstständig gestalten', modul: 6 },
  { id: 'm6_2', text: 'Kontakte zu anderen Menschen pflegen', modul: 6 },
  { id: 'm6_3', text: 'Freizeitaktivitäten selbstständig ausüben', modul: 6 },
]

const MODUL_NAMEN: Record<number, string> = {
  1: 'Kognition & Kommunikation',
  2: 'Mobilität',
  3: 'Verhaltensweisen',
  4: 'Selbstversorgung',
  5: 'Umgang mit Erkrankungen',
  6: 'Alltag & soziale Kontakte',
}

const ANTWORT_LABELS: Record<Antwort, string> = {
  0: 'Selbstständig',
  1: 'Überwiegend selbstständig',
  2: 'Überwiegend unselbstständig',
  3: 'Unselbstständig',
}

// ─── Gewichtung der Module (§ 15 SGB XI) ────────────────────────────────────

const MODUL_GEWICHT: Record<number, number> = {
  1: 0.15,
  2: 0.10,
  3: 0.15,
  4: 0.40,
  5: 0.20,
  6: 0.15,
}

// Modul 1 und 3 gehen zusammen (max 15%) — vereinfacht: Durchschnitt
function berechneGesamtpunktzahl(antworten: Record<string, Antwort>): number {
  const modulScores: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }

  FRAGEN.forEach((f) => {
    const wert = antworten[f.id] ?? 0
    modulScores[f.modul].push(wert)
  })

  let gesamt = 0
  for (let m = 1; m <= 6; m++) {
    const punkte = modulScores[m]
    if (punkte.length === 0) continue
    const sum = punkte.reduce((a, b) => a + b, 0)
    const max = punkte.length * 3
    const prozent = (sum / max) * 100
    gesamt += prozent * MODUL_GEWICHT[m]
  }

  return gesamt
}

function punktzahlZuPflegegrad(punkte: number): number {
  if (punkte < 12.5) return 0
  if (punkte < 27) return 1
  if (punkte < 47.5) return 2
  if (punkte < 70) return 3
  if (punkte < 90) return 4
  return 5
}

// ─── Ergebnis-Komponente ──────────────────────────────────────────────────────

function Ergebnis({ antworten }: { antworten: Record<string, Antwort> }) {
  const punkte = berechneGesamtpunktzahl(antworten)
  const pg = punktzahlZuPflegegrad(punkte)

  const pgFarbe: Record<number, string> = {
    0: 'bg-gray-100 text-gray-700',
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-orange-200 text-orange-900',
    4: 'bg-red-100 text-red-800',
    5: 'bg-red-200 text-red-900',
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Geschätzter Pflegegrad</p>
        <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full text-4xl font-extrabold ${pgFarbe[pg]}`}>
          {pg === 0 ? 'PG 0' : `PG ${pg}`}
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Gesamt-Punktzahl: {punkte.toFixed(1)} von 100
        </p>
      </div>

      {pg === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
          <p className="font-semibold text-gray-800 mb-2">Kein Pflegegrad erkennbar</p>
          <p>Auf Basis Ihrer Angaben liegt die Punktzahl unter dem Schwellenwert für Pflegegrad 1. Falls Sie Bedenken haben, empfehlen wir ein Gespräch mit Ihrer Pflegekasse.</p>
        </div>
      ) : (
        <div className="bg-primary-50 rounded-2xl p-5 space-y-3">
          <p className="font-semibold text-primary-900">Was bedeutet das?</p>
          <p className="text-sm text-primary-800 leading-relaxed">
            Pflegegrad {pg} bedeutet, dass voraussichtlich erhebliche bis{pg >= 4 ? ' schwerste' : ' schwere'} Beeinträchtigungen der Selbstständigkeit vorliegen.
            Beantragen Sie den Pflegegrad bei Ihrer Pflegekasse — ab Antragstellung zählt das Datum.
          </p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Wichtiger Hinweis</p>
        <p>Diese Einschätzung ersetzt keine offizielle Begutachtung durch den MDK / MEDICPROOF. Stellen Sie den Antrag bei Ihrer Pflegekasse — nur die offizielle Begutachtung ist rechtswirksam.</p>
      </div>

      {pg > 0 && (
        <div className="space-y-3">
          <Link
            href={`/check?pg=${pg}`}
            className="block w-full text-center bg-primary-600 text-white font-semibold py-4 rounded-2xl hover:bg-primary-700 transition-colors"
          >
            Meine Leistungen mit PG {pg} berechnen →
          </Link>
          <Link
            href="/auth"
            className="block w-full text-center border-2 border-primary-200 text-primary-700 font-semibold py-4 rounded-2xl hover:bg-primary-50 transition-colors"
          >
            Budget tracken & Fristen nie verpassen →
          </Link>
        </div>
      )}

      <div className="bg-gray-900 rounded-2xl p-5 text-center">
        <p className="text-white font-bold mb-1">Noch genauer: iOS App</p>
        <p className="text-gray-300 text-sm mb-3">64 Kriterien nach §15 SGB XI · Push-Benachrichtigungen · PDF-Export</p>
        <a
          href="https://apps.apple.com/app/pflegepilot"
          className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
        >
          Kostenlos im App Store →
        </a>
      </div>

      <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
    </div>
  )
}

// ─── Hauptseite ───────────────────────────────────────────────────────────────

export default function PflegegradEinschaetzenPage() {
  const [antworten, setAntworten] = useState<Record<string, Antwort>>({})
  const [fertig, setFertig] = useState(false)

  const aktuellesModul = (() => {
    for (let m = 1; m <= 6; m++) {
      const fragenDesModuls = FRAGEN.filter((f) => f.modul === m)
      const beantwortet = fragenDesModuls.filter((f) => antworten[f.id] !== undefined).length
      if (beantwortet < fragenDesModuls.length) return m
    }
    return null
  })()

  const gesamtBeantwortet = Object.keys(antworten).length
  const fortschritt = Math.round((gesamtBeantwortet / FRAGEN.length) * 100)

  const setAntwort = (id: string, wert: Antwort) => {
    setAntworten((prev) => ({ ...prev, [id]: wert }))
  }

  if (fertig) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 px-4 py-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← PflegePilot
          </Link>
        </header>
        <main className="max-w-lg mx-auto px-4 py-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Ihr Ergebnis</h1>
          <Ergebnis antworten={antworten} />
        </main>
      </div>
    )
  }

  const modulFragen = FRAGEN.filter((f) => f.modul === aktuellesModul)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/check" className="text-sm text-gray-500 hover:text-gray-700">
          ← Zurück
        </Link>
        <span className="text-xs text-gray-400">{fortschritt}% abgeschlossen</span>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Fortschritt */}
        <div className="mb-6">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${fortschritt}%` }}
            />
          </div>
        </div>

        {aktuellesModul && (
          <div className="space-y-4">
            <div className="mb-6">
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                Modul {aktuellesModul} von 6
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {MODUL_NAMEN[aktuellesModul]}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Wie selbstständig ist die Person bei folgenden Aktivitäten?
              </p>
            </div>

            {modulFragen.map((frage) => (
              <div key={frage.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm font-medium text-gray-800 mb-3">{frage.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  {([0, 1, 2, 3] as Antwort[]).map((wert) => (
                    <button
                      key={wert}
                      type="button"
                      onClick={() => setAntwort(frage.id, wert)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-colors text-left ${
                        antworten[frage.id] === wert
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'
                      }`}
                    >
                      {ANTWORT_LABELS[wert]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {aktuellesModul === null && (
          <div className="text-center py-8 space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-bold text-gray-900">Alle Fragen beantwortet</h2>
            <p className="text-gray-500 text-sm">Klicken Sie auf "Ergebnis anzeigen" um Ihre Einschätzung zu sehen.</p>
          </div>
        )}
      </main>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          {aktuellesModul === null ? (
            <button
              type="button"
              onClick={() => setFertig(true)}
              className="w-full bg-primary-600 text-white font-semibold py-4 rounded-2xl hover:bg-primary-700 transition-colors"
            >
              Ergebnis anzeigen →
            </button>
          ) : (
            <p className="text-xs text-gray-400 text-center">
              Beantworten Sie alle Fragen in Modul {aktuellesModul}, um fortzufahren
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
