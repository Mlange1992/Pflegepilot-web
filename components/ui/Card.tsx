import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'warning' | 'danger' | 'success'
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white border border-gray-100 shadow-sm',
  warning: 'bg-warning-50 border border-warning-200',
  danger: 'bg-danger-50 border border-danger-200',
  success: 'bg-success-50 border border-success-200',
}

export function Card({
  children,
  className = '',
  onClick,
  variant = 'default',
}: CardProps) {
  const clickableClasses = onClick
    ? 'cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]'
    : ''

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick()
            }
          : undefined
      }
      className={`rounded-2xl p-4 ${variantClasses[variant]} ${clickableClasses} ${className}`}
    >
      {children}
    </div>
  )
}
