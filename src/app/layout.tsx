import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ConditionalFooter from '@/components/layout/ConditionalFooter';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#1F1E1D' },
  ],
};

export const metadata: Metadata = {
  title: 'BhartiyaBazar — India\'s Business Hub',
  description: 'Find verified local businesses across India',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BhartiyaBazar',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: '100dvh' }}>{children}</main>
          <MobileBottomNav />
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}