import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import leistungen from '@/lib/pflegerecht/leistungen-2026.json'
import { formatEuro } from '@/lib/utils/format'
import { DISCLAIMER } from '@/lib/utils/constants'
import type { LeistungConfig } from '@/lib/pflegerecht/engine'

type Props = {
  params: Promise<{ slug: string }>
}

const ALLE_PFLEGEGRADE = [1, 2, 3, 4, 5] as const

function getYearlyCents(l: LeistungConfig, pg: number): number {
  const perPeriod = l.per_pflegegrad[String(pg)] ?? 0
  if (l.frequency === 'monthly') return perPeriod * 12
  return perPeriod
}

function getMonthlyCents(l: LeistungConfig, pg: number): number {
  return l.per_pflegegrad[String(pg)] ?? 0
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const l = (leistungen as LeistungConfig[]).find((x) => x.slug === slug)
  if (!l) return {}
  return {
    title: l.name,
    description: l.short_description,
  }
}

export async function generateStaticParams() {
  return (leistungen as LeistungConfig[]).map((l) => ({ slug: l.slug }))
}

// ─── Seite ─────────────────────────────────────────────────────────────────────

export default async function LeistungDetailPage({ params }: Props) {
  const { slug } = await params
  const l = (leistungen as LeistungConfig[]).find((x) => x.slug === slug)

  if (!l) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* ─── Breadcrumb ────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/leistungen" className="hover:text-primary-700 transition-colors">
            Leistungen
          </Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{l.name}</span>
        </nav>

        {/* ─── Header ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl" role="img" aria-label={l.name}>
              {l.icon}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {l.name}
              </h1>
              <p className="text-sm text-gray-400">{l.paragraph}</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{l.description}</p>
        </div>

        {/* ─── Betrags-Tabelle ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Leistungsbeträge nach Pflegegrad</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Pflegegrad</th>
                  <th className="text-right px-5 py-3 font-semibold">
                    {l.frequency === 'monthly' ? 'Monatsbetrag' : 'Betrag'}
                  </th>
                  {l.frequency === 'monthly' && (
                    <th className="text-right px-5 py-3 font-semibold">Jahresbetrag</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ALLE_PFLEGEGRADE.map((pg) => {
                  const monthly = getMonthlyCents(l, pg)
                  const yearly = getYearlyCents(l, pg)
                  const hasAmount = monthly > 0 || yearly > 0
                  return (
                    <tr key={pg} className={hasAmount ? '' : 'opacity-40'}>
                      <td className="px-5 py-3 font-medium text-gray-800">
                        Pflegegrad {pg}
                        {pg === 1 && (
                          <span className="ml-2 text-xs text-gray-400">(erhebliche Beeinträchtigung)</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-700">
                        {monthly > 0 ? formatEuro(monthly) : yearly > 0 ? formatEuro(yearly) : '—'}
                      </td>
                      {l.frequency === 'monthly' && (
                        <td className="px-5 py-3 text-right font-semibold text-primary-700">
                          {yearly > 0 ? formatEuro(yearly) : '—'}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Tipp-Box ──────────────────────────────────────── */}
        {l.tip && (
          <div className="bg-warning-50 border border-warning-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-semibold text-warning-600 mb-1">Tipp</p>
                <p className="text-sm text-gray-700 leading-relaxed">{l.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Fristen-Box ───────────────────────────────────── */}
        {l.deadline_rule && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">⏰</span>
              <div>
                <p className="font-semibold text-orange-700 mb-1">Wichtige Frist</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {l.deadline_rule === 'verfaellt_30_juni_folgejahr' ? (
                    <>
                      Nicht genutzte Beträge können bis zum{' '}
                      <strong>30. Juni des Folgejahres</strong> angespart werden.
                      Danach verfallen sie unwiderruflich. Tragen Sie Ihre Ausgaben
                      regelmäßig ein, um den Überblick zu behalten.
                    </>
                  ) : l.deadline_rule === 'jahresende' ? (
                    <>
                      Nicht genutztes Budget verfällt am{' '}
                      <strong>31. Dezember</strong> des laufenden Jahres. Eine
                      Übertragung ins Folgejahr ist nicht möglich.
                    </>
                  ) : (
                    <>
                      Dieses Budget hat eine Verfallsfrist. Bitte nutzen Sie Ihre
                      Leistungen rechtzeitig.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Antrags-Hinweis ────────────────────────────────── */}
        {l.requires_antrag && (
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">📝</span>
              <div>
                <p className="font-semibold text-primary-700 mb-1">Antrag erforderlich</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Diese Leistung muss bei Ihrer Pflegekasse beantragt werden. Wir
                  helfen Ihnen dabei — melden Sie sich an und nutzen Sie unsere
                  Antrags-Vorlagen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Gesetzestext ───────────────────────────────────── */}
        {l.gesetzestext && (
          <details className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 group">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none list-none">
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">⚖️</span>
                <div>
                  <p className="font-semibold text-gray-900">Gesetzestext</p>
                  <p className="text-xs text-gray-400">{l.paragraph}</p>
                </div>
              </div>
              <span className="text-gray-400 transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {l.gesetzestext}
              </pre>
            </div>
          </details>
        )}

        {/* ─── CTA-Box ────────────────────────────────────────── */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 text-center space-y-4 mb-6">
          <p className="font-bold text-lg">Nutzen Sie diese Leistung bereits?</p>
          <p className="text-gray-300 text-sm">
            Tracken Sie Ihre Ausgaben und behalten Sie den Überblick — oder prüfen
            Sie jetzt, welche Leistungen Ihrer Familie insgesamt zustehen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-700 transition-colors text-sm"
            >
              Ja, tracken →
            </Link>
            <Link
              href="/check"
              className="inline-flex items-center justify-center border-2 border-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:border-gray-400 hover:text-white transition-colors text-sm"
            >
              Zum Quick-Check
            </Link>
          </div>
        </div>

        {/* ─── Disclaimer ────────────────────────────────────── */}
        <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
