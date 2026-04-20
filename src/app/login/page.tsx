'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

/* ── Icons ─────────────────────────────────────────────────────────────── */
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

/* ── Shared input style helper ──────────────────────────────────────────── */
const baseInp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
  border: '1px solid var(--border-hover)', background: 'var(--bg)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  fontFamily: 'inherit',
};

/* ── PasswordInput ──────────────────────────────────────────────────────── */
function PasswordInput({
  value, onChange, placeholder = 'Min 6 characters',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...baseInp, paddingRight: 44 }}
        onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
          padding: 4, background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function AuthPage() {
  // 'signup' is the default tab
  const [tab, setTab] = useState<'signup' | 'signin'>('signup');
  const { login, loginWithGoogle, register } = useAuth();
  const router = useRouter();

  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  // Sign-up fields
  const [su, setSu] = useState({ name: '', email: '', phone: '', city: '', password: '', confirm: '' });
  const setSuF = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setSu(p => ({ ...p, [k]: e.target.value }));

  // Sign-in fields
  const [si, setSi] = useState({ email: '', password: '' });

  const handleGoogle = async () => {
    setError('');
    setGLoading(true);
    const res = await loginWithGoogle();
    setGLoading(false);
    if (!res.ok) { setError(res.error || 'Google sign-in failed.'); return; }
    router.push('/dashboard');
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!su.name || !su.email || !su.password) { setError('Please fill all required fields.'); return; }
    if (su.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (su.password !== su.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const res = await register({ name: su.name, email: su.email, phone: su.phone, city: su.city, password: su.password, role: 'user' });
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Registration failed.'); return; }
    router.push('/dashboard');
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!si.email || !si.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const res = await login(si.email, si.password);
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Login failed.'); return; }
    router.push('/dashboard');
  };

  const switchTab = (t: 'signup' | 'signin') => {
    setTab(t);
    setError('');
    setLoading(false);
    setGLoading(false);
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: 12 }}>
            <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 700, fontSize: 26, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </div>
          </Link>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>India&apos;s Business Discovery Platform</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
            {(['signup', 'signin'] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  padding: '14px 0', fontSize: 14, fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? 'var(--amber)' : 'var(--text-muted)',
                  background: tab === t ? 'var(--amber-subtle)' : 'transparent',
                  border: 'none', borderBottom: tab === t ? '2px solid var(--amber)' : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.18s ease',
                }}
              >
                {t === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            ))}
          </div>

          <div style={{ padding: 28 }}>

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg, #fff0f0)', border: '1px solid var(--crimson-glow, #fca5a5)', color: 'var(--crimson, #dc2626)', fontSize: 13, marginBottom: 18 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={gLoading || loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '11px 16px', borderRadius: 'var(--r-md)',
                border: '1px solid var(--border-hover)', background: 'var(--bg)',
                color: 'var(--text-primary)', fontSize: 14, fontWeight: 600,
                cursor: gLoading ? 'wait' : 'pointer', marginBottom: 20,
                opacity: gLoading ? 0.7 : 1, transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <GoogleIcon />
              {gLoading ? 'Please wait…' : tab === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>
                {tab === 'signup' ? 'or sign up with email' : 'or sign in with email'}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* ── SIGN UP FORM ── */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 5 }}>Full Name *</label>
                  <input style={baseInp} placeholder="Rahul Sharma" value={su.name} onChange={setSuF('name')}
                    onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 5 }}>Email *</label>
                  <input type="email" style={baseInp} placeholder="you@example.com" value={su.email} onChange={setSuF('email')}
                    onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 5 }}>Phone</label>
                    <input style={baseInp} placeholder="+91 98100…" value={su.phone} onChange={setSuF('phone')}
                      onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 5 }}>City</label>
                    <input style={baseInp} placeholder="Delhi" value={su.city} onChange={setSuF('city')}
                      onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 5 }}>Password *</label>
                  <PasswordInput value={su.password} onChange={v => setSu(p => ({ ...p, password: v }))} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 5 }}>Confirm Password *</label>
                  <PasswordInput value={su.confirm} onChange={v => setSu(p => ({ ...p, confirm: v }))} placeholder="Repeat password" />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'wait' : 'pointer', marginTop: 4, opacity: loading ? 0.8 : 1 }}>
                  {loading ? 'Creating account…' : 'Create Free Account'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                  Want to list a business?{' '}
                  <Link href="/register-business" style={{ color: 'var(--amber)', fontWeight: 600 }}>Register here</Link>
                </p>
              </form>
            )}

            {/* ── SIGN IN FORM ── */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>Email Address</label>
                  <input type="email" value={si.email} onChange={e => setSi(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com" style={baseInp}
                    onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
                    <Link href="/forgot-password" style={{ fontSize: 12, color: 'var(--amber)' }}>Forgot password?</Link>
                  </div>
                  <PasswordInput value={si.password} onChange={v => setSi(p => ({ ...p, password: v }))} placeholder="Your password" />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: 12, borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.8 : 1 }}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            )}

          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          By continuing you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--amber)' }}>Terms</Link>
          {' & '}
          <Link href="/privacy" style={{ color: 'var(--amber)' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}