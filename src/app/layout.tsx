import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import ConditionalFooter from '@/components/layout/ConditionalFooter';

export const metadata: Metadata = {
  title: 'BhartiyaBazar — India\'s Business Hub',
  description: 'Find verified local businesses across India',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}