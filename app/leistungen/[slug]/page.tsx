import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import leistungen from '@/lib/pflegerecht/leistungen-2026.json'
import { formatEuro } from '@/lib/utils/format'
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
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/leistungen" className="hover:text-primary-700 transition-colors">
            Leistungen
          </Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{l.name}</span>
        </nav>

        {/* Header */}
        <div className="card p-7 md:p-8 mb-6">
          <div className="flex items-center gap-5 mb-4">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/40 ring-1 ring-primary-100 flex items-center justify-center text-4xl shadow-soft">
              {l.icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {l.name}
              </h1>
              <p className="text-sm text-primary-700 font-semibold mt-1">{l.paragraph}</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{l.description}</p>
        </div>

        {/* Betrags-Tabelle */}
        <div className="card overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900 tracking-tight">Leistungsbeträge nach Pflegegrad</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-[0.1em]">
                  <th className="text-left px-6 py-3 font-bold">Pflegegrad</th>
                  <th className="text-right px-6 py-3 font-bold">
                    {l.frequency === 'monthly' ? 'Monatsbetrag' : 'Betrag'}
                  </th>
                  {l.frequency === 'monthly' && (
                    <th className="text-right px-6 py-3 font-bold">Jahresbetrag</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ALLE_PFLEGEGRADE.map((pg) => {
                  const monthly = getMonthlyCents(l, pg)
                  const yearly = getYearlyCents(l, pg)
                  const hasAmount = monthly > 0 || yearly > 0
                  return (
                    <tr key={pg} className={hasAmount ? 'hover:bg-primary-50/30 transition-colors' : 'opacity-40'}>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        Pflegegrad {pg}
                        {pg === 1 && (
                          <span className="ml-2 text-xs text-gray-400">(erhebliche Beeinträchtigung)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-700">
                        {monthly > 0 ? formatEuro(monthly) : yearly > 0 ? formatEuro(yearly) : '—'}
                      </td>
                      {l.frequency === 'monthly' && (
                        <td className="px-6 py-4 text-right font-bold text-primary-700">
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

        {/* Tipp-Box */}
        {l.tip && (
          <div className="bg-gradient-to-br from-warning-50 to-warning-100/30 ring-1 ring-warning-100 rounded-2xl p-6 mb-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white ring-1 ring-warning-200 flex items-center justify-center text-2xl shadow-soft">💡</div>
              <div>
                <p className="font-bold text-warning-700 mb-1.5">Tipp</p>
                <p className="text-[15px] text-gray-700 leading-relaxed">{l.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Warn-Box */}
        {l.warning && (
          <div className="bg-gradient-to-br from-danger-50 to-danger-100/30 ring-1 ring-danger-100 rounded-2xl p-6 mb-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white ring-1 ring-danger-200 flex items-center justify-center text-2xl shadow-soft">⚠️</div>
              <div>
                <p className="font-bold text-danger-700 mb-1.5">Wichtiger Hinweis</p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  {l.warning.replace(/^⚠️\s*/, '')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fristen-Box */}
        {l.deadline_rule && (
          <div className="bg-gradient-to-br from-warning-50 to-amber-50 ring-1 ring-amber-100 rounded-2xl p-6 mb-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white ring-1 ring-amber-200 flex items-center justify-center text-2xl shadow-soft">⏰</div>
              <div>
                <p className="font-bold text-warning-700 mb-1.5">Wichtige Frist</p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
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

        {/* Antrags-Hinweis */}
        {l.requires_antrag && (
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/30 ring-1 ring-primary-100 rounded-2xl p-6 mb-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white ring-1 ring-primary-200 flex items-center justify-center text-2xl shadow-soft">📝</div>
              <div>
                <p className="font-bold text-primary-700 mb-1.5">Antrag erforderlich</p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  Diese Leistung muss bei Ihrer Pflegekasse beantragt werden. Wir
                  helfen Ihnen dabei — melden Sie sich an und nutzen Sie unsere
                  Antrags-Vorlagen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gesetzestext */}
        {l.gesetzestext && (
          <details className="card mb-6 group">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none list-none">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">⚖️</div>
                <div>
                  <p className="font-bold text-gray-900">Gesetzestext</p>
                  <p className="text-xs text-gray-400">{l.paragraph}</p>
                </div>
              </div>
              <span className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 transition-transform group-open:rotate-180 group-open:bg-primary-100 group-open:text-primary-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-6 pb-6 border-t border-gray-100 pt-5">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {l.gesetzestext}
              </pre>
            </div>
          </details>
        )}

        {/* CTA-Box */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 px-6 py-10 md:px-10 md:py-12 text-center shadow-soft-xl">
          <div className="pointer-events-none absolute inset-0 bg-mesh-dark" aria-hidden="true" />
          <div className="relative">
            <p className="font-extrabold text-2xl text-white mb-2 tracking-tight">Nutzen Sie diese Leistung bereits?</p>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md mx-auto">
              Tracken Sie Ihre Ausgaben und behalten Sie den Überblick — oder prüfen
              Sie jetzt, welche Leistungen Ihrer Familie insgesamt zustehen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold py-3.5 px-7 rounded-2xl min-h-[52px] hover:bg-primary-500 transition-colors shadow-glow-primary text-sm"
              >
                Ja, tracken →
              </Link>
              <Link
                href="/check"
                className="inline-flex items-center justify-center border-2 border-white/20 text-gray-100 font-semibold py-3.5 px-7 rounded-2xl min-h-[52px] hover:border-white/40 hover:bg-white/5 transition-all text-sm"
              >
                Zum Quick-Check
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
