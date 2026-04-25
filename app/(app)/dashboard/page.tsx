import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BudgetCard } from '@/components/dashboard/BudgetCard'
import { FristenTimeline } from '@/components/dashboard/FristenTimeline'
import {
  formatEuro,
  getOptimizationTips,
  type Pflegegrad,
  type OptimizationTip,
} from '@/lib/pflegerecht/engine'
import { DISCLAIMER } from '@/lib/utils/constants'
import type { Profile, Budget, BenefitType } from '@/lib/supabase/types'

// ─── Typen ───────────────────────────────────────────────────────────────────

type BudgetWithBenefitType = Budget & {
  benefit_types: BenefitType
}

type Person = {
  id: string
  name: string
  pflegegrad: number | null
}

// ─── Hilfskomponenten ────────────────────────────────────────────────────────

function VerfallBanner({
  amountCents,
  daysUntilExpiry,
}: {
  amountCents: number
  daysUntilExpiry: number
}) {
  return (
    <div className="rounded-2xl bg-red-600 text-white px-5 py-4 flex items-center gap-3 mb-4">
      <span className="text-2xl shrink-0">⚠️</span>
      <p className="font-semibold text-sm">
        {formatEuro(amountCents)} verfallen in{' '}
        <span className="font-bold">{daysUntilExpiry} Tagen!</span>
      </p>
    </div>
  )
}

function OnboardingCard() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="text-5xl">📋</div>
      <h2 className="text-xl font-bold text-gray-900">
        Profil noch nicht eingerichtet
      </h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto">
        Bitte geben Sie Ihren Pflegegrad an, damit wir Ihre Budgets berechnen
        können.
      </p>
      <Link
        href="/dashboard/setup"
        className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold py-3 px-6 rounded-2xl min-h-[48px] hover:bg-primary-700 transition-colors"
      >
        Jetzt einrichten
      </Link>
    </div>
  )
}

function EmptyBudgetCard({ name, icon }: { name: string; icon: string }) {
  return (
    <Link
      href="/dashboard/setup"
      className="block rounded-2xl border-2 border-dashed border-gray-200 p-4 hover:border-primary-300 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="font-semibold text-gray-500 text-sm">{name}</p>
      </div>
      <p className="text-xs text-gray-400">Noch nicht eingerichtet</p>
      <p className="text-xs text-primary-600 font-medium mt-1">
        Jetzt einrichten →
      </p>
    </Link>
  )
}

function OptimierungsTippCard({ tip }: { tip: OptimizationTip }) {
  const colorMap: Record<OptimizationTip['type'], string> = {
    umwandlung: 'bg-primary-50 border-primary-200',
    hilfsmittel: 'bg-green-50 border-green-200',
    entlastung: 'bg-yellow-50 border-yellow-200',
    verhinderung: 'bg-yellow-50 border-yellow-200',
    info: 'bg-gray-50 border-gray-200',
  }

  const textColorMap: Record<OptimizationTip['type'], string> = {
    umwandlung: 'text-primary-700',
    hilfsmittel: 'text-green-600',
    entlastung: 'text-yellow-600',
    verhinderung: 'text-yellow-600',
    info: 'text-gray-600',
  }

  return (
    <div className={`rounded-2xl border p-4 ${colorMap[tip.type]}`}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <p className={`font-semibold text-sm ${textColorMap[tip.type]}`}>
          {tip.title}
        </p>
        <span className={`text-xs font-bold shrink-0 ${textColorMap[tip.type]}`}>
          +{formatEuro(tip.potentialGainCents)}
        </span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed mb-3">
        {tip.description}
      </p>
      {tip.actionSlug && (
        <Link
          href={`/dashboard/${tip.actionSlug}`}
          className={`text-xs font-semibold underline underline-offset-2 ${textColorMap[tip.type]}`}
        >
          {tip.actionLabel} →
        </Link>
      )}
    </div>
  )
}

