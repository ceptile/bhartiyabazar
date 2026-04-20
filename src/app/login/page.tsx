'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
    border: '1px solid var(--border-hover)', background: 'var(--bg)',
    color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Login failed.'); return; }
    router.push('/dashboard');
  };

  const handleGoogleLogin = () => {
    // TODO: wire up Google OAuth (NextAuth / Firebase Auth)
    alert('Google login coming soon. Configure your OAuth provider.');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="var(--amber)" />
              <text x="4" y="29" fontFamily="'EB Garamond',Georgia,serif" fontWeight="700" fontSize="22" fill="white" letterSpacing="-1">bB</text>
            </svg>
            <span style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontFamily: "'EB Garamond',serif", color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 'var(--r-md)',
              border: '1px solid var(--border-hover)', background: 'var(--bg)',
              color: 'var(--text-primary)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all var(--t)', marginBottom: 20,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--amber)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-sm)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-hover)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg)', border: '1px solid var(--crimson-glow)', color: 'var(--crimson)', fontSize: 13 }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp}
                onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
                <Link href="#" style={{ fontSize: 12, color: 'var(--amber)' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPass(e.target.value)} placeholder="Your password"
                  style={{ ...inp, paddingRight: 42 }}
                  onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 4 }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--amber)', fontWeight: 600 }}>Create one</Link>
            {' · '}
            <Link href="/register-business" style={{ color: 'var(--amber)', fontWeight: 600 }}>Register Business</Link>
          </p>
        </div>
      </div>
    </div>
  );
}