import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kostenlos – PflegePilot',
  description:
    'PflegePilot ist aktuell kostenlos — kein Abo, kein In-App-Kauf. Alle Features stehen jedem Nutzer offen.',
}

const FEATURES = [
  'Pflegegrad-Selbsttest nach offiziellem NBA-Verfahren (64 Kriterien)',
  'Budget-Dashboard: alle Töpfe mit Restbudget auf einen Blick',
  'Fristen-Alarm: Benachrichtigung vor Budget-Verfall',
  'PDF-Anträge: Erstantrag, Höherstufung, Widerspruch, VHP, Entlastungsbetrag',
  'MD-Termin-Checkliste: personalisiert basierend auf Selbsttest',
  '21 Ratgeber-Artikel zu allen Pflegeleistungen',
  'Mehrere Pflegebedürftige in einem Account',
  'Keine Registrierung nötig für den Pflegegrad-Check',
]

const FAQ = [
  {
    frage: 'Wie verdient PflegePilot Geld?',
    antwort:
      'PflegePilot plant, relevante Produkt-Empfehlungen (z.B. Pflegebox, Hausnotruf) zu zeigen, die klar als „Anzeige" gekennzeichnet sind. Aktuell sind keine Affiliate-Partner aktiv. Bei künftigen Vermittlungen erhält der Betreiber eine Provision — für Sie ohne Mehrkosten.',
  },
  {
    frage: 'Werden meine Daten gespeichert?',
    antwort:
      'Der Pflegegrad-Selbsttest läuft lokal auf Ihrem Gerät — ohne Registrierung, ohne Datenspeicherung. Für das Budget-Dashboard können Sie optional einen Account erstellen. Alle Daten werden verschlüsselt auf EU-Servern gespeichert (Supabase, Frankfurt).',
  },
  {
    frage: 'Gibt es eine iOS-App?',
    antwort:
      'Die iOS-App ist in Entwicklung. Tragen Sie sich auf unserer Warteliste ein — wir benachrichtigen Sie, sobald sie verfügbar ist.',
  },
  {
    frage: 'Bleibt PflegePilot kostenlos?',
    antwort:
      'Wir planen, den Dienst dauerhaft kostenlos anzubieten — finanziert über klar als „Anzeige" gekennzeichnete Affiliate-Empfehlungen. Aktuell sind keine Affiliate-Partner aktiv. Es gibt kein Abo und keinen In-App-Kauf.',
  },
  {
    frage: 'Wie werden meine Gesundheitsdaten geschützt?',
    antwort:
      'Pflegegrad-Daten sind sensible Gesundheitsdaten. Ohne Account verarbeiten wir gar nichts. Mit Account nur auf explizite Einwilligung (DSGVO Art. 9). Row-Level-Security stellt sicher, dass nur Sie Ihre Daten sehen können.',
  },
]

export default function PreisePage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-primary px-4 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-success-200/30 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="badge bg-success-50 text-success-700 ring-1 ring-success-200 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
            Aktuell kostenlos
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight text-balance leading-[1.1]">
            Kein Abo. Kein In-App-Kauf.{' '}
            <span className="bg-gradient-to-br from-success-600 to-primary-700 bg-clip-text text-transparent">
              Keine Tracking-Werbung.
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto text-pretty leading-relaxed">
            Alle Features stehen jedem Nutzer sofort zur Verfügung.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 pb-20">
        {/* Pricing Card */}
        <div className="relative bg-white rounded-3xl ring-2 ring-success-200 shadow-soft-xl p-8 md:p-10 mb-10 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-success-100/40 rounded-full blur-3xl" aria-hidden="true" />

          <div className="relative">
            <div className="text-center mb-7">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
                PflegePilot
              </p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-7xl md:text-8xl font-extrabold bg-gradient-to-br from-success-600 to-success-700 bg-clip-text text-transparent tracking-tight">
                  0 €
                </span>
                <span className="text-gray-400 text-lg mb-3">/Monat</span>
              </div>
              <p className="text-gray-500 mt-2 text-sm">Aktuell kostenlos. Kein Abo, kein In-App-Kauf.</p>
            </div>

            <ul className="space-y-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-success-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/check"
              className="block text-center py-4 px-6 rounded-2xl bg-gradient-to-br from-success-600 to-success-700 text-white text-base font-semibold hover:from-success-500 hover:to-success-600 transition-all min-h-[56px] flex items-center justify-center shadow-soft-lg active:scale-[0.98]"
            >
              Jetzt kostenlos starten →
            </Link>
            <p className="text-center text-xs text-gray-400 mt-3">
              Keine Registrierung nötig. Kein Abo. Keine Tracking-Werbung.
            </p>
          </div>
        </div>

        {/* Wie wir uns finanzieren */}
        <div className="bg-amber-50 border border-amber-100 ring-1 ring-amber-200/50 rounded-2xl p-6 mb-12 shadow-soft">
          <div className="flex gap-4">
            <span className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/60 ring-1 ring-amber-200 flex items-center justify-center text-2xl shadow-soft">
              💡
            </span>
            <div>
              <p className="font-bold text-gray-900 mb-1.5">Wie finanziert sich PflegePilot?</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Wir planen, relevante Produkt-Empfehlungen (z.B. Pflegebox, Hausnotruf) zu zeigen,
                die klar als <strong>„Anzeige"</strong> gekennzeichnet sein werden. Aktuell sind keine
                Partner aktiv. Bei künftigen Vermittlungen erhalten wir eine kleine Provision —
                für Sie ohne Mehrkosten.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="section-eyebrow">Häufige Fragen</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Antworten auf einen Blick
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(({ frage, antwort }) => (
              <details
                key={frage}
                className="card group p-0 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none">
                  <p className="font-semibold text-gray-900 text-[15px]">{frage}</p>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 transition-transform group-open:rotate-180 group-open:bg-primary-100 group-open:text-primary-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{antwort}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/check" className="btn-primary">
            Jetzt kostenlos starten →
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            Keine Registrierung nötig · Keine Kreditkarte · Kein Abo
          </p>
        </div>
      </div>
    </main>
  )
}
