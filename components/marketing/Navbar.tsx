'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-extrabold text-primary-600 text-lg tracking-tight shrink-0"
          >
            🧭 PflegePilot
          </Link>

          {/* Desktop-Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/ratgeber"
              className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors"
            >
              Ratgeber
            </Link>
            <Link
              href="/leistungen"
              className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors"
            >
              Leistungen
            </Link>
            <Link
              href="/pflegegrad-info"
              className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors"
            >
              Pflegegrad beantragen
            </Link>
            <Link
              href="/preise"
              className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors"
            >
              Kostenlos
            </Link>
          </nav>

          {/* Desktop-CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors px-4 py-2 min-h-[40px] inline-flex items-center"
            >
              Anmelden
            </Link>
            <Link
              href="/check"
              className="inline-flex items-center justify-center font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 py-2 px-4 text-sm min-h-[36px]"
            >
              Kostenlos prüfen
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 min-h-[48px] min-w-[48px] flex items-center justify-center"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile-Menü */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <Link
              href="/ratgeber"
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg min-h-[48px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              Ratgeber
            </Link>
            <Link
              href="/leistungen"
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg min-h-[48px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              Leistungen
            </Link>
            <Link
              href="/pflegegrad-info"
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg min-h-[48px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              Pflegegrad beantragen
            </Link>
            <Link
              href="/preise"
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg min-h-[48px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              Preise
            </Link>
            <div className="pt-3 px-4 space-y-2">
              <Link
                href="/auth"
                className="block w-full text-center py-3 text-sm font-semibold text-gray-700 border-2 border-gray-200 rounded-xl min-h-[48px] flex items-center justify-center hover:border-primary-300 hover:text-primary-700 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Anmelden
              </Link>
              <Link
                href="/check"
                className="block w-full text-center py-3 text-sm font-semibold bg-primary-600 text-white rounded-xl min-h-[48px] flex items-center justify-center hover:bg-primary-700 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Kostenlos prüfen
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
