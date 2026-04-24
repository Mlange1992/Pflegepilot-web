import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavbarWrapper } from '@/components/marketing/NavbarWrapper'
import { Footer } from '@/components/marketing/Footer'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'
import { Suspense } from 'react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PflegePilot — Digitaler Pflege-Finanzmanager',
    template: '%s | PflegePilot',
  },
  description:
    'PflegePilot hilft Familien, alle Pflegeleistungen vollständig abzurufen. 12 Mrd.€ verfallen jährlich — nicht Ihr Geld.',
  keywords: [
    'Pflegegrad',
    'Pflegeleistungen',
    'Entlastungsbetrag',
    'Verhinderungspflege',
    'Pflegekasse',
    'Pflegegeld',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'PflegePilot',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PflegePilot',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    author: { '@type': 'Person', name: 'Markus Lange' },
    description:
      'PflegePilot hilft Pflegefamilien, ihre gesetzlichen Pflegeleistungen vollständig zu nutzen und Fristen im Blick zu behalten.',
    url: 'https://www.pflege-pilot.com',
  }

  return (
    <html lang="de" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <NavbarWrapper />
          {children}
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  )
}
