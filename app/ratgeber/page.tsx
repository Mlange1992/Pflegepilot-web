import type { Metadata } from 'next'
import Link from 'next/link'
import { ratgeberArtikel } from '@/lib/ratgeber-data'
import { DISCLAIMER } from '@/lib/utils/constants'

export const metadata: Metadata = {
  title: 'Ratgeber Pflege 2025 – Alle Leistungen erklärt | PflegePilot',
  description:
    'Kostenloser Pflege-Ratgeber: Entlastungsbetrag, Verhinderungspflege, Pflegegrad beantragen, Widerspruch einlegen und mehr. Einfach erklärt von PflegePilot.',
}

const TAG_FARBEN: Record<string, string> = {
  entlastungsbetrag: 'bg-green-100 text-green-700',
  budget: 'bg-blue-100 text-blue-700',
  widerspruch: 'bg-red-100 text-red-700',
  hausnotruf: 'bg-orange-100 text-orange-700',
  steuer: 'bg-purple-100 text-purple-700',
}

function tagFarbe(tag: string): string {
  return TAG_FARBEN[tag] ?? 'bg-gray-100 text-gray-600'
}

export default function RatgeberPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-100 text-primary-700 font-bold text-sm px-4 py-2 rounded-full mb-4">
            21 Ratgeber-Artikel
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Pflege-Ratgeber 2025
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-6">
            Alle wichtigen Pflegeleistungen verständlich erklärt — von Entlastungsbetrag
            bis Widerspruch. Kostenlos und unabhängig.
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold py-3 px-7 rounded-2xl min-h-[52px] hover:bg-primary-700 transition-colors text-base"
          >
            Pflegegrad prüfen → Kostenlos & ohne Registrierung
          </Link>
        </div>

        {/* Artikel-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {ratgeberArtikel.map((artikel) => (
            <Link
              key={artikel.slug}
              href={`/ratgeber/${artikel.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0" role="img" aria-label={artikel.titel}>
                  {artikel.icon}
                </span>
                <p className="font-bold text-gray-900 leading-tight group-hover:text-primary-700 transition-colors">
                  {artikel.titel}
                </p>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                {artikel.kurztext}
              </p>

              <div className="flex flex-wrap gap-1 mt-auto">
                {artikel.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagFarbe(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span className="text-xs text-primary-600 font-semibold group-hover:underline">
                Artikel lesen →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center mb-10">
          <p className="font-extrabold text-xl mb-2">Welche Leistungen stehen Ihnen zu?</p>
          <p className="text-gray-300 text-sm mb-5 max-w-md mx-auto">
            PflegePilot berechnet Ihren Pflegegrad und zeigt alle Budgets auf einen Blick.
            Kostenlos, ohne Registrierung.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/check"
              className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-700 transition-colors text-sm"
            >
              Jetzt Pflegegrad prüfen →
            </Link>
            <Link
              href="/leistungen"
              className="inline-flex items-center justify-center border-2 border-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:border-gray-400 hover:text-white transition-colors text-sm"
            >
              Alle Leistungsbeträge
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
