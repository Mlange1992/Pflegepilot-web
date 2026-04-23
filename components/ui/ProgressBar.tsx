export interface ProgressBarProps {
  value: number // 0-100 (Prozent)
  variant?: 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
}

const fillClasses: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-600',
}

const heightClasses: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function ProgressBar({
  value,
  variant = 'success',
  size = 'md',
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-xs text-gray-500">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-gray-700 ml-auto">
              {Math.round(clamped)} %
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-gray-100 rounded-full overflow-hidden ${heightClasses[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${fillClasses[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
