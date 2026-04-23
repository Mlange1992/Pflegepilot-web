import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArtikelBySlug, getAllSlugs, ratgeberArtikel } from '@/lib/ratgeber-data'
import { DISCLAIMER } from '@/lib/utils/constants'

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
        <h2 key={i} className="text-xl font-extrabold text-gray-900 mt-8 mb-3">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-gray-800 mt-5 mb-2">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('- ')) {
      // collect consecutive list items
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 mb-3 text-gray-700 text-sm leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: boldify(item) }} />
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      // numbered list
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 mb-3 text-gray-700 text-sm leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: boldify(item) }} />
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
          className="text-gray-700 text-sm leading-relaxed mb-3"
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
    <div className="min-h-screen bg-gray-50">
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl shrink-0" role="img" aria-label={artikel.titel}>
              {artikel.icon}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">
                {artikel.titel}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">{artikel.kurztext}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {artikel.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Inhalt */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          {renderMarkdown(artikel.inhalt)}
        </div>

        {/* CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-6 text-center mb-8">
          <p className="font-extrabold text-lg mb-1">Welche Leistungen stehen Ihnen zu?</p>
          <p className="text-primary-100 text-sm mb-4">
            PflegePilot berechnet Ihren Pflegegrad und zeigt alle Budgets — kostenlos.
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-50 transition-colors text-sm"
          >
            Jetzt Pflegegrad prüfen →
          </Link>
        </div>

        {/* Weitere Artikel */}
        {weitereArtikel.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Weitere Ratgeber-Artikel</h2>
            <div className="space-y-3">
              {weitereArtikel.map((a) => (
                <Link
                  key={a.slug}
                  href={`/ratgeber/${a.slug}`}
                  className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow group"
                >
                  <span className="text-2xl shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors leading-tight">
                      {a.titel}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.kurztext}</p>
                  </div>
                  <span className="text-primary-600 text-sm shrink-0">→</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/ratgeber" className="text-sm text-primary-600 font-semibold hover:underline">
                Alle {ratgeberArtikel.length} Artikel ansehen →
              </Link>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
