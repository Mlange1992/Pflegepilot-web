import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArtikelBySlug, getAllSlugs, ratgeberArtikel } from '@/lib/ratgeber-data'

type Props = {
  params: Promise<{ slug: string }>
}

// ─── SEO Metadata ───────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artikel = getArtikelBySlug(slug)
  if (!artikel) return {}
  return {
    title: artikel.meta.title,
    description: artikel.meta.description,
    keywords: artikel.meta.keywords,
    openGraph: {
      title: artikel.meta.title,
      description: artikel.meta.description,
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

// ─── Markdown → JSX (einfacher Parser) ──────────────────────────────────────

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-extrabold text-gray-900 mt-10 mb-4 tracking-tight">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-gray-800 mt-6 mb-2 tracking-tight">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 mb-4 text-gray-700 text-[15px] leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-primary-400" />
              <span dangerouslySetInnerHTML={{ __html: boldify(item) }} />
            </li>
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 mb-4 text-gray-700 text-[15px] leading-relaxed counter-reset-list">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="pt-0.5" dangerouslySetInnerHTML={{ __html: boldify(item) }} />
            </li>
          ))}
        </ol>
      )
      continue
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      elements.push(
        <p
          key={i}
          className="text-gray-700 text-[15px] leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: boldify(line) }}
        />
      )
    }
    i++
  }

  return elements
}

function boldify(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

// ─── Seite ───────────────────────────────────────────────────────────────────

export default async function RatgeberDetailPage({ params }: Props) {
  const { slug } = await params
  const artikel = getArtikelBySlug(slug)
  if (!artikel) notFound()

  const weitereArtikel = ratgeberArtikel
    .filter((a) => a.slug !== slug)
    .slice(0, 3)

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/ratgeber" className="hover:text-primary-700 transition-colors">
            Ratgeber
          </Link>
          <span>›</span>
          <span className="text-gray-700 font-medium line-clamp-1">{artikel.titel}</span>
        </nav>

        {/* Header */}
        <div className="card p-7 md:p-8 mb-6">
          <div className="flex items-start gap-5 mb-5">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/40 ring-1 ring-primary-100 flex items-center justify-center text-4xl shadow-soft">
              {artikel.icon}
            </div>
            <div className="flex-1 pt-0.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
                {artikel.titel}
              </h1>
              <p className="text-gray-500 leading-relaxed">{artikel.kurztext}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100">
            {artikel.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Inhalt */}
        <article className="card p-7 md:p-10 mb-8">
          {renderMarkdown(artikel.inhalt)}
        </article>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-6 py-10 md:px-10 md:py-12 text-center mb-10 shadow-glow-primary">
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="font-extrabold text-2xl text-white mb-2 tracking-tight">Welche Leistungen stehen Ihnen zu?</p>
            <p className="text-primary-50 mb-6 leading-relaxed">
              PflegePilot berechnet Ihren Pflegegrad und zeigt alle Budgets — kostenlos.
            </p>
            <Link
              href="/check"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold py-3.5 px-7 rounded-2xl min-h-[52px] hover:bg-primary-50 hover:scale-[1.02] transition-all shadow-soft-lg active:scale-[0.98]"
            >
              Jetzt Pflegegrad prüfen →
            </Link>
          </div>
        </div>

        {/* Weitere Artikel */}
        {weitereArtikel.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-gray-900 mb-5 tracking-tight">Weitere Ratgeber-Artikel</h2>
            <div className="space-y-3">
              {weitereArtikel.map((a) => (
                <Link
                  key={a.slug}
                  href={`/ratgeber/${a.slug}`}
                  className="card card-hover p-5 flex items-center gap-4 group"
                >
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/40 ring-1 ring-primary-100 flex items-center justify-center text-2xl">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors leading-snug">
                      {a.titel}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{a.kurztext}</p>
                  </div>
                  <span className="text-primary-600 shrink-0 text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/ratgeber"
                className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm hover:gap-3 transition-all hover:text-primary-800"
              >
                Alle {ratgeberArtikel.length} Artikel ansehen <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
