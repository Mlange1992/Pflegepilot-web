import type { Metadata } from 'next'
import Link from 'next/link'
import { ratgeberArtikel } from '@/lib/ratgeber-data'

export const metadata: Metadata = {
  title: 'Ratgeber Pflege 2026 – Alle Leistungen erklärt | PflegePilot',
  description:
    'Kostenloser Pflege-Ratgeber: Entlastungsbetrag, Verhinderungspflege, Pflegegrad beantragen, Widerspruch einlegen und mehr. Einfach erklärt von PflegePilot.',
}

const TAG_FARBEN: Record<string, string> = {
  entlastungsbetrag: 'bg-success-50 text-success-700 ring-success-100',
  budget: 'bg-primary-50 text-primary-700 ring-primary-100',
  widerspruch: 'bg-danger-50 text-danger-700 ring-danger-100',
  hausnotruf: 'bg-warning-50 text-warning-700 ring-warning-100',
  steuer: 'bg-purple-50 text-purple-700 ring-purple-100',
}

function tagFarbe(tag: string): string {
  return TAG_FARBEN[tag] ?? 'bg-gray-50 text-gray-600 ring-gray-100'
}

const TONE_BY_INDEX = [
  'from-primary-50 to-primary-100/30 ring-primary-100',
  'from-success-50 to-success-100/30 ring-success-100',
  'from-warning-50 to-warning-100/30 ring-warning-100',
  'from-purple-50 to-purple-100/30 ring-purple-100',
  'from-danger-50 to-danger-100/30 ring-danger-100',
]

export default function RatgeberPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-primary px-4 pt-16 pb-20 md:pt-20 md:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-200/30 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="badge bg-white/80 ring-1 ring-primary-200 text-primary-700 backdrop-blur-sm mb-5">
            <span className="text-base">📚</span>
            {ratgeberArtikel.length} Ratgeber-Artikel
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight text-balance">
            Pflege-Ratgeber{' '}
            <span className="bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent">2026</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8 text-pretty leading-relaxed">
            Alle wichtigen Pflegeleistungen verständlich erklärt — von Entlastungsbetrag
            bis Widerspruch. Kostenlos und unabhängig.
          </p>
          <Link href="/check" className="btn-primary">
            Pflegegrad prüfen → Kostenlos & ohne Registrierung
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Artikel-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {ratgeberArtikel.map((artikel, idx) => {
            const tone = TONE_BY_INDEX[idx % TONE_BY_INDEX.length]
            return (
              <Link
                key={artikel.slug}
                href={`/ratgeber/${artikel.slug}`}
                className="card card-hover p-6 flex flex-col gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${tone} ring-1 flex items-center justify-center text-3xl shadow-soft`}>
                    {artikel.icon}
                  </div>
                  <p className="font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors pt-1.5">
                    {artikel.titel}
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed flex-1">
                  {artikel.kurztext}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {artikel.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ring-1 ${tagFarbe(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="text-xs text-primary-600 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Artikel lesen <span>→</span>
                </span>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 px-6 py-12 md:px-12 md:py-16 text-center shadow-soft-xl">
          <div className="pointer-events-none absolute inset-0 bg-mesh-dark" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl" aria-hidden="true" />

          <div className="relative max-w-xl mx-auto">
            <p className="font-extrabold text-2xl md:text-3xl text-white mb-3 tracking-tight">
              Welche Leistungen stehen Ihnen zu?
            </p>
            <p className="text-gray-300 text-base mb-7 leading-relaxed">
              PflegePilot berechnet Ihren Pflegegrad und zeigt alle Budgets auf einen Blick.
              Kostenlos, ohne Registrierung.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/check"
                className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold py-3.5 px-7 rounded-2xl min-h-[52px] hover:bg-primary-500 transition-all shadow-glow-primary text-sm"
              >
                Jetzt Pflegegrad prüfen →
              </Link>
              <Link
                href="/leistungen"
                className="inline-flex items-center justify-center border-2 border-white/20 text-gray-100 font-semibold py-3.5 px-7 rounded-2xl min-h-[52px] hover:border-white/40 hover:bg-white/5 transition-all text-sm"
              >
                Alle Leistungsbeträge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
