import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'

const COLUMNS = [
  {
    title: 'Wissen',
    links: [
      { href: '/ratgeber', label: 'Ratgeber' },
      { href: '/leistungen', label: 'Leistungen' },
      { href: '/fristen', label: 'Fristen erklärt' },
      { href: '/pflegegrad-info', label: 'Pflegegrad beantragen' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/check', label: 'Quick-Check' },
      { href: '/pflegegrad-einschaetzen', label: 'Pflegegrad einschätzen' },
      { href: '/checkliste', label: 'MD-Checkliste' },
      { href: '/preise', label: 'Kostenlos' },
    ],
  },
  {
    title: 'Über',
    links: [
      { href: '/datenschutz', label: 'Datenschutz' },
      { href: '/impressum', label: 'Impressum' },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-extrabold text-primary-700 text-lg tracking-tight"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow-primary text-base">
                🧭
              </span>
              <span>PflegePilot</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Der digitale Pflege-Finanzmanager — alle Leistungen, Fristen und Anträge auf einen Blick.
            </p>
          </div>

          {/* Link-Spalten */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            {DISCLAIMER}
          </p>
          <p className="mt-4 text-xs text-gray-400">
            © {new Date().getFullYear()} Markus Lange · PflegePilot
          </p>
        </div>
      </div>
    </footer>
  )
}