// ─── Hauptseite ───────────────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ personId?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  // Profil laden
  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileRaw as Profile | null

  // Personen laden (pflegebeduerftiger)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data: personsRaw } = await db
    .from('pflegebeduerftiger')
    .select('id, name, pflegegrad')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const persons: Person[] = personsRaw ?? []

  // Aktive Person bestimmen
  const { personId: personIdParam } = await searchParams
  const activePerson: Person | null =
    persons.find((p: Person) => p.id === personIdParam) ?? persons[0] ?? null

  // Kein Profil → Onboarding
  if (!profile || profile.pflegegrad === null) {
    return <OnboardingCard />
  }

  // Budgets laden — nach person_id wenn Person vorhanden, sonst nach user_id
  let budgetsQuery = supabase
    .from('budgets')
    .select('*, benefit_types(*)')
    .eq('user_id', user.id)
    .eq('year', new Date().getFullYear())
    .order('created_at', { ascending: true })

  if (activePerson) {
    budgetsQuery = db
      .from('budgets')
      .select('*, benefit_types(*)')
      .eq('user_id', user.id)
      .eq('person_id', activePerson.id)
      .eq('year', new Date().getFullYear())
      .order('created_at', { ascending: true })
  }

  const { data: budgetsRaw } = await budgetsQuery
  const budgets = (budgetsRaw ?? []) as BudgetWithBenefitType[]

  // Kennzahlen
  const jahresanspruchCents = budgets.reduce((s, b) => s + b.total_cents, 0)
  const nochVerfuegbarCents = budgets.reduce(
    (s, b) => s + Math.max(0, b.total_cents - b.used_cents),
    0
  )

  // Nächstes Verfall-Event in 30 Tagen
  const now = Date.now()
  const dreissigTage = 30 * 24 * 60 * 60 * 1000
  const verfallendesBudget = budgets
    .filter((b) => {
      if (!b.expires_at) return false
      const expiresAt = new Date(b.expires_at).getTime()
      const msLeft = expiresAt - now
      return msLeft > 0 && msLeft <= dreissigTage && b.total_cents - b.used_cents > 0
    })
    .sort((a, b) => new Date(a.expires_at!).getTime() - new Date(b.expires_at!).getTime())[0]

  const daysUntilVerfall = verfallendesBudget
    ? Math.ceil((new Date(verfallendesBudget.expires_at!).getTime() - now) / (1000 * 60 * 60 * 24))
    : null

  // Optimierungstipps
  const tipBudgets = budgets.map((b) => ({
    slug: b.benefit_types.slug,
    totalCents: b.total_cents,
    usedCents: b.used_cents,
    remainingCents: Math.max(0, b.total_cents - b.used_cents),
  }))

  const optimierungsTipps = getOptimizationTips(
    {
      pflegegrad: profile.pflegegrad as Pflegegrad,
      nutzt_pflegedienst: profile.nutzt_pflegedienst,
    },
    tipBudgets
  )

  const angezeigterPflegegrad = activePerson?.pflegegrad ?? profile.pflegegrad

  return (
    <div className="space-y-6 pb-8">

      {/* ─── Personen-Tabs ──────────────────────────────────────── */}
      {persons.length > 0 && (
        <div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {persons.map((p: Person) => (
              <Link
                key={p.id}
                href={`/dashboard?personId=${p.id}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  activePerson?.id === p.id
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
                }`}
              >
                {p.name}
                {p.pflegegrad ? ` (PG ${p.pflegegrad})` : ''}
              </Link>
            ))}
            <Link
              href="/dashboard/setup"
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border border-dashed border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              + Person
            </Link>
          </div>
        </div>
      )}

      {/* ─── Verfall-Banner ─────────────────────────────────────── */}
      {daysUntilVerfall !== null && verfallendesBudget && (
        <VerfallBanner
          amountCents={verfallendesBudget.total_cents - verfallendesBudget.used_cents}
          daysUntilExpiry={daysUntilVerfall}
        />
      )}

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'rgba(8,145,178,0.08)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {activePerson ? activePerson.name : 'Ihre Person'}
              </p>
              <p className="font-bold text-gray-900">
                Pflegegrad {angezeigterPflegegrad}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Jahresanspruch</p>
              <p className="text-xl font-bold text-green-600">
                {formatEuro(jahresanspruchCents)}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-primary-100 flex justify-between text-sm">
            <span className="text-gray-500">Noch verfügbar</span>
            <span className="font-semibold text-gray-800">
              {formatEuro(nochVerfuegbarCents)}
            </span>
          </div>
        </div>

        {/* Fristen-Timeline */}
        {budgets.length > 0 && (
          <FristenTimeline budgets={budgets} />
        )}
      </div>

      {/* ─── Budget-Cards ────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Budgets {new Date().getFullYear()}
        </h2>

        {budgets.length === 0 ? (
          <div className="space-y-3">
            {[
              { name: 'Pflegegeld', icon: '💶' },
              { name: 'Entlastungsbetrag', icon: '🤝' },
              { name: 'Pflegesachleistungen', icon: '👩‍⚕️' },
              { name: 'Verhinderungspflege', icon: '🔄' },
              { name: 'Pflegehilfsmittel', icon: '🧤' },
            ].map((item) => (
              <EmptyBudgetCard key={item.name} name={item.name} icon={item.icon} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {budgets.map((b) => (
              <BudgetCard
                key={b.id}
                slug={b.benefit_types.slug}
                name={b.benefit_types.name}
                icon={b.benefit_types.icon ?? '📋'}
                paragraphSgb={b.benefit_types.paragraph_sgb ?? ''}
                totalCents={b.total_cents}
                usedCents={b.used_cents}
                expiresAt={b.expires_at ? new Date(b.expires_at) : null}
                deadlineRule={b.benefit_types.deadline_rule}
                personId={activePerson?.id ?? null}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Optimierungstipps ───────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Optimierungstipps
        </h2>
        <div className="space-y-3">
          {optimierungsTipps.slice(0, 3).map((tip, i) => (
            <OptimierungsTippCard key={i} tip={tip} />
          ))}
          {optimierungsTipps.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Keine Optimierungstipps — Sie nutzen Ihre Leistungen optimal.
            </p>
          )}
        </div>
      </div>

      {/* ─── Disclaimer ──────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
    </div>
  )
}
