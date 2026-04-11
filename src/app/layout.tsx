import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastProvider from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'BhartiyaBazar – India\'s Most Trusted Business Search Platform',
  description: 'Find verified businesses, compare prices, search products & services near you. Free business listings, direct contact, no spam. India\'s Google for Businesses.',
  keywords: 'business directory India, find businesses near me, local business search, verified businesses, bhartiya bazar',
  openGraph: {
    title: 'BhartiyaBazar – India\'s Most Trusted Business Search',
    description: 'Find verified businesses, compare prices, contact directly. No spam, no middlemen.',
    type: 'website',
    locale: 'en_IN',
  },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏪</text></svg>" },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
