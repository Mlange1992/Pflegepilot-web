import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'
import WaitlistForm from '@/components/WaitlistForm'

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
            Milliarden Euro an Pflegeleistungen
            <br className="hidden md:block" />
            verfallen jedes Jahr
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Schätzungen zufolge über 10 Milliarden Euro — weil Familien nicht wissen, was ihnen
            zusteht. PflegePilot zeigt Ihre Ansprüche, warnt vor Fristen und verhindert, dass
            Ihr Geld verfällt.
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
            <p className="text-4xl font-extrabold text-danger-600">Mrd. €</p>
            <p className="mt-1 text-gray-600">verfallen jährlich (Schätzung)</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-warning-500">Viele</p>
            <p className="mt-1 text-gray-600">nutzen den Entlastungsbetrag nicht</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-warning-500">Viele</p>
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

      {/* iOS App Waitlist */}
      <section className="px-4 py-16 bg-gradient-to-br from-gray-900 to-primary-900">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            iOS App — In Entwicklung
          </span>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Nie wieder eine Frist verpassen
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            Die PflegePilot iOS-App mit Push-Benachrichtigungen, Budgetübersicht und
            Antrags-Helfer ist in Entwicklung. Trag dich ein — wir melden uns, wenn sie live geht.
          </p>
          <div className="flex justify-center">
            <WaitlistForm />
          </div>
          <p className="text-gray-500 text-xs mt-4">Kein Spam · Nur eine E-Mail wenn die App live geht</p>
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
          <Link href="/fristen" className="hover:text-gray-600 underline">
            Fristen
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
