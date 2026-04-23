'use client'

import { formatEuro } from '@/lib/pflegerecht/engine'

interface FristItem {
  name: string
  icon: string
  remainingCents: number
  expiresAt: Date
  daysUntil: number
}

interface Props {
  budgets: Array<{
    total_cents: number
    used_cents: number
    expires_at: string | null
    benefit_types: { name: string; icon: string | null; deadline_rule: string | null }
  }>
}

function urgencyClass(days: number) {
  if (days <= 7)  return 'bg-red-50 border-red-300 text-red-700'
  if (days <= 30) return 'bg-orange-50 border-orange-300 text-orange-700'
  if (days <= 90) return 'bg-yellow-50 border-yellow-300 text-yellow-700'
  return 'bg-gray-50 border-gray-200 text-gray-600'
}

function urgencyDot(days: number) {
  if (days <= 7)  return 'bg-red-500'
  if (days <= 30) return 'bg-orange-400'
  if (days <= 90) return 'bg-yellow-400'
  return 'bg-gray-300'
}

function urgencyLabel(days: number) {
  if (days <= 0)  return 'Abgelaufen'
  if (days <= 7)  return `${days} Tage!`
  if (days <= 30) return `${days} Tage`
  return `${days} Tage`
}

export function FristenTimeline({ budgets }: Props) {
  const now = new Date()

  const items: FristItem[] = budgets
    .filter(b => b.expires_at != null)
    .map(b => {
      const exp = new Date(b.expires_at!)
      const days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        name: b.benefit_types.name,
        icon: b.benefit_types.icon ?? '💶',
        remainingCents: b.total_cents - b.used_cents,
        expiresAt: exp,
        daysUntil: days,
      }
    })
    .filter(i => i.remainingCents > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  if (items.length === 0) return null

  const df = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <section>
      <h2 className="text-base font-bold text-gray-900 mb-3">⏳ Fristen im Blick</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${urgencyClass(item.daysUntil)}`}
          >
            {/* Dot */}
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${urgencyDot(item.daysUntil)}`} />

            {/* Icon + Name */}
            <span className="text-lg shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <p className="text-xs opacity-70">{formatEuro(item.remainingCents)} verfügbar · Verfällt {df.format(item.expiresAt)}</p>
            </div>

            {/* Countdown */}
            <span className="text-xs font-bold shrink-0 tabular-nums">
              {urgencyLabel(item.daysUntil)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
