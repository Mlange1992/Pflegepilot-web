import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">{DISCLAIMER}</p>
          <nav className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/ratgeber" className="hover:text-primary-600 transition-colors">Ratgeber</Link>
            <Link href="/leistungen" className="hover:text-primary-600 transition-colors">Leistungen</Link>
            <Link href="/preise" className="hover:text-primary-600 transition-colors">Kostenlos</Link>
            <Link href="/datenschutz" className="hover:text-primary-600 transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-primary-600 transition-colors">Impressum</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
