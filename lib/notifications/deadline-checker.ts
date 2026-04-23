import { formatEuro } from '@/lib/pflegerecht/engine'
import { createServiceClient } from '@/lib/supabase/service'
import type { Database, Notification } from '@/lib/supabase/types'

// ─── Typen ────────────────────────────────────────────────────────────────────

type NotificationType = Notification['type']

interface BudgetMitLeistung {
  id: string
  user_id: string
  total_cents: number
  used_cents: number
  expires_at: string
  benefit_types: {
    name: string
    icon: string | null
  } | null
}

interface ReminderConfig {
  type: NotificationType
  days: number
  buildTitle: (betragFormatiert: string) => string
  buildBody: (betragFormatiert: string, datumFormatiert: string, name: string) => string
}

// ─── Erinnerungs-Konfiguration ────────────────────────────────────────────────

const REMINDER_CONFIGS: ReminderConfig[] = [
  {
    type: 'reminder_90d',
    days: 90,
    buildTitle: (betrag) => `\u23F0 Erinnerung: ${betrag} laufen bald ab`,
    buildBody: (betrag, datum, name) =>
      `Ihr ${name}-Budget von ${betrag} verfällt in 90 Tagen am ${datum}. Jetzt nutzen!`,
  },
  {
    type: 'reminder_30d',
    days: 30,
    buildTitle: (betrag) => `\u26A0\uFE0F Noch 30 Tage: ${betrag} nicht vergessen!`,
    buildBody: (betrag, datum, name) =>
      `Ihr ${name}-Budget von ${betrag} verfällt in 30 Tagen am ${datum}. Nicht verschenken!`,
  },
  {
    type: 'reminder_7d',
    days: 7,
    buildTitle: (betrag) => `\uD83D\uDEA8 Letzte Chance: ${betrag} verfallen in 7 Tagen!`,
    buildBody: (betrag, datum, name) =>
      `Dringende Erinnerung: Ihr ${name}-Budget von ${betrag} verfällt am ${datum}. Handeln Sie jetzt!`,
  },
]

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

function formatDatum(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function berechneTagesBis(expiresAt: Date): number {
  const jetzt = Date.now()
  const msUntilExpiry = expiresAt.getTime() - jetzt
  return Math.ceil(msUntilExpiry / (1000 * 60 * 60 * 24))
}

// ─── Haupt-Funktion ───────────────────────────────────────────────────────────

/**
 * Liest alle aktiven Budgets mit Verfallsdatum, prüft welche Erinnerungen
 * noch nicht gesendet wurden und erstellt fehlende Notifications in der DB.
 */
export async function checkDeadlinesAndCreateNotifications(): Promise<{
  created: number
  skipped: number
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any

  // Alle Budgets mit Verfallsdatum laden
  const { data: budgetsRaw, error: budgetsError } = await supabase
    .from('budgets')
    .select('id, user_id, total_cents, used_cents, expires_at, benefit_types(name, icon)')
    .not('expires_at', 'is', null)

  if (budgetsError) {
    console.error('[deadline-checker] Fehler beim Laden der Budgets:', budgetsError)
    throw budgetsError
  }

  // Nur Budgets mit noch verfügbarem Budget (used_cents < total_cents)
  const aktiveBudgets = ((budgetsRaw ?? []) as unknown as BudgetMitLeistung[]).filter(
    (b) => b.used_cents < b.total_cents
  )

  let created = 0
  let skipped = 0

  const jetzt = new Date()

  for (const budget of aktiveBudgets) {
    const expiresAt = new Date(budget.expires_at)

    // Bereits abgelaufene Budgets überspringen
    if (expiresAt <= jetzt) {
      skipped++
      continue
    }

    const tagesBis = berechneTagesBis(expiresAt)
    const verbleibendrBetragCents = budget.total_cents - budget.used_cents
    const betragFormatiert = formatEuro(verbleibendrBetragCents)
    const datumFormatiert = formatDatum(expiresAt)
    const leistungsname = budget.benefit_types?.name ?? 'Leistungs'

    for (const config of REMINDER_CONFIGS) {
      // Nur fällige Erinnerungen (Tage bis Verfall <= Schwellenwert)
      if (tagesBis > config.days) continue

      // Prüfen ob diese Notification bereits existiert
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', budget.user_id)
        .eq('budget_id', budget.id)
        .eq('type', config.type)
        .maybeSingle()

      if (existing) {
        skipped++
        continue
      }

      // Neue Notification erstellen
      const title = config.buildTitle(betragFormatiert)
      const body = config.buildBody(betragFormatiert, datumFormatiert, leistungsname)

      const insertPayload: Database['public']['Tables']['notifications']['Insert'] = {
        user_id: budget.user_id,
        budget_id: budget.id,
        type: config.type,
        title,
        body,
        channel: 'in_app',
        sent_at: null,
        read_at: null,
      }

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(insertPayload)

      if (insertError) {
        console.error(
          `[deadline-checker] Fehler beim Erstellen der Notification für Budget ${budget.id}:`,
          insertError
        )
      } else {
        created++
      }
    }
  }

  console.log(`[deadline-checker] Fertig: ${created} erstellt, ${skipped} übersprungen`)
  return { created, skipped }
}
