import type { MetadataRoute } from 'next'
import leistungen from '@/lib/pflegerecht/leistungen-2026.json'
import { ratgeberArtikel } from '@/lib/ratgeber-data'
import type { LeistungConfig } from '@/lib/pflegerecht/engine'

const BASE = 'https://www.pflege-pilot.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/check`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/leistungen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/ratgeber`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/fristen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/support`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const leistungsPages: MetadataRoute.Sitemap = (leistungen as LeistungConfig[]).map((l) => ({
    url: `${BASE}/leistungen/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const ratgeberPages: MetadataRoute.Sitemap = ratgeberArtikel.map((a) => ({
    url: `${BASE}/ratgeber/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...leistungsPages, ...ratgeberPages]
}
