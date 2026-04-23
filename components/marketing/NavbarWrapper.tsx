'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

// Pfade auf denen die Navbar NICHT angezeigt werden soll
const HIDDEN_PATHS = ['/dashboard', '/auth']

function shouldShowNavbar(pathname: string): boolean {
  return !HIDDEN_PATHS.some((prefix) => pathname.startsWith(prefix))
}

export function NavbarWrapper() {
  const pathname = usePathname()

  if (!shouldShowNavbar(pathname)) return null

  return <Navbar />
}
