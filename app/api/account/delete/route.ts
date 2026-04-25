import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient as createAnonClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Löscht den Auth-User des Aufrufers vollständig (DSGVO Art. 17).
 *
 * Authentifiziert wird wahlweise via:
 *  - Cookie (Web, Server-Component-Client mit @supabase/ssr)
 *  - Bearer-Token im Authorization-Header (iOS-App)
 *
 * Da `profiles.id REFERENCES auth.users(id) ON DELETE CASCADE` und alle
 * weiteren Tabellen via FK kaskadieren, reicht das Löschen des Auth-Users —
 * alles Übrige geht automatisch.
 */
export async function POST(request: Request) {
  // 1) User identifizieren — entweder Cookie oder Bearer-Token
  let userId: string | null = null

  const authHeader = request.headers.get('authorization')
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim()
    const anon = createAnonClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await anon.auth.getUser(token)
    if (!error && data.user) userId = data.user.id
  } else {
    const supabase = await createServerClient()
    const { data, error } = await supabase.auth.getUser()
    if (!error && data.user) userId = data.user.id
  }

  if (!userId) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  // 2) Service-Role-Client für Admin-Operationen
  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminAny = admin as any

  // 3) Sicherheitsnetz: abhängige Daten explizit löschen, falls Cascade fehlt
  await adminAny.from('notifications').delete().eq('user_id', userId)
  await adminAny.from('antraege').delete().eq('user_id', userId)
  await adminAny.from('pflegebeduerftiger').delete().eq('user_id', userId)

  const { data: ownBudgets } = await adminAny
    .from('budgets')
    .select('id')
    .eq('user_id', userId)
  const budgetIds = (ownBudgets ?? []).map((b: { id: string }) => b.id)
  if (budgetIds.length) {
    await adminAny.from('transactions').delete().in('budget_id', budgetIds)
  }
  await adminAny.from('budgets').delete().eq('user_id', userId)
  await adminAny.from('profiles').delete().eq('id', userId)

  // 4) Auth-User selbst löschen — der eigentlich kritische Schritt
  const { error: delErr } = await admin.auth.admin.deleteUser(userId)

  if (delErr) {
    console.error('POST /api/account/delete: auth.admin.deleteUser failed', {
      message: delErr.message,
      status: delErr.status,
      userId,
    })
    return NextResponse.json(
      { error: delErr.message || 'Account konnte nicht gelöscht werden.' },
      { status: 500 }
    )
  }

  // 5) Cookie-Session invalidieren (nur Web; iOS ignoriert)
  if (!authHeader) {
    const supabase = await createServerClient()
    await supabase.auth.signOut()
  }

  return NextResponse.json({ ok: true })
}
