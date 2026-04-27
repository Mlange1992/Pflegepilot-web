import type { Metadata } from 'next'
import Link from 'next/link'
import leistungen from '@/lib/pflegerecht/leistungen-2026.json'
import { formatEuro } from '@/lib/utils/format'
import type { LeistungConfig } from '@/lib/pflegerecht/engine'

export const metadata: Metadata = {
  title: 'Alle Pflegeleistungen im Überblick',
  description:
    'Übersicht aller gesetzlichen Pflegeleistungen 2026 nach SGB XI — Entlastungsbetrag, Pflegegeld, Verhinderungspflege und mehr.',
}

const PFLEGEGRADE = [2, 3, 4, 5] as const

const TONE_BY_INDEX = [
  'from-primary-50 to-primary-100/30 ring-primary-100',
  'from-success-50 to-success-100/30 ring-success-100',
  'from-warning-50 to-warning-100/30 ring-warning-100',
  'from-purple-50 to-purple-100/30 ring-purple-100',
  'from-danger-50 to-danger-100/30 ring-danger-100',
]

function getYearlyCents(l: LeistungConfig, pg: number): number {
  const perPeriod = l.per_pflegegrad[String(pg)] ?? 0
  if (l.frequency === 'monthly') return perPeriod * 12
  return perPeriod
}

function isActive(l: LeistungConfig): boolean {
  const today = new Date()
  if (l.active_from && new Date(l.active_from) > today) return false
  if (l.active_to && new Date(l.active_to) < today) return false
  return true
}

function gesamtMaxCents(liste: LeistungConfig[]): number {
  const aktive = liste.filter(isActive)

  // Kombinationsleistung § 38 SGB XI: Pflegegeld (§ 37) und Pflegesachleistungen (§ 36)
  // sind Alternativen oder anteilig kombinierbar — nicht beides voll.
  // Daher nur das Maximum beider in die Summe aufnehmen.
  const kombinationsSlugs = ['pflegegeld', 'pflegesachleistungen']
  const kombinationsMaxima = aktive
    .filter((l) => kombinationsSlugs.includes(l.slug))
    .map((l) => Math.max(...PFLEGEGRADE.map((pg) => getYearlyCents(l, pg))))
  const kombinationsMax = kombinationsMaxima.length > 0 ? Math.max(...kombinationsMaxima) : 0

  const sonstigeMax = aktive
    .filter((l) => !kombinationsSlugs.includes(l.slug))
    .reduce(
      (sum, l) => sum + Math.max(...PFLEGEGRADE.map((pg) => getYearlyCents(l, pg))),
      0,
    )

  return kombinationsMax + sonstigeMax
}

export default function LeistungenPage() {
  const liste = (leistungen as LeistungConfig[]).filter(isActive)
  const gesamtMax = gesamtMaxCents(leistungen as LeistungConfig[])

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-primary px-4 pt-16 pb-20 md:pt-20 md:pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-200/30 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="badge bg-white/80 ring-1 ring-primary-200 text-primary-700 backdrop-blur-sm mb-5">
            <span className="text-base">📋</span>
            SGB XI · Stand 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight text-balance">
            Alle Pflegeleistungen{' '}
            <span className="bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent">im Überblick</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-3 text-pretty leading-relaxed">
            Insgesamt können Familien bis zu{' '}
            <span className="font-bold text-primary-700">{formatEuro(gesamtMax)}</span>{' '}
            pro Jahr von der Pflegekasse erhalten.<sup className="text-sm">*</sup>
          </p>
          <p className="text-xs text-gray-400 mb-8 max-w-xl mx-auto">
            * Pflegegeld (§ 37) und Pflegesachleistungen (§ 36) können nicht gleichzeitig
            voll bezogen werden — sie sind Alternativen oder anteilig kombinierbar (§ 38 SGB XI).
          </p>
          <Link href="/check" className="btn-primary">
            Wieviel steht Ihrer Familie zu? → Zum Quick-Check
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {liste.map((l, idx) => {
            const tone = TONE_BY_INDEX[idx % TONE_BY_INDEX.length]
            return (
              <Link
                key={l.slug}
                href={`/leistungen/${l.slug}`}
                className="card card-hover p-6 flex flex-col gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${tone} ring-1 flex items-center justify-center text-3xl shadow-soft`}>
                    {l.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors">
                      {l.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{l.paragraph}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {l.short_description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {l.frequency === 'once' ? 'Betrag je Maßnahme' : 'Jahresbetrag nach Pflegegrad'}
                  </p>
                  <div className="grid grid-cols-4 gap-1">
                    {PFLEGEGRADE.map((pg) => {
                      const cents = getYearlyCents(l, pg)
                      const has = cents > 0
                      return (
                        <div
                          key={pg}
                          className={`text-center rounded-lg py-1.5 ${
                            has ? 'bg-primary-50/50' : 'bg-gray-50'
                          }`}
                        >
                          <p className="text-[10px] text-gray-400 font-semibold">PG {pg}</p>
                          <p className={`text-xs font-bold ${has ? 'text-primary-700' : 'text-gray-300'}`}>
                            {has ? formatEuro(cents) : '—'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <span className="text-xs text-primary-600 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Details ansehen <span>→</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
