'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

export default function DashboardClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  async function handleSignOut() {
    await signOut(auth);
    router.push('/');
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-off-white)' }}>
      <div className="spinner" />
    </div>
  );

  if (!user) return null;

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--color-off-white)', padding: 'clamp(24px,5vw,48px)' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 400, color: 'var(--color-deep-charcoal)' }}>
              Welcome, {user.name?.split(' ')[0] ?? 'there'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--color-light-gray)', marginTop: 4 }}>{user.email}</p>
          </div>
          <button onClick={handleSignOut} className="btn btn-secondary">
            Sign Out
          </button>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'My Listings', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', href: '/dashboard/listings' },
            { label: 'Edit Business Page', icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z', href: '/dashboard/business-page' },
            { label: 'View Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', href: '/dashboard/analytics' },
            { label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', href: '/dashboard/messages' },
          ].map(action => (
            <a key={action.label} href={action.href} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-very-rounded)', background: 'rgba(217,119,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-warm-terracotta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={action.icon} />
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-deep-charcoal)' }}>{action.label}</span>
            </a>
          ))}
        </div>

        {/* User info card */}
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-deep-charcoal)', marginBottom: 16 }}>Your Account</h2>
          {[
            { label: 'Name',     value: user.name ?? '—' },
            { label: 'Email',    value: user.email ?? '—' },
            { label: 'User ID',  value: user.id },
            { label: 'Verified', value: user.verified ? 'Yes' : 'Not yet' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-muted-border)', fontSize: 14 }}>
              <span style={{ color: 'var(--color-light-gray)', fontWeight: 500 }}>{row.label}</span>
              <span style={{ color: 'var(--color-deep-charcoal)', fontFamily: row.label === 'User ID' ? 'monospace' : 'inherit', fontSize: row.label === 'User ID' ? 11 : 14 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
