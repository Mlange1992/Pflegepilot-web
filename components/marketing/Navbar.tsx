'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '/ratgeber', label: 'Ratgeber' },
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/pflegegrad-info', label: 'Pflegegrad beantragen' },
  { href: '/preise', label: 'Preise' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const supabase = createClient()
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setIsAuthed(!!data.user)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/')

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-gray-200/60 shadow-soft'
          : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-primary-700 text-lg tracking-tight shrink-0 hover:text-primary-800 transition-colors"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow-primary text-base">
              🧭
            </span>
            <span>PflegePilot</span>
          </Link>

          {/* Desktop-Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'text-primary-700'
                      : 'text-gray-600 hover:text-primary-700'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-600" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop-CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthed ? (
              <>
                <Link
                  href="/profil"
                  className="text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
                >
                  Profil
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center font-semibold rounded-xl bg-primary-600 text-white shadow-glow-primary hover:bg-primary-700 hover:shadow-soft-lg transition-all py-2 px-4 text-sm active:scale-[0.97]"
                >
                  Dashboard →
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-sm font-semibold text-gray-600 hover:text-primary-700 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
                >
                  Anmelden
                </Link>
                <Link
                  href="/check"
                  className="inline-flex items-center justify-center font-semibold rounded-xl bg-primary-600 text-white shadow-glow-primary hover:bg-primary-700 hover:shadow-soft-lg transition-all py-2 px-4 text-sm active:scale-[0.97]"
                >
                  Kostenlos prüfen →
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 rounded-xl text-gray-600 hover:text-primary-700 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
          <div className="md:hidden border-t border-gray-100 py-3 animate-fade-in-up">
            <nav className="space-y-0.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl min-h-[48px] transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{link.label}</span>
                    <span className={`text-base ${active ? 'opacity-100' : 'opacity-0'}`}>→</span>
                  </Link>
                )
              })}
            </nav>
            <div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-2 px-1">
              {isAuthed ? (
                <>
                  <Link
                    href="/profil"
                    className="text-center py-3 text-sm font-semibold text-gray-700 border-2 border-gray-200 rounded-xl min-h-[48px] flex items-center justify-center hover:border-primary-300 hover:text-primary-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-center py-3 text-sm font-semibold bg-primary-600 text-white shadow-glow-primary rounded-xl min-h-[48px] flex items-center justify-center hover:bg-primary-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-center py-3 text-sm font-semibold text-gray-700 border-2 border-gray-200 rounded-xl min-h-[48px] flex items-center justify-center hover:border-primary-300 hover:text-primary-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/check"
                    className="text-center py-3 text-sm font-semibold bg-primary-600 text-white shadow-glow-primary rounded-xl min-h-[48px] flex items-center justify-center hover:bg-primary-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Kostenlos prüfen
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
