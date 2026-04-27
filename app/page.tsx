import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { APP_STORE_URL } from '@/lib/constants/app-store'

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-mesh-primary px-4 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        {/* dekorative Blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-primary-300/30 rounded-full blur-3xl animate-blob" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-blob [animation-delay:4s]" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl">
          <span className="badge bg-white/80 ring-1 ring-primary-200 text-primary-700 backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Der digitale Pflege-Finanzmanager
          </span>
          <h1 className="mb-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            Milliarden Euro an Pflegeleistungen{' '}
            <span className="bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent">
              verfallen
            </span>{' '}
            jedes Jahr
          </h1>
          <p className="mb-10 text-lg md:text-xl text-gray-600 text-pretty max-w-2xl mx-auto leading-relaxed">
            Schätzungen zufolge rund 12 Milliarden Euro — weil Familien nicht wissen, was ihnen
            zusteht. PflegePilot zeigt Ihre Ansprüche, warnt vor Fristen und verhindert, dass
            Ihr Geld verfällt.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/check" className="btn-primary text-lg">
              Kostenlos prüfen — 60 Sekunden →
            </Link>
            <Link href="/ratgeber" className="btn-secondary text-lg">
              Pflege-Ratgeber
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-500 flex items-center justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><span className="text-success-500">✓</span> Kein Login nötig</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-success-500">✓</span> Kostenlos</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-success-500">✓</span> 60 Sekunden</span>
          </p>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="relative -mt-12 md:-mt-16 px-4 z-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { value: '12 Mrd. €', label: 'verfallen jährlich', accent: 'text-danger-600', ring: 'ring-danger-100' },
              { value: '80 %', label: 'nutzen den Entlastungsbetrag nicht', accent: 'text-warning-500', ring: 'ring-warning-100' },
              { value: '70 %', label: 'rufen die Verhinderungspflege nicht ab', accent: 'text-warning-500', ring: 'ring-warning-100' },
            ].map((s) => (
              <div
                key={s.label}
                className={`bg-white rounded-2xl ring-1 ${s.ring} shadow-soft-lg p-6 text-center`}
              >
                <p className={`text-4xl md:text-5xl font-extrabold tracking-tight ${s.accent}`}>
                  {s.value}
                  <span className="text-base align-top text-gray-400">*</span>
                </p>
                <p className="mt-2 text-sm text-gray-600 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center max-w-2xl mx-auto leading-relaxed">
            <span className="text-gray-400">*</span> Geschätzte Zahlen auf Basis der{' '}
            <a
              href="https://www.vdk.de/themen/pflege/vdk-pflegestudie/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              VdK-Pflegestudie 2022
            </a>{' '}
            (56.000 Befragte). Tatsächliche Werte können je nach Region und Pflegegrad abweichen.
          </p>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="section-eyebrow">Funktionen</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight text-balance">
              Was PflegePilot für Sie tut
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: '💰',
                title: 'Budget-Dashboard',
                desc: 'Alle Pflegeleistungen auf einen Blick — mit Fortschrittsbalken, Verfall-Countdown und dem Euro-Betrag, den Sie noch abholen können.',
                tone: 'from-primary-50 to-primary-100/40',
              },
              {
                icon: '⏰',
                title: 'Fristen-Autopilot',
                desc: 'Erinnerungen 90, 30 und 7 Tage vor Verfall — als Push direkt in der iOS-App, im Web-Dashboard sichtbar als Hinweis. So geht kein Geld mehr unbemerkt verloren.',
                tone: 'from-warning-50 to-warning-100/40',
              },
              {
                icon: '📄',
                title: 'Antrags-Helfer',
                desc: 'Fertige Antragsvorlagen pro Leistung — vorausgefüllt mit Ihren Daten, zum Ausdrucken und Einreichen.',
                tone: 'from-success-50 to-success-100/40',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card card-hover p-7 group"
              >
                <div className={`mb-5 inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.tone} text-3xl ring-1 ring-white shadow-soft`}>
                  {f.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── iOS App Download ────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-20 md:py-24 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
        <div className="pointer-events-none absolute inset-0 bg-mesh-dark" aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="badge bg-success-500/20 text-success-100 ring-1 ring-success-400/30 backdrop-blur-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-success-300 animate-pulse" />
            iOS App — Jetzt verfügbar
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight text-balance">
            Jetzt im App Store verfügbar
          </h2>
          <p className="text-gray-300 mb-10 text-lg text-pretty max-w-xl mx-auto">
            Mit Push-Benachrichtigungen, Budget-Übersicht und Antrags-Helfer.
            Lade dir die kostenlose iOS-App jetzt herunter.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-[1.03]"
            >
              <img
                src="/badges/app-store-badge-de.svg"
                alt="Im App Store laden"
                className="h-14 md:h-16"
              />
            </a>
            <div className="hidden md:flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-soft">
              <QRCodeSVG value={APP_STORE_URL} size={120} bgColor="transparent" />
              <p className="text-xs text-gray-500">QR scannen</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-6">Kostenlos · Kein Abo · Keine In-App-Käufe</p>
        </div>
      </section>

      {/* ─── Ratgeber Teaser ──────────────────────────────────── */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="section-eyebrow">Wissen</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Pflege-Ratgeber</h2>
            <p className="text-gray-500 text-lg">Alles was Sie wissen müssen — verständlich erklärt.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {[
              { icon: '💶', titel: 'Entlastungsbetrag: 131 EUR/Monat die viele verschenken', slug: 'entlastungsbetrag', tone: 'from-success-50 to-success-100/30', ring: 'ring-success-100' },
              { icon: '🔄', titel: 'Verhinderungspflege: bis 3.539 EUR/Jahr beantragen', slug: 'verhinderungspflege', tone: 'from-primary-50 to-primary-100/30', ring: 'ring-primary-100' },
              { icon: '⚖️', titel: 'Widerspruch gegen Pflegegrad-Bescheid einlegen', slug: 'widerspruch', tone: 'from-warning-50 to-warning-100/30', ring: 'ring-warning-100' },
            ].map((a) => (
              <Link
                key={a.slug}
                href={`/ratgeber/${a.slug}`}
                className="card card-hover p-6 flex items-start gap-4 group"
              >
                <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${a.tone} ring-1 ${a.ring} flex items-center justify-center text-2xl shadow-soft`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-[15px] leading-snug group-hover:text-primary-700 transition-colors mb-2">
                    {a.titel}
                  </p>
                  <span className="text-xs text-primary-600 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Artikel lesen <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/ratgeber"
              className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm hover:gap-3 transition-all hover:text-primary-800"
            >
              Alle 21 Ratgeber-Artikel ansehen <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────── */}
      <section className="px-4 pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-6 py-14 md:px-12 md:py-20 text-center shadow-glow-primary">
            <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="mb-5 text-3xl md:text-4xl font-extrabold text-white tracking-tight text-balance">
                Wieviel Geld verlieren Sie gerade?
              </h2>
              <p className="mb-8 text-primary-50 text-lg text-pretty leading-relaxed">
                Beantworten Sie 5 Fragen — wir zeigen Ihnen in 60 Sekunden, wieviel Ihnen zusteht
                und wieviel davon Sie gerade verfallen lassen.
              </p>
              <Link
                href="/check"
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-bold text-primary-700 shadow-soft-xl transition-all hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                Jetzt kostenlos prüfen →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
