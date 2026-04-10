import type { Metadata } from 'next'
import { Inter, Rajdhani, EB_Garamond } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BhartiyaBazar — India\'s Business Search Platform',
    template: '%s | BhartiyaBazar',
  },
  description: 'Search businesses, products, and services across India. Free business listings, verified profiles, direct contact — India\'s most trusted business directory.',
  keywords: ['business directory India', 'local business search', 'buy sell India', 'verified businesses', 'bhartiya bazar'],
  openGraph: {
    title: 'BhartiyaBazar — India\'s Business Search Platform',
    description: 'Search businesses, products, and services across India.',
    url: 'https://bhartiyabazar.com',
    siteName: 'BhartiyaBazar',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BhartiyaBazar',
    description: 'India\'s most trusted business search platform',
  },
  metadataBase: new URL('https://bhartiyabazar.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${rajdhani.variable} ${ebGaramond.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
