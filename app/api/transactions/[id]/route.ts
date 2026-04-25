import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteCtx = { params: Promise<{ id: string }> }

async function getAuthedClientAndUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return { error: 'Nicht angemeldet.', status: 401 as const }
  return { supabase, user }
}

async function recomputeUsedCents(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  budgetId: string
) {
  const { data: txRows, error } = await db
    .from('transactions')
    .select('amount_cents')
    .eq('budget_id', budgetId)
  if (error || !Array.isArray(txRows)) {
    console.error('recomputeUsedCents: select failed', error)
    return
  }
  const newTotal = txRows.reduce(
    (sum: number, r: { amount_cents: number }) => sum + (r.amount_cents ?? 0),
    0
  )
  const { error: updErr } = await db
    .from('budgets')
    .update({ used_cents: newTotal })
    .eq('id', budgetId)
  if (updErr) console.error('recomputeUsedCents: update failed', updErr)
}

// ─── PATCH (Buchung bearbeiten) ───────────────────────────────────────────────

export async function PATCH(request: Request, ctx: RouteCtx) {
  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 })

  let body: {
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

  const auth = await getAuthedClientAndUser()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { supabase } = auth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as { from: (table: string) => any }

  // Bestehende Buchung holen, um Budget-ID für Recompute zu kennen
  const { data: existing, error: loadErr } = await db
    .from('transactions')
    .select('id, budget_id')
    .eq('id', id)
    .single()

  if (loadErr || !existing) {
    return NextResponse.json({ error: 'Buchung nicht gefunden.' }, { status: 404 })
  }

  // Patch-Felder validieren
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {}

  if (body.amount_euros !== undefined) {
    const amountEuros = parseFloat(body.amount_euros.replace(',', '.'))
    if (isNaN(amountEuros) || amountEuros <= 0) {
      return NextResponse.json(
        { error: 'Betrag ungültig — bitte eine Zahl größer 0 eingeben.' },
        { status: 400 }
      )
    }
    patch.amount_cents = Math.round(amountEuros * 100)
  }
  if (body.description !== undefined) {
    const desc = body.description.trim()
    if (!desc) {
      return NextResponse.json({ error: 'Beschreibung darf nicht leer sein.' }, { status: 400 })
    }
    patch.description = desc
  }
  if (body.provider !== undefined) {
    const prov = (body.provider ?? '').toString().trim()
    patch.provider_name = prov || null
  }
  if (body.date !== undefined) {
    const d = body.date.trim()
    if (!d) {
      return NextResponse.json({ error: 'Datum darf nicht leer sein.' }, { status: 400 })
    }
    patch.date = d
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Keine Änderungen übermittelt.' }, { status: 400 })
  }

  const { error: updErr } = await db.from('transactions').update(patch).eq('id', id)
  if (updErr) {
    console.error('PATCH /api/transactions/[id] failed', updErr)
    return NextResponse.json(
      { error: updErr.message || 'Fehler beim Aktualisieren.' },
      { status: 500 }
    )
  }

  await recomputeUsedCents(db, existing.budget_id as string)

  return NextResponse.json({ ok: true })
}

// ─── DELETE (Buchung löschen) ─────────────────────────────────────────────────

export async function DELETE(_request: Request, ctx: RouteCtx) {
  const { id } = await ctx.params
  if (!id) return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 })

  const auth = await getAuthedClientAndUser()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { supabase } = auth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as { from: (table: string) => any }

  // Budget-ID merken für Recompute
  const { data: existing, error: loadErr } = await db
    .from('transactions')
    .select('id, budget_id')
    .eq('id', id)
    .single()

  if (loadErr || !existing) {
    return NextResponse.json({ error: 'Buchung nicht gefunden.' }, { status: 404 })
  }

  const { error: delErr } = await db.from('transactions').delete().eq('id', id)
  if (delErr) {
    console.error('DELETE /api/transactions/[id] failed', delErr)
    return NextResponse.json(
      { error: delErr.message || 'Fehler beim Löschen.' },
      { status: 500 }
    )
  }

  await recomputeUsedCents(db, existing.budget_id as string)

  return NextResponse.json({ ok: true })
}
