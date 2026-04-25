import type { Metadata } from 'next'
import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-700 font-bold text-sm px-4 py-2 rounded-full mb-4">
            AKTUELL KOSTENLOS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Kein Abo. Kein In-App-Kauf. Keine Tracking-Werbung.
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Alle Features stehen jedem Nutzer sofort zur Verfügung.
          </p>
        </div>

        {/* Einzige Pricing Card */}
        <div className="bg-white rounded-2xl border-2 border-green-200 shadow-lg p-8 mb-10">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              PflegePilot
            </p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-6xl font-extrabold text-green-600">0 €</span>
              <span className="text-gray-400 text-lg mb-2">/Monat</span>
            </div>
            <p className="text-gray-500 mt-2">Aktuell kostenlos. Kein Abo, kein In-App-Kauf.</p>
          </div>
          <ul className="space-y-3 mb-8">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-green-500 shrink-0 mt-0.5 text-lg">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/check"
            className="block text-center py-4 px-5 rounded-xl bg-green-600 text-white text-base font-semibold hover:bg-green-700 transition-colors min-h-[52px] flex items-center justify-center"
          >
            Jetzt kostenlos starten →
          </Link>
          <p className="text-center text-xs text-gray-400 mt-3">
            Keine Registrierung nötig. Kein Abo. Keine Tracking-Werbung.
          </p>
        </div>

        {/* Wie wir uns finanzieren */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
          <div className="flex gap-3">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Wie finanziert sich PflegePilot?</p>
              <p className="text-sm text-gray-600">
                Wir planen, relevante Produkt-Empfehlungen (z.B. Pflegebox, Hausnotruf) zu zeigen,
                die klar als <strong>„Anzeige"</strong> gekennzeichnet sein werden. Aktuell sind keine
                Partner aktiv. Bei künftigen Vermittlungen erhalten wir eine kleine Provision —
                für Sie ohne Mehrkosten.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            {FAQ.map(({ frage, antwort }) => (
              <div
                key={frage}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <p className="font-semibold text-gray-900 mb-2">{frage}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{antwort}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-6">
          <Link
            href="/check"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold py-4 px-8 rounded-2xl min-h-[56px] hover:bg-primary-700 transition-colors text-base"
          >
            Jetzt kostenlos starten →
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            Keine Registrierung nötig · Keine Kreditkarte · Kein Abo
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
