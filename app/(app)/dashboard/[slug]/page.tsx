import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatEuro, formatDate, formatDaysUntil, daysUntil } from '@/lib/utils/format'
import { DISCLAIMER } from '@/lib/utils/constants'
import type { Budget, BenefitType, Transaction } from '@/lib/supabase/types'

type BudgetWithBenefitType = Budget & {
  benefit_types: BenefitType
}

type Props = {
  params: Promise<{ slug: string }>
}

// ─── Server Action ─────────────────────────────────────────────────────────────

async function addTransaction(formData: FormData) {
  'use server'

  const budgetId = formData.get('budget_id') as string
  const amountRaw = formData.get('amount') as string
  const description = formData.get('description') as string
  const provider = formData.get('provider') as string
  const date = formData.get('date') as string

  if (!budgetId || !amountRaw || !description || !date) return

  // Betrag aus "123,45" oder "123.45" in Cent umrechnen
  const normalized = amountRaw.replace(',', '.')
  const amountEuros = parseFloat(normalized)
  if (isNaN(amountEuros) || amountEuros <= 0) return
  const amountCents = Math.round(amountEuros * 100)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as { from: (table: string) => any }

  // Transaktion einfügen
  const { error: txError } = await db.from('transactions').insert({
    budget_id: budgetId,
    amount_cents: amountCents,
    description: description.trim(),
    provider_name: provider?.trim() || null,
    receipt_url: null,
    date,
  })

  if (txError) return

  // Budget used_cents aktualisieren
  const { data: budgetData } = await db
    .from('budgets')
    .select('used_cents')
    .eq('id', budgetId)
    .single()

  if (budgetData) {
    await db
      .from('budgets')
      .update({ used_cents: (budgetData.used_cents as number) + amountCents })
      .eq('id', budgetId)
  }

  revalidatePath(`/dashboard/[slug]`, 'page')
}

// ─── Seite ─────────────────────────────────────────────────────────────────────

export default async function BudgetDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Alle Budgets des Users, dann nach Slug filtern
  const { data: allBudgetsRaw } = await supabase
    .from('budgets')
    .select('*, benefit_types(*)')
    .eq('user_id', user.id)
    .eq('year', new Date().getFullYear())

  const allBudgets = (allBudgetsRaw ?? []) as BudgetWithBenefitType[]
  const budget = allBudgets.find((b) => b.benefit_types.slug === slug)

  if (!budget) notFound()

  // Transaktionen laden
  const { data: transactionsRaw } = await supabase
    .from('transactions')
    .select('*')
    .eq('budget_id', budget.id)
    .order('date', { ascending: false })

  const transactions = (transactionsRaw ?? []) as Transaction[]

  // Kennzahlen
  const remainingCents = Math.max(0, budget.total_cents - budget.used_cents)
  const percentUsed =
    budget.total_cents > 0
      ? Math.min(100, (budget.used_cents / budget.total_cents) * 100)
      : 0

  const expiresAt = budget.expires_at ? new Date(budget.expires_at) : null
  const daysLeft = expiresAt ? daysUntil(expiresAt) : null

  // Fortschritts-Variante bestimmen
  let progressVariant: 'success' | 'warning' | 'danger' = 'success'
  if (percentUsed >= 90) progressVariant = 'danger'
  else if (percentUsed >= 70) progressVariant = 'warning'

  const bt = budget.benefit_types

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6 pb-10">
      {/* ─── Back-Link ────────────────────────────────────────── */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 transition-colors min-h-[48px]"
      >
        ← Zurück zum Dashboard
      </Link>

      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl" role="img" aria-label={bt.name}>
            {bt.icon ?? '📋'}
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
              {bt.name}
            </h1>
            <p className="text-xs text-gray-400">{bt.paragraph_sgb}</p>
          </div>
        </div>
        {bt.short_description && (
          <p className="text-sm text-gray-500 mt-2">{bt.short_description}</p>
        )}
        {bt.description && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {bt.description}
          </p>
        )}
      </div>

      {/* ─── Fortschrittsbalken ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <ProgressBar
          value={percentUsed}
          variant={progressVariant}
          size="lg"
          showLabel
        />

        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-success-600">
            {formatEuro(budget.used_cents)}
          </span>{' '}
          von{' '}
          <span className="font-semibold text-gray-800">
            {formatEuro(budget.total_cents)}
          </span>{' '}
          genutzt — noch{' '}
          <span className="font-semibold text-primary-700">
            {formatEuro(remainingCents)}
          </span>{' '}
          verfügbar
        </p>

        {/* Verfall-Info */}
        {expiresAt && daysLeft !== null && (
          <div
            className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${
              daysLeft <= 7
                ? 'bg-danger-50 text-danger-700'
                : daysLeft <= 30
                ? 'bg-warning-50 text-warning-600'
                : 'bg-primary-50 text-primary-700'
            }`}
          >
            <span>{daysLeft <= 7 ? '⚠️' : '⏰'}</span>
            <span>
              Verfällt am{' '}
              <strong>{formatDate(expiresAt)}</strong> —{' '}
              {formatDaysUntil(daysLeft)}
            </span>
          </div>
        )}
      </div>

      {/* ─── Transaktionen ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Buchungen</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-gray-400 text-sm">
              Noch keine Buchungen. Erste Ausgabe eintragen ↓
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="px-5 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {tx.description ?? '—'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(tx.date)}
                    {tx.provider_name ? ` · ${tx.provider_name}` : ''}
                  </p>
                </div>
                <span className="text-sm font-semibold text-danger-600 shrink-0">
                  −{formatEuro(tx.amount_cents)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Ausgabe eintragen ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Ausgabe eintragen</h2>

        <form action={addTransaction} className="space-y-4">
          <input type="hidden" name="budget_id" value={budget.id} />

          <div className="grid grid-cols-2 gap-3">
            {/* Betrag */}
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="amount"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Betrag (€) *
              </label>
              <input
                id="amount"
                name="amount"
                type="text"
                inputMode="decimal"
                placeholder="z.B. 124,50"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
              />
            </div>

            {/* Datum */}
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="date"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Datum *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={todayStr}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
              />
            </div>

            {/* Beschreibung */}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Beschreibung *
              </label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="z.B. Haushaltshilfe Frau Müller"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
              />
            </div>

            {/* Anbieter */}
            <div className="col-span-2">
              <label
                htmlFor="provider"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Anbieter (optional)
              </label>
              <input
                id="provider"
                name="provider"
                type="text"
                placeholder="z.B. Pflegedienst Sonnenschein GmbH"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-700 transition-colors text-sm"
          >
            Ausgabe speichern
          </button>
        </form>
      </div>

      {/* ─── Disclaimer ───────────────────────────────────────── */}
      <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
    </div>
  )
}
