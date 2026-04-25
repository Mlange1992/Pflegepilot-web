import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: {
    budget_id?: string
    amount_euros?: string
    description?: string
    provider?: string | null
    date?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const budgetId = (body.budget_id ?? '').trim()
  const amountRaw = (body.amount_euros ?? '').trim()
  const description = (body.description ?? '').trim()
  const provider = (body.provider ?? '')?.toString().trim() ?? ''
  const date = (body.date ?? '').trim()

  if (!budgetId) return NextResponse.json({ error: 'Budget-ID fehlt.' }, { status: 400 })
  if (!amountRaw) return NextResponse.json({ error: 'Bitte einen Betrag eingeben.' }, { status: 400 })
  if (!description) return NextResponse.json({ error: 'Bitte eine Beschreibung eingeben.' }, { status: 400 })
  if (!date) return NextResponse.json({ error: 'Bitte ein Datum auswählen.' }, { status: 400 })

  const amountEuros = parseFloat(amountRaw.replace(',', '.'))
  if (isNaN(amountEuros) || amountEuros <= 0) {
    return NextResponse.json({ error: 'Betrag ungültig — bitte eine Zahl größer 0 eingeben.' }, { status: 400 })
  }
  const amountCents = Math.round(amountEuros * 100)

  const supabase = await createClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    return NextResponse.json({ error: 'Sitzung abgelaufen. Bitte neu anmelden.' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as { from: (table: string) => any }

  const { error: txError } = await db.from('transactions').insert({
    budget_id: budgetId,
    amount_cents: amountCents,
    description,
    provider_name: provider || null,
    date,
  })

  if (txError) {
    console.error('POST /api/transactions: insert failed', {
      message: txError.message,
      code: txError.code,
      details: txError.details,
      hint: txError.hint,
      budgetId,
      userId: user.id,
    })
    return NextResponse.json(
      { error: txError.message || 'Datenbank-Fehler beim Speichern.' },
      { status: 500 }
    )
  }

  // used_cents aus Summe aller Transaktionen neu berechnen (atomar, identisch zu iOS)
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
      console.error('POST /api/transactions: budget update failed', updErr)
    }
  } else if (sumErr) {
    console.error('POST /api/transactions: could not recompute used_cents', sumErr)
  }

  return NextResponse.json({ ok: true })
}
