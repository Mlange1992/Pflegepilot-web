import type { Metadata } from 'next'
import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'

export const metadata: Metadata = {
  title: 'Wie funktionieren die Fristen? – PflegePilot',
  description:
    'Welche Pflegeleistungen verfallen wann? Entlastungsbetrag, Pflegehilfsmittel, Entlastungsbudget — alle Fristen auf einen Blick.',
}

const FRISTEN = [
  {
    icon: '💰',
    name: 'Entlastungsbetrag (§ 45b SGB XI)',
    betrag: '131 €/Monat',
    frist: '30. Juni des Folgejahres',
    detail:
      'Nicht genutzte Beträge können ins Folgejahr übertragen werden — aber nur bis 30. Juni. Danach verfallen sie unwiderruflich. Beispiel: Der Entlastungsbetrag für 2025 verfällt am 30. Juni 2026.',
    color: 'bg-orange-50 border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-700',
    label: '⚠️ Achtung: Frist 30. Juni',
  },
  {
    icon: '🔀',
    name: 'Gemeinsames Entlastungsbudget (§ 42a SGB XI)',
    betrag: '3.539 €/Jahr',
    frist: '31. Dezember',
    detail:
      'Das Gemeinsame Entlastungsbudget (ab 01.07.2025) verfällt am Jahresende. Eine Übertragung ins Folgejahr ist nicht möglich. Frühzeitig planen!',
    color: 'bg-red-50 border-red-200',
    badgeColor: 'bg-red-100 text-red-700',
    label: '⛔ Kein Übertrag ins Folgejahr',
  },
  {
    icon: '🧤',
    name: 'Pflegehilfsmittel (§ 40 Abs. 2 SGB XI)',
    betrag: '42 €/Monat',
    frist: 'Monatlich – kein Übertrag',
    detail:
      'Das monatliche Budget von 42 € gilt nur für den laufenden Monat. Nicht genutzte Beträge verfallen und können nicht auf den nächsten Monat übertragen werden. Am besten jeden Monat eine Box bestellen.',
    color: 'bg-yellow-50 border-yellow-200',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    label: '📅 Monatlich nutzen',
  },
  {
    icon: '🏗️',
    name: 'Wohnumfeldverbesserung (§ 40 Abs. 4 SGB XI)',
    betrag: 'bis 4.180 € je Maßnahme',
    frist: 'Kein Verfall',
    detail:
      'Dieser Zuschuss verfällt nicht. Wichtig: Der Antrag muss VOR dem Umbau gestellt werden — rückwirkende Erstattung ist ausgeschlossen.',
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-100 text-green-700',
    label: '✅ Kein Verfall',
  },
  {
    icon: '🏠',
    name: 'Pflegegeld & Sachleistungen (§ 36–38 SGB XI)',
    betrag: 'je nach Pflegegrad',
    frist: '31. Dezember',
    detail:
      'Pflegegeld und Sachleistungen sind monatliche Leistungen. Werden sie nicht abgerufen, verfallen sie am Monatsende. Es gibt keine Ansparmöglichkeit.',
    color: 'bg-blue-50 border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-700',
    label: '📅 Monatlich',
  },
]

export default function FristenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-700 transition-colors">Start</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Fristen</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Wie funktionieren die Fristen?
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Jede Pflegeleistung hat eigene Verfallsregeln. Hier auf einen Blick.
        </p>

        <div className="space-y-4 mb-10">
          {FRISTEN.map((f) => (
            <div
              key={f.name}
              className={`rounded-2xl border p-5 ${f.color}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 text-sm leading-tight">{f.name}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.badgeColor}`}>
                      {f.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    <strong>Betrag:</strong> {f.betrag} &nbsp;·&nbsp; <strong>Verfallsdatum:</strong> {f.frist}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🔔</span>
            <div>
              <p className="font-bold text-primary-800 mb-1">Nie wieder eine Frist verpassen</p>
              <p className="text-sm text-gray-600 mb-4">
                PflegePilot erinnert Sie automatisch 90, 30 und 7 Tage vor dem Verfall —
                per E-Mail und Push-Benachrichtigung.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-700 transition-colors text-sm"
              >
                Kostenlos anmelden →
              </Link>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
