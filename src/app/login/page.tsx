'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.ok) router.push(redirect);
    else if (res.error) setError(res.error);
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '80px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </div>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontFamily: "'EB Garamond',serif", color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: '#fff0f0', border: '1px solid #fca5a5', color: '#dc2626', fontSize: 13, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: 'var(--r-md)',
              border: '1px solid var(--border-hover)', background: 'var(--bg)',
              color: 'var(--text-primary)', fontWeight: 600, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'all var(--t)',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = 'var(--amber)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--amber)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-faint)' }}>
            By signing in, you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--amber)' }}>Terms</Link> &amp;{' '}
            <Link href="/privacy" style={{ color: 'var(--amber)' }}>Privacy Policy</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Want to list your business?{' '}
          <Link href="/list-business" style={{ color: 'var(--amber)', fontWeight: 600 }}>List it free →</Link>
        </p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}