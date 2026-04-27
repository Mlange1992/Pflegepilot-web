import type { Metadata } from 'next'
import Link from 'next/link'
import { ratgeberArtikel } from '@/lib/ratgeber-data'

export const metadata: Metadata = {
  title: 'Support – PflegePilot',
  description:
    'Hilfe und Kontakt zu PflegePilot — Fragen, Konto-Löschung und Disclaimer.',
}

export default function SupportPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
        <header className="pb-6 border-b border-gray-200">
          <span className="section-eyebrow">Hilfe</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Support
          </h1>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">Kontakt</h2>
          <p className="text-gray-600 leading-relaxed">
            Bei Fragen, Problemen oder Feedback erreichen Sie uns am schnellsten
            per E-Mail unter{' '}
            <a href="mailto:info@pflege-pilot.com" className="text-primary-700 underline">
              info@pflege-pilot.com
            </a>
            . Wir antworten meist innerhalb von 1–2 Werktagen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">Häufige Fragen</h2>
          <p className="text-gray-600">
            Antworten auf die meisten Fragen finden Sie in unseren{' '}
            <Link href="/ratgeber" className="text-primary-700 underline">
              {ratgeberArtikel.length} Ratgeber-Artikeln
            </Link>{' '}
            und auf der{' '}
            <Link href="/preise" className="text-primary-700 underline">
              Preise-Seite
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">Konto löschen</h2>
          <p className="text-gray-600 leading-relaxed">
            In der iOS-App können Sie Ihr Konto unter „Profil → Konto löschen"
            jederzeit selbst löschen. Alle Daten werden dann unwiderruflich
            entfernt (DSGVO Art. 17). Alternativ schreiben Sie uns eine E-Mail
            mit dem Betreff „Kontolöschung".
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">Disclaimer</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            PflegePilot ersetzt keine Rechts- oder Pflegeberatung. Die Beträge
            entsprechen den gesetzlichen SGB-XI-Regelungen Stand 2026.
          </p>
        </section>
      </div>
    </main>
  )
}
