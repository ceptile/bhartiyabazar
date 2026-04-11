import type { Metadata, Viewport } from 'next';
import '../app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'BhartiyaBazar — India\'s Most Trusted Business Search',
    template: '%s | BhartiyaBazar',
  },
  description: 'Find verified local businesses, compare prices, and connect directly with sellers. India\'s largest business search platform — free for buyers and sellers.',
  keywords: ['business directory India', 'local business search', 'find businesses near me', 'Justdial alternative', 'IndiaMART alternative', 'free business listing'],
  authors: [{ name: 'BhartiyaBazar' }],
  creator: 'BhartiyaBazar',
  metadataBase: new URL('https://bhartiyabazar.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://bhartiyabazar.com',
    siteName: 'BhartiyaBazar',
    title: 'BhartiyaBazar — India\'s Most Trusted Business Search',
    description: 'Find verified local businesses, compare prices, and connect directly with sellers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BhartiyaBazar',
    description: 'India\'s most trusted business search platform',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#FAFAF8' }, { media: '(prefers-color-scheme: dark)', color: '#080C14' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('bb-theme');
              if (t) { document.documentElement.setAttribute('data-theme', t); return; }
            } catch(e){}
            var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
          })();
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
