import type { Metadata } from 'next'
import Link from 'next/link'
import leistungen from '@/lib/pflegerecht/leistungen-2026.json'
import { formatEuro } from '@/lib/utils/format'
import { DISCLAIMER } from '@/lib/utils/constants'
import type { LeistungConfig } from '@/lib/pflegerecht/engine'

export const metadata: Metadata = {
  title: 'Alle Pflegeleistungen im Überblick',
  description:
    'Übersicht aller gesetzlichen Pflegeleistungen 2026 nach SGB XI — Entlastungsbetrag, Pflegegeld, Verhinderungspflege und mehr.',
}

const PFLEGEGRADE = [2, 3, 4, 5] as const

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
  return liste.filter(isActive).reduce((sum, l) => {
    const max = Math.max(...[2, 3, 4, 5].map((pg) => getYearlyCents(l, pg)))
    return sum + max
  }, 0)
}

export default function LeistungenPage() {
  const liste = (leistungen as LeistungConfig[]).filter(isActive)
  const gesamtMax = gesamtMaxCents(leistungen as LeistungConfig[])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ─── Hero ──────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Alle Pflegeleistungen im Überblick
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Insgesamt können Familien bis zu{' '}
            <span className="font-bold text-primary-700">
              {formatEuro(gesamtMax)}
            </span>{' '}
            pro Jahr von der Pflegekasse erhalten.
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold py-3 px-7 rounded-2xl min-h-[52px] hover:bg-primary-700 transition-colors text-base"
          >
            Wieviel steht Ihrer Familie zu? → Zum Quick-Check
          </Link>
        </div>

        {/* ─── Leistungs-Grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liste.map((l) => (
            <Link
              key={l.slug}
              href={`/leistungen/${l.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 group"
            >
              {/* Icon + Name */}
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0" role="img" aria-label={l.name}>
                  {l.icon}
                </span>
                <div>
                  <p className="font-bold text-gray-900 leading-tight group-hover:text-primary-700 transition-colors">
                    {l.name}
                  </p>
                  <p className="text-xs text-gray-400">{l.paragraph}</p>
                </div>
              </div>

              {/* Kurzbeschreibung */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {l.short_description}
              </p>

              {/* Betrags-Tabelle PG 2–5 */}
              <div className="mt-auto">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {l.frequency === 'once' ? 'Betrag je Maßnahme' : 'Jahresbetrag nach Pflegegrad'}
                </p>
                <div className="grid grid-cols-4 gap-1">
                  {PFLEGEGRADE.map((pg) => {
                    const cents = getYearlyCents(l, pg)
                    return (
                      <div key={pg} className="text-center">
                        <p className="text-xs text-gray-400">PG {pg}</p>
                        <p className="text-xs font-semibold text-gray-700">
                          {cents > 0 ? formatEuro(cents) : '—'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <span className="text-xs text-primary-600 font-semibold mt-1 group-hover:underline">
                Details ansehen →
              </span>
            </Link>
          ))}
        </div>

        {/* ─── Disclaimer ────────────────────────────────────── */}
        <p className="text-xs text-gray-400 text-center mt-10">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
