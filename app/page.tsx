import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Der digitale Pflege-Finanzmanager
          </p>
          <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
            <span className="text-danger-600">12 Mrd.€</span> Pflegeleistungen
            <br className="hidden md:block" />
            verfallen jedes Jahr
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Weil Familien nicht wissen, was ihnen zusteht. PflegePilot zeigt Ihre Ansprüche,
            warnt vor Fristen und verhindert, dass Ihr Geld verfällt.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/check"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-primary-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700 active:scale-95"
            >
              Kostenlos prüfen — 60 Sekunden →
            </Link>
            <Link
              href="/ratgeber"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-gray-200 px-8 py-3 text-lg font-semibold text-gray-700 transition hover:border-primary-300 hover:text-primary-600"
            >
              Pflege-Ratgeber
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">Kein Login nötig · Kostenlos · 60 Sekunden</p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
          <div>
            <p className="text-4xl font-extrabold text-danger-600">12 Mrd.€</p>
            <p className="mt-1 text-gray-600">verfallen jährlich</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-warning-500">80%</p>
            <p className="mt-1 text-gray-600">nutzen den Entlastungsbetrag nicht</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-warning-500">70%</p>
            <p className="mt-1 text-gray-600">rufen die Verhinderungspflege nicht ab</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Was PflegePilot für Sie tut
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-4 text-4xl">💰</div>
              <h3 className="mb-2 text-xl font-bold">Budget-Dashboard</h3>
              <p className="text-gray-600">
                Alle Pflegeleistungen auf einen Blick — mit Fortschrittsbalken, Verfall-Countdown
                und dem Euro-Betrag, den Sie noch abholen können.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-4 text-4xl">⏰</div>
              <h3 className="mb-2 text-xl font-bold">Fristen-Autopilot</h3>
              <p className="text-gray-600">
                Push und E-Mail 90, 30 und 7 Tage vor Verfall. Damit kein Geld mehr
                unbemerkt verfällt.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-4 text-4xl">📄</div>
              <h3 className="mb-2 text-xl font-bold">Antrags-Helfer</h3>
              <p className="text-gray-600">
                Fertige Antragsvorlagen pro Leistung — vorausgefüllt mit Ihren Daten,
                zum Ausdrucken und Einreichen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* iOS App Promo */}
      <section className="px-4 py-16 bg-gradient-to-br from-gray-900 to-primary-900">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                iOS App — Kostenlos
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                Nie wieder eine Frist verpassen
              </h2>
              <ul className="space-y-3 mb-8">
                {[
                  '🔔 Push-Benachrichtigungen 90, 30 & 7 Tage vor Verfall',
                  '📊 Alle Budgets auf einen Blick — immer dabei',
                  '📄 Anträge direkt als PDF erstellen & einreichen',
                  '🧮 Pflegegrad selbst einschätzen — in 5 Minuten',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-200 text-sm">
                    <span className="shrink-0">{item.split(' ')[0]}</span>
                    <span>{item.slice(item.indexOf(' ') + 1)}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://apps.apple.com/app/pflegepilot"
                className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Im App Store laden
              </a>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div className="bg-white/10 rounded-3xl p-6 text-center border border-white/20">
                <div className="text-6xl mb-3">📱</div>
                <p className="text-white font-bold text-lg">PflegePilot</p>
                <p className="text-gray-300 text-sm">für iPhone</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-1">Kostenlos · Kein Abo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ratgeber Teaser */}
      <section className="bg-gray-50 border-y border-gray-100 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pflege-Ratgeber</h2>
            <p className="text-gray-500">Alles was Sie wissen müssen — verständlich erklärt.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {[
              { icon: '💶', titel: 'Entlastungsbetrag: 131 EUR/Monat die viele verschenken', slug: 'entlastungsbetrag' },
              { icon: '🔄', titel: 'Verhinderungspflege: bis 3.539 EUR/Jahr beantragen', slug: 'verhinderungspflege' },
              { icon: '⚖️', titel: 'Widerspruch gegen Pflegegrad-Bescheid einlegen', slug: 'widerspruch' },
            ].map((a) => (
              <Link
                key={a.slug}
                href={`/ratgeber/${a.slug}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-start gap-3 group"
              >
                <span className="text-2xl shrink-0">{a.icon}</span>
                <p className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-primary-700 transition-colors">
                  {a.titel}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/ratgeber" className="text-primary-600 font-semibold text-sm hover:underline">
              Alle 21 Ratgeber-Artikel ansehen →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-600 px-4 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Wieviel Geld verlieren Sie gerade?
          </h2>
          <p className="mb-8 text-primary-100">
            Beantworten Sie 5 Fragen — wir zeigen Ihnen in 60 Sekunden, wieviel Ihnen zusteht
            und wieviel davon Sie gerade verfallen lassen.
          </p>
          <Link
            href="/check"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white px-8 py-3 text-lg font-bold text-primary-600 shadow transition hover:bg-primary-50 active:scale-95"
          >
            Jetzt kostenlos prüfen →
          </Link>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="border-t border-gray-100 px-4 py-6 text-center text-sm text-gray-400">
        <p>{DISCLAIMER}</p>
        <p className="mt-2">
          <Link href="/ratgeber" className="hover:text-gray-600 underline">
            Ratgeber
          </Link>
          {' · '}
          <Link href="/leistungen" className="hover:text-gray-600 underline">
            Leistungen
          </Link>
          {' · '}
          <Link href="/preise" className="hover:text-gray-600 underline">
            Kostenlos
          </Link>
          {' · '}
          <Link href="/datenschutz" className="hover:text-gray-600 underline">
            Datenschutz
          </Link>
          {' · '}
          <Link href="/impressum" className="hover:text-gray-600 underline">
            Impressum
          </Link>
        </p>
      </footer>
    </main>
  )
}
