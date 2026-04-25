import type { Metadata } from 'next'
import Link from 'next/link'
import { VERBRAUCHERZENTRALE_URL } from '@/lib/utils/constants'

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
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-primary px-4 pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-200/30 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="badge bg-white/80 ring-1 ring-primary-200 text-primary-700 backdrop-blur-sm mb-5">
            <span className="text-base">📝</span>
            Schritt-für-Schritt-Anleitung
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight text-balance leading-[1.1]">
            Pflegegrad beantragen —{' '}
            <span className="bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent">
              So geht es
            </span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto text-pretty leading-relaxed">
            Ein Pflegegrad ermöglicht den Zugang zu bis zu{' '}
            <span className="font-semibold text-primary-700">mehreren Tausend Euro</span>{' '}
            Unterstützung pro Jahr. Hier erklären wir den gesamten Prozess.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Schritte mit Connector-Linie */}
        <div className="relative mb-12">
          <div
            className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-primary-200 via-primary-100 to-transparent hidden sm:block"
            aria-hidden="true"
          />
          <div className="space-y-6">
            {SCHRITTE.map((s) => (
              <div key={s.nr} className="card p-6 md:p-8 relative">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center font-extrabold text-lg shadow-glow-primary">
                      {s.nr}
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">
                      <span className="mr-2">{s.icon}</span>
                      {s.titel}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 sm:ml-16">
                  {s.inhalt.map((punkt, i) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] text-gray-600 leading-relaxed">
                      <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-primary-400" />
                      <span>{punkt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Verbraucherzentrale Info-Box */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/40 border border-primary-100 rounded-2xl p-6 md:p-8 mb-10 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <span className="shrink-0 w-14 h-14 rounded-2xl bg-white ring-1 ring-primary-200 flex items-center justify-center text-3xl shadow-soft">
              🧮
            </span>
            <div className="flex-1">
              <p className="font-bold text-primary-900 text-lg mb-2 tracking-tight">
                Kostenloser Pflegegrad-Rechner
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">
                Die Verbraucherzentrale bietet den besten kostenlosen
                Pflegegrad-Rechner Deutschlands (64 Kriterien, staatlich gefördert).
                Damit können Sie den voraussichtlichen Pflegegrad selbst einschätzen,
                bevor der Gutachter kommt.
              </p>
              <a
                href={VERBRAUCHERZENTRALE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-700 transition-colors text-sm shadow-glow-primary"
              >
                Zum Pflegegrad-Rechner der Verbraucherzentrale →
              </a>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 px-6 py-10 md:px-10 md:py-14 text-center shadow-soft-xl">
          <div className="pointer-events-none absolute inset-0 bg-mesh-dark" aria-hidden="true" />
          <div className="relative">
            <p className="font-extrabold text-2xl md:text-3xl text-white mb-3 tracking-tight">
              Pflegegrad erhalten?
            </p>
            <p className="text-gray-300 text-base max-w-md mx-auto leading-relaxed mb-6">
              Jetzt prüfen, welche Leistungen Ihrer Familie zustehen — und
              sicherstellen, dass kein Geld verfällt.
            </p>
            <Link
              href="/check"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3.5 px-7 rounded-2xl min-h-[52px] hover:bg-primary-500 transition-colors shadow-glow-primary"
            >
              Jetzt Leistungen prüfen →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
