'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Login failed.'); return; }
    router.push('/dashboard');
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
            <span style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span></span>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontFamily: "'EB Garamond',serif", color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg)', border: '1px solid var(--crimson-glow)', color: 'var(--crimson)', fontSize: 13 }}>{error}</div>}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp}
                onFocus={e => (e.target.style.borderColor = 'var(--amber)')} onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
                <Link href="#" style={{ fontSize: 12, color: 'var(--amber)' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPass(e.target.value)} placeholder="Your password" style={{ ...inp, paddingRight: 40 }}
                  onFocus={e => (e.target.style.borderColor = 'var(--amber)')} onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            No account? <Link href="/register" style={{ color: 'var(--amber)', fontWeight: 600 }}>Create one</Link>
            {' · '}
            <Link href="/register-business" style={{ color: 'var(--amber)', fontWeight: 600 }}>Register Business</Link>
          </p>
        </div>
      </div>
    </div>
  );
}