import { NextResponse } from 'next/server'
import { checkDeadlinesAndCreateNotifications } from '@/lib/notifications/deadline-checker'

/**
 * GET /api/cron/check-deadlines
 * Wird täglich um 08:00 Uhr von Vercel Cron aufgerufen.
 * Prüft alle Budgets auf fällige Erinnerungen und erstellt Notifications.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await checkDeadlinesAndCreateNotifications()
    return NextResponse.json({
      ok: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('[cron/check-deadlines] Fehler:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
