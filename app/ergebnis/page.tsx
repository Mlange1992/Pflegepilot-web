import Link from 'next/link'
import {
  calculateQuickCheckResult,
  formatEuro,
  type Benefit,
  type Pflegegrad,
  type QuickCheckInput,
} from '@/lib/pflegerecht/engine'
import { DISCLAIMER, VERBRAUCHERZENTRALE_URL } from '@/lib/utils/constants'

// ─── Hilfskomponenten ────────────────────────────────────────────────────────

function HeaderCard({
  pflegegrad,
  totalEntitlementCents,
  currentlyUsedCents,
}: {
  pflegegrad: Pflegegrad
  totalEntitlementCents: number
  currentlyUsedCents: number
}) {
  // Jahres-Anzeige mit "X.XXX €/Jahr" ohne Dezimalstellen wenn sinnvoll
  const totalEuroJahr = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalEntitlementCents / 100)

  return (
    <div className="rounded-3xl bg-primary-600 text-white p-6 mb-4">
      <p className="text-primary-100 text-sm font-medium mb-2">
        Mit Pflegegrad {pflegegrad} stehen Ihrer Familie
      </p>
      <p className="text-5xl font-extrabold tracking-tight mb-1">
        {totalEuroJahr}/Jahr
      </p>
      <p className="text-primary-200 text-sm">
        zu. Sie nutzen aktuell ca.{' '}
        <span className="text-white font-semibold">
          {formatEuro(currentlyUsedCents)}
        </span>
        .
      </p>
    </div>
  )
}

function VerfallBox({ verfallenCents }: { verfallenCents: number }) {
  if (verfallenCents <= 0) return null

  return (
    <div className="rounded-2xl bg-danger-600 text-white p-5 mb-4 flex items-start gap-3">
      <span className="text-2xl shrink-0" role="img" aria-label="Warnung">
        ⚠️
      </span>
      <div>
        <p className="font-bold text-lg">
          Sie lassen {formatEuro(verfallenCents)} verfallen.
        </p>
        <p className="text-danger-100 text-sm mt-1">
          Dieses Geld verfällt, wenn Sie es nicht abrufen.
        </p>
      </div>
    </div>
  )
}

function BenefitCard({
  benefit,
  isGenutzt,
}: {
  benefit: Benefit
  isGenutzt: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={benefit.name}>
            {benefit.icon}
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {benefit.name}
            </p>
            <p className="text-xs text-gray-400">{benefit.paragraph}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {benefit.deadlineRule !== null && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-danger-50 text-danger-700 px-2 py-0.5 rounded-full">
              ⚠️ Verfällt! Frist beachten
            </span>
          )}
          {isGenutzt ? (
            <span className="text-xs font-medium bg-success-50 text-success-600 px-2 py-0.5 rounded-full">
              Aktiv genutzt
            </span>
          ) : (
            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              Ungenutzt
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        {benefit.short_description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Jahresbetrag</span>
        <span className="font-bold text-gray-900">
          {formatEuro(benefit.amountCentsPerYear)}
        </span>
      </div>
    </div>
  )
}

function CtaBox() {
  return (
    <div className="rounded-3xl bg-primary-600 text-white p-6 mb-6">
      <p className="font-bold text-xl mb-2">
        Nie wieder Geld verfallen lassen
      </p>
      <p className="text-primary-100 text-sm mb-5 leading-relaxed">
        Kostenlos registrieren und das Dashboard freischalten — wir erinnern
        Sie 90, 30 und 7 Tage vor dem Verfall.
      </p>
      <Link
        href="/auth?next=/dashboard"
        className="block w-full text-center bg-white text-primary-700 font-semibold py-4 rounded-2xl min-h-[52px] flex items-center justify-center hover:bg-primary-50 transition-colors"
      >
        Jetzt kostenlos registrieren
      </Link>
      <p className="mt-4 text-center text-primary-200 text-xs">
        Noch keinen Pflegegrad?{' '}
        <a
          href={VERBRAUCHERZENTRALE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white"
        >
          Verbraucherzentrale-Rechner nutzen →
        </a>
      </p>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface SearchParams {
  pg?: string
  wohn?: string
  bl?: string
  leistungen?: string
  pflegedienst?: string
}

export default async function ErgebnisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const pgRaw = Number(params.pg)
  const isValidPg = [1, 2, 3, 4, 5].includes(pgRaw)

  if (!isValidPg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Kein gültiger Pflegegrad übergeben.
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold py-3 px-6 rounded-2xl min-h-[48px] hover:bg-primary-700 transition-colors"
          >
            Zurück zum Check
          </Link>
        </div>
      </div>
    )
  }

  const input: QuickCheckInput = {
    pflegegrad: pgRaw as Pflegegrad,
    wohnsituation:
      (params.wohn as QuickCheckInput['wohnsituation']) ?? 'zuhause',
    bundesland: params.bl ?? 'NW',
    genutzteLeistungen: params.leistungen
      ? params.leistungen.split(',').filter(Boolean)
      : [],
    nutztPflegedienst: params.pflegedienst === 'true',
  }

  const result = calculateQuickCheckResult(input)
  const genutzteSet = new Set(input.genutzteLeistungen)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/check" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Zurück
        </Link>
        <span className="font-semibold text-gray-900 text-sm">
          Ihr Ergebnis
        </span>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 1. Header Card */}
        <HeaderCard
          pflegegrad={result.pflegegrad}
          totalEntitlementCents={result.totalEntitlementCents}
          currentlyUsedCents={result.currentlyUsedCents}
        />

        {/* 2. Verfall Box */}
        <VerfallBox verfallenCents={result.verfallenCents} />

        {/* 3. Leistungsliste */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Ihre Leistungen im Überblick
          </h3>
          <div className="space-y-3">
            {result.benefits.map((benefit: Benefit) => (
              <BenefitCard
                key={benefit.slug}
                benefit={benefit}
                isGenutzt={genutzteSet.has(benefit.slug)}
              />
            ))}
          </div>
        </div>

        {/* 4. CTA Box */}
        <CtaBox />

        {/* 5. Disclaimer */}
        <p className="text-xs text-gray-400 text-center pb-6">{DISCLAIMER}</p>
      </main>
    </div>
  )
}
