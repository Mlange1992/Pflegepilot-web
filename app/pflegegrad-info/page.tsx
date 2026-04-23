import type { Metadata } from 'next'
import Link from 'next/link'
import { DISCLAIMER, VERBRAUCHERZENTRALE_URL } from '@/lib/utils/constants'

export const metadata: Metadata = {
  title: 'Pflegegrad beantragen — Schritt für Schritt',
  description:
    'So beantragen Sie einen Pflegegrad: Antrag stellen, Begutachtung vorbereiten, Bescheid erhalten. Mit Links zu kostenlosen Hilfsmitteln.',
}

const SCHRITTE = [
  {
    nr: 1,
    titel: 'Antrag bei der Pflegekasse stellen',
    icon: '📞',
    inhalt: [
      'Rufen Sie Ihre Pflegekasse an (Nummer auf der Krankenkassenkarte) oder stellen Sie den Antrag schriftlich bzw. online.',
      'Die Pflegekasse ist gesetzlich verpflichtet, den Antrag entgegenzunehmen — Sie brauchen kein Formular.',
      'Notieren Sie das genaue Datum der Antragstellung. Ab diesem Datum läuft die Frist für die Begutachtung (25 Werktage).',
      'Tipp: Beantragen Sie gleichzeitig Pflegegeld, Sachleistungen und den Entlastungsbetrag — das spart Zeit.',
    ],
  },
  {
    nr: 2,
    titel: 'Begutachtung durch den MD vorbereiten',
    icon: '🩺',
    inhalt: [
      'Der Medizinische Dienst (MD) oder ein unabhängiger Gutachter kommt zu Ihnen nach Hause (oder ins Heim).',
      'Geprüft werden 6 Lebensbereiche: Mobilität, kognitive Fähigkeiten, Verhaltensweisen, Selbstversorgung, Umgang mit Erkrankungen und soziale Teilhabe.',
      'Führen Sie ein Pflegetagebuch für mind. 1–2 Wochen vor dem Termin: notieren Sie alle Pflegehandlungen mit Uhrzeit und Dauer.',
      'Legen Sie alle Medikamentenpläne, Arztbriefe und Befunde bereit.',
      'Haben Sie keine Angst: Der Gutachter will helfen, nicht prüfen. Zeigen Sie ruhig auch "schlechte Tage".',
    ],
  },
  {
    nr: 3,
    titel: 'Bescheid erhalten und Leistungen abrufen',
    icon: '📬',
    inhalt: [
      'Die Pflegekasse hat 25 Werktage Zeit, einen Bescheid zu erteilen. Bei Überschreitung gibt es eine Entschädigung (70€/Woche Verzug).',
      'Mit dem Bescheid werden rückwirkend ab Antragsdatum alle Leistungen gewährt.',
      'Sind Sie mit dem Pflegegrad nicht einverstanden? Legen Sie innerhalb von 4 Wochen Widerspruch ein — bei ca. 50% der Widersprüche wird der Pflegegrad angehoben.',
      'Beantragen Sie direkt nach dem Bescheid alle Leistungen, die einen Antrag erfordern (Pflegehilfsmittel, Wohnumfeldverbesserung etc.).',
    ],
  },
]

export default function PflegegradInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* ─── Header ────────────────────────────────────────── */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Pflegegrad beantragen — So geht es Schritt für Schritt
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Ein Pflegegrad ermöglicht den Zugang zu bis zu{' '}
            <span className="font-semibold text-primary-700">mehreren Tausend Euro</span>{' '}
            Unterstützung pro Jahr. Hier erklären wir den gesamten Prozess.
          </p>
        </div>

        {/* ─── Schritte ──────────────────────────────────────── */}
        <div className="space-y-6 mb-10">
          {SCHRITTE.map((s) => (
            <div
              key={s.nr}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Nummer */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-extrabold text-lg">
                  {s.nr}
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900 leading-tight">
                    {s.icon} {s.titel}
                  </p>
                </div>
              </div>
              <ul className="space-y-3 ml-14">
                {s.inhalt.map((punkt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                    <span className="text-primary-400 shrink-0 mt-1">•</span>
                    {punkt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Verbraucherzentrale Info-Box ──────────────────── */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">🧮</span>
            <div>
              <p className="font-bold text-primary-800 text-lg mb-2">
                Kostenloser Pflegegrad-Rechner
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Die Verbraucherzentrale bietet den besten kostenlosen
                Pflegegrad-Rechner Deutschlands (64 Kriterien, staatlich gefördert).
                Damit können Sie den voraussichtlichen Pflegegrad selbst einschätzen,
                bevor der Gutachter kommt.
              </p>
              <a
                href={VERBRAUCHERZENTRALE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-700 transition-colors text-sm"
              >
                Zum Pflegegrad-Rechner der Verbraucherzentrale →
              </a>
            </div>
          </div>
        </div>

        {/* ─── CTA: Nach dem Pflegegrad ──────────────────────── */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 text-center space-y-4 mb-6">
          <p className="font-extrabold text-xl">
            Pflegegrad erhalten?
          </p>
          <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
            Jetzt prüfen, welche Leistungen Ihrer Familie zustehen — und
            sicherstellen, dass kein Geld verfällt.
          </p>
          <Link
            href="/check"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-7 rounded-2xl min-h-[52px] hover:bg-primary-700 transition-colors"
          >
            Jetzt Leistungen prüfen →
          </Link>
        </div>

        {/* ─── Disclaimer ────────────────────────────────────── */}
        <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
