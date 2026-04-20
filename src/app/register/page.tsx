'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

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

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
  border: '1px solid var(--border-hover)', background: 'var(--bg)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
};
const focus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--amber)');
const blur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--border-hover)');

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', city: '', password: '', confirm: '' });
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError]       = useState('');
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!f.name || !f.email || !f.password) { setError('Please fill required fields.'); return; }
    if (f.password.length < 6) { setError('Password must be 6+ characters.'); return; }
    if (f.password !== f.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const res = await register({ name: f.name, email: f.email, phone: f.phone, city: f.city, password: f.password, role: 'user' });
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Registration failed.'); return; }
    router.push('/dashboard');
  };

  const handleGoogle = async () => {
    setError('');
    setGLoading(true);
    const res = await loginWithGoogle();
    setGLoading(false);
    if (!res.ok) { setError(res.error || 'Google sign-in failed.'); return; }
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: 20 }}>
            <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </div>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontFamily: "'EB Garamond',serif", color: 'var(--text-primary)', marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Join India&apos;s largest business platform</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>

          {/* Error banner */}
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg)', border: '1px solid var(--crimson-glow)', color: 'var(--crimson)', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={gLoading || loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 'var(--r-md)',
              border: '1px solid var(--border-hover)', background: 'var(--bg)',
              color: 'var(--text-primary)', fontSize: 14, fontWeight: 600,
              cursor: gLoading ? 'wait' : 'pointer', transition: 'all var(--t)', marginBottom: 20,
              opacity: gLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { (e.currentTarget).style.borderColor = 'var(--amber)'; }}
            onMouseLeave={e => { (e.currentTarget).style.borderColor = 'var(--border-hover)'; }}
          >
            <GoogleIcon />
            {gLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>or register with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Full Name *</label>
              <input style={inp} placeholder="Rahul Sharma" value={f.name} onChange={set('name')} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Email *</label>
              <input type="email" style={inp} placeholder="you@example.com" value={f.email} onChange={set('email')} onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Phone</label>
                <input style={inp} placeholder="+91 98100…" value={f.phone} onChange={set('phone')} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>City</label>
                <input style={inp} placeholder="Delhi" value={f.city} onChange={set('city')} onFocus={focus} onBlur={blur} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Password *</label>
              <input type="password" style={inp} placeholder="Min 6 characters" value={f.password} onChange={set('password')} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Confirm Password *</label>
              <input type="password" style={inp} placeholder="Repeat password" value={f.confirm} onChange={set('confirm')} onFocus={focus} onBlur={blur} />
            </div>
            <button type="submit" disabled={loading || gLoading}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'wait' : 'pointer', marginTop: 4, opacity: loading ? 0.8 : 1 }}>
              {loading ? 'Creating…' : 'Create Free Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</Link>
            {' · '}
            <Link href="/register-business" style={{ color: 'var(--amber)', fontWeight: 600 }}>Register Business</Link>
          </p>
        </div>
      </div>
    </div>
  );
}