import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatEuro, formatDate, formatDaysUntil, daysUntil } from '@/lib/utils/format'
import { DISCLAIMER } from '@/lib/utils/constants'
import type { Budget, BenefitType, Transaction } from '@/lib/supabase/types'
import { AddTransactionForm, type AddTransactionState } from './AddTransactionForm'

type BudgetWithBenefitType = Budget & {
  benefit_types: BenefitType
}

type Props = {
  params: Promise<{ slug: string }>
}

// ─── Server Action ─────────────────────────────────────────────────────────────

async function addTransaction(
  _prev: AddTransactionState,
  formData: FormData
): Promise<AddTransactionState> {
  'use server'

  const budgetId = (formData.get('budget_id') as string | null)?.trim() ?? ''
  const amountRaw = (formData.get('amount') as string | null)?.trim() ?? ''
  const description = (formData.get('description') as string | null)?.trim() ?? ''
  const provider = (formData.get('provider') as string | null)?.trim() ?? ''
  const date = (formData.get('date') as string | null)?.trim() ?? ''

  const fields = { amount: amountRaw, date, description, provider }

  if (!budgetId) return { ok: false, error: 'Budget-ID fehlt.', fields }
  if (!amountRaw) return { ok: false, error: 'Bitte einen Betrag eingeben.', fields }
  if (!description) return { ok: false, error: 'Bitte eine Beschreibung eingeben.', fields }
  if (!date) return { ok: false, error: 'Bitte ein Datum auswählen.', fields }

  const normalized = amountRaw.replace(',', '.')
  const amountEuros = parseFloat(normalized)
  if (isNaN(amountEuros) || amountEuros <= 0) {
    return { ok: false, error: 'Betrag ungültig — bitte eine Zahl größer 0 eingeben.', fields }
  }
  const amountCents = Math.round(amountEuros * 100)

  const supabase = await createClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    console.error('addTransaction: not authenticated', userErr)
    return { ok: false, error: 'Sitzung abgelaufen. Bitte neu anmelden.', fields }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as { from: (table: string) => any }

  // Transaktion einfügen
  const { error: txError } = await db.from('transactions').insert({
    budget_id: budgetId,
    amount_cents: amountCents,
    description,
    provider_name: provider || null,
    date,
  })

  if (txError) {
    console.error('addTransaction: insert failed', {
      message: txError.message,
      code: txError.code,
      details: txError.details,
      hint: txError.hint,
      budgetId,
      userId: user.id,
    })
    return {
      ok: false,
      error: txError.message || 'Datenbank-Fehler beim Speichern.',
      fields,
    }
  }

  // used_cents aus Summe aller Transaktionen neu berechnen (atomar, kein Read-Modify-Write)
  const { data: txRows, error: sumErr } = await db
    .from('transactions')
    .select('amount_cents')
    .eq('budget_id', budgetId)

  if (!sumErr && Array.isArray(txRows)) {
    const newTotal = txRows.reduce(
      (sum: number, r: { amount_cents: number }) => sum + (r.amount_cents ?? 0),
      0
    )
    const { error: updErr } = await db
      .from('budgets')
      .update({ used_cents: newTotal })
      .eq('id', budgetId)
    if (updErr) {
      console.error('addTransaction: budget update failed', updErr)
    }
  } else if (sumErr) {
    console.error('addTransaction: could not recompute used_cents', sumErr)
  }

  revalidatePath('/dashboard/[slug]', 'page')
  revalidatePath('/dashboard')

  return { ok: true }
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
        <AddTransactionForm
          budgetId={budget.id}
          todayStr={todayStr}
          action={addTransaction}
        />
      </div>

      {/* ─── Disclaimer ───────────────────────────────────────── */}
      <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
    </div>
  )
}
