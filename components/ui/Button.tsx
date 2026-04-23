'use client'

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600',
    secondary:
      'border-2 border-gray-200 text-gray-700 bg-white hover:border-primary-300 hover:text-primary-700 focus:ring-primary-300',
    danger:
      'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-600',
    ghost:
      'text-gray-500 hover:text-gray-700 bg-transparent focus:ring-gray-300',
  }

  const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'py-2 px-4 text-sm min-h-[36px]',
    md: 'py-3 px-6 text-base min-h-[48px]',
    lg: 'py-4 px-8 text-lg min-h-[52px]',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Wird geladen…
        </>
      ) : (
        children
      )}
    </button>
  )
}
