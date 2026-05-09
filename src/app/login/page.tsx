'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function LoginContent() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--color-off-white)', padding: '80px 16px'
    }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 8px' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700,
              fontSize: 24, color: 'var(--color-deep-charcoal)', letterSpacing: '-0.02em', marginBottom: 6
            }}>
              Bhartiya<span style={{ color: 'var(--color-warm-terracotta)' }}>Bazar</span>
            </div>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.5rem)', fontFamily: "'EB Garamond',serif", color: 'var(--color-deep-charcoal)', marginBottom: 4 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: 'var(--color-light-gray)' }}>Sign in to continue</p>
        </div>

        <div style={{
          background: 'var(--color-pure-white)', border: '1px solid rgba(31, 30, 29, 0.12)',
          borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--r-md)',
              background: '#fff0f0', border: '1px solid #fca5a5',
              color: '#dc2626', fontSize: 13, marginBottom: 20
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: 10,
              border: '1px solid rgba(31, 30, 29, 0.3)', background: 'var(--color-off-white)',
              color: 'var(--color-deep-charcoal)', fontWeight: 600, fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'all 180ms ease', opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--color-warm-terracotta)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,119,87,0.15)'; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(31, 30, 29, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 18, height: 18, border: '2px solid rgba(31, 30, 29, 0.3)',
                  borderTopColor: 'var(--color-warm-terracotta)', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', flexShrink: 0
                }} />
                Signing in…
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--color-light-gray)' }}>
            By signing in, you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--color-warm-terracotta)' }}>Terms</Link> &amp;{' '}
            <Link href="/privacy" style={{ color: 'var(--color-warm-terracotta)' }}>Privacy Policy</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--color-medium-gray)' }}>
          Want to list your business?{' '}
          <Link href="/list-business" style={{ color: 'var(--color-warm-terracotta)', fontWeight: 600 }}>List it free →</Link>
        </p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--amber)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
