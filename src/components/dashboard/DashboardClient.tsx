'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function DashboardClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  async function handleSignOut() {
    await signOut(auth);
    router.push('/');
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading…</div>
    </div>
  );

  if (!user) return null;

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg)', padding: 'clamp(24px,5vw,48px)' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Welcome, {user.displayName?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{user.email}</p>
          </div>
          <button onClick={handleSignOut} style={{
            padding: '9px 20px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', background: 'var(--surface-2)',
            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Sign Out
          </button>
        </div>

        {/* User info card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '24px', maxWidth: 480 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Your Account</h2>
          {[
            { label: 'Name',     value: user.displayName ?? '—' },
            { label: 'Email',    value: user.email ?? '—' },
            { label: 'User ID',  value: user.uid },
            { label: 'Verified', value: user.emailVerified ? '✅ Yes' : '❌ Not yet' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{row.label}</span>
              <span style={{ color: 'var(--text-primary)', fontFamily: row.label === 'User ID' ? 'monospace' : 'inherit', fontSize: row.label === 'User ID' ? 11 : 14 }}>{row.value}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}