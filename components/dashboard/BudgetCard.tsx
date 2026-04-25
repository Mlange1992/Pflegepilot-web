import Link from 'next/link'
import { formatEuro } from '@/lib/pflegerecht/engine'

export interface BudgetCardProps {
  slug: string
  name: string
  icon: string
  paragraphSgb: string
  totalCents: number
  usedCents: number
  expiresAt: Date | null
  deadlineRule: string | null
  personId?: string | null
}

function getDaysUntilExpiry(expiresAt: Date): number {
  return Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function BudgetCard({
  slug,
  name,
  icon,
  paragraphSgb,
  totalCents,
  usedCents,
  expiresAt,
  deadlineRule,
  personId,
}: BudgetCardProps) {
  const href = personId ? `/dashboard/${slug}?personId=${personId}` : `/dashboard/${slug}`
  const remainingCents = Math.max(0, totalCents - usedCents)
  const percentUsed =
    totalCents > 0 ? Math.min(100, (usedCents / totalCents) * 100) : 0

  const daysUntilExpiry = expiresAt ? getDaysUntilExpiry(expiresAt) : null
  const isExpiringSoon =
    daysUntilExpiry !== null && daysUntilExpiry <= 90 && daysUntilExpiry > 0
  const isCritical =
    daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0

  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={name}>
            {icon}
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {name}
            </p>
            <p className="text-xs text-gray-400">{paragraphSgb}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {deadlineRule !== null && isCritical && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-danger-50 text-danger-700 px-2 py-0.5 rounded-full">
              <span>⚠️</span>
              Verfällt in {daysUntilExpiry}d
            </span>
          )}
          {deadlineRule !== null && isExpiringSoon && !isCritical && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-warning-50 text-warning-600 px-2 py-0.5 rounded-full">
              <span>⏰</span>
              {daysUntilExpiry}d verbleibend
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-success-500 rounded-full transition-all"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Amounts */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          <span className="font-semibold text-success-600">
            {formatEuro(usedCents)}
          </span>{' '}
          genutzt
        </span>
        <span>
          <span className="font-semibold text-gray-700">
            {formatEuro(remainingCents)}
          </span>{' '}
          übrig
        </span>
      </div>

      <div className="text-xs text-gray-400 mt-1 text-right">
        Gesamt: {formatEuro(totalCents)}
      </div>
    </Link>
  )
}
