import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { NavBar } from '@/components/layout/NavBar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  variable: '--font-display',
  display:  'swap',
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-body',
  display:  'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'TURBOMINDZ — Own The Philosophy. Join The Elite.',
    template: '%s — TURBOMINDZ',
  },
  description:
    '3,000 exclusive NFTs merging AI art with timeless wisdom — for thinkers who act.',
  keywords:  ['NFT', 'philosophy', 'Web3', 'community', 'AI art', 'TURBOMINDZ'],
  authors:   [{ name: 'TURBOMINDZ' }],
  openGraph: {
    type:        'website',
    siteName:    'TURBOMINDZ',
    title:       'TURBOMINDZ — Own The Philosophy. Join The Elite.',
    description: '3,000 exclusive NFTs merging AI art with timeless wisdom.',
    url:         'https://turbomindz.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'TURBOMINDZ',
    description: '3,000 exclusive NFTs merging AI art with timeless wisdom.',
    images:      ['/og-image.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-obsidian text-[#F8F8FF] font-body antialiased">
        <Providers>
          <NavBar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1C1C2E',
                color:      '#F8F8FF',
                border:     '1px solid #2A2A3E',
                fontFamily: 'var(--font-body)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
