import type { Metadata } from 'next'
import Link from 'next/link'

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
    accent: 'bg-gradient-to-br from-warning-50 to-warning-100/30 ring-warning-100',
    iconBg: 'from-warning-100 to-warning-200/60 ring-warning-200',
    badgeColor: 'bg-warning-100 text-warning-700 ring-warning-200',
    label: '⚠️ Achtung: Frist 30. Juni',
  },
  {
    icon: '🔀',
    name: 'Gemeinsames Entlastungsbudget (§ 42a SGB XI)',
    betrag: '3.539 €/Jahr',
    frist: '31. Dezember',
    detail:
      'Das Gemeinsame Entlastungsbudget (ab 01.07.2025) verfällt am Jahresende. Eine Übertragung ins Folgejahr ist nicht möglich. Frühzeitig planen!',
    accent: 'bg-gradient-to-br from-danger-50 to-danger-100/30 ring-danger-100',
    iconBg: 'from-danger-100 to-danger-200/60 ring-danger-200',
    badgeColor: 'bg-danger-100 text-danger-700 ring-danger-200',
    label: '⛔ Kein Übertrag ins Folgejahr',
  },
  {
    icon: '🧤',
    name: 'Pflegehilfsmittel (§ 40 Abs. 2 SGB XI)',
    betrag: '42 €/Monat',
    frist: 'Monatlich – kein Übertrag',
    detail:
      'Das monatliche Budget von 42 € gilt nur für den laufenden Monat. Nicht genutzte Beträge verfallen und können nicht auf den nächsten Monat übertragen werden. Am besten jeden Monat eine Box bestellen.',
    accent: 'bg-gradient-to-br from-amber-50 to-amber-100/30 ring-amber-100',
    iconBg: 'from-amber-100 to-amber-200/60 ring-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700 ring-amber-200',
    label: '📅 Monatlich nutzen',
  },
  {
    icon: '🏗️',
    name: 'Wohnumfeldverbesserung (§ 40 Abs. 4 SGB XI)',
    betrag: 'bis 4.180 € je Maßnahme',
    frist: 'Kein Verfall',
    detail:
      'Dieser Zuschuss verfällt nicht. Wichtig: Der Antrag muss VOR dem Umbau gestellt werden — rückwirkende Erstattung ist ausgeschlossen.',
    accent: 'bg-gradient-to-br from-success-50 to-success-100/30 ring-success-100',
    iconBg: 'from-success-100 to-success-200/60 ring-success-200',
    badgeColor: 'bg-success-100 text-success-700 ring-success-200',
    label: '✅ Kein Verfall',
  },
  {
    icon: '🏠',
    name: 'Pflegegeld & Sachleistungen (§ 36–38 SGB XI)',
    betrag: 'je nach Pflegegrad',
    frist: '31. Dezember',
    detail:
      'Pflegegeld und Sachleistungen sind monatliche Leistungen. Werden sie nicht abgerufen, verfallen sie am Monatsende. Es gibt keine Ansparmöglichkeit.',
    accent: 'bg-gradient-to-br from-primary-50 to-primary-100/30 ring-primary-100',
    iconBg: 'from-primary-100 to-primary-200/60 ring-primary-200',
    badgeColor: 'bg-primary-100 text-primary-700 ring-primary-200',
    label: '📅 Monatlich',
  },
]

export default function FristenPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-700 transition-colors">Start</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Fristen</span>
        </nav>

        <div className="mb-10">
          <span className="section-eyebrow">Verfallsregeln</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight text-balance">
            Wie funktionieren die Fristen?
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed text-pretty">
            Jede Pflegeleistung hat eigene Verfallsregeln. Hier auf einen Blick.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {FRISTEN.map((f) => (
            <div
              key={f.name}
              className={`rounded-2xl ring-1 p-6 ${f.accent} shadow-soft transition-all hover:shadow-soft-md`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${f.iconBg} ring-1 flex items-center justify-center text-3xl shadow-soft`}>
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <p className="font-bold text-gray-900 leading-tight">{f.name}</p>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ring-1 ${f.badgeColor}`}>
                      {f.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 ring-1 ring-white/50">
                    <span><strong className="text-gray-700">Betrag:</strong> {f.betrag}</span>
                    <span className="text-gray-300">·</span>
                    <span><strong className="text-gray-700">Verfall:</strong> {f.frist}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 md:p-10 shadow-glow-primary">
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col sm:flex-row items-start gap-5">
            <span className="shrink-0 w-14 h-14 rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm flex items-center justify-center text-3xl">
              🔔
            </span>
            <div className="flex-1">
              <p className="font-extrabold text-white text-xl mb-2 tracking-tight">Nie wieder eine Frist verpassen</p>
              <p className="text-primary-50 mb-5 leading-relaxed">
                PflegePilot erinnert Sie automatisch 90, 30 und 7 Tage vor dem Verfall —
                per E-Mail und Push-Benachrichtigung.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center bg-white text-primary-700 font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-50 transition-colors text-sm shadow-soft-lg"
              >
                Kostenlos anmelden →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
