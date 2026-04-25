'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

// Pfade auf denen der Footer NICHT angezeigt werden soll (App, Wizards, Auth)
const HIDDEN_PATHS = [
  '/dashboard',
  '/auth',
  '/check',
  '/pflegegrad-einschaetzen',
  '/ergebnis',
  '/nba-ergebnis',
  '/antrag',
  '/checkliste',
  '/profil',
]

export function FooterWrapper() {
  const pathname = usePathname()

  if (HIDDEN_PATHS.some((prefix) => pathname?.startsWith(prefix))) return null

  return <Footer />
}
