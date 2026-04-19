'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' };
const focus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--amber)');
const blur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--border-hover)');

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', city: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    if (!f.name || !f.email || !f.password) { setError('Please fill required fields.'); return; }
    if (f.password.length < 6) { setError('Password must be 6+ characters.'); return; }
    if (f.password !== f.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const res = await register({ name: f.name, email: f.email, phone: f.phone, city: f.city, password: f.password, role: 'user' });
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Registration failed.'); return; }
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="var(--amber)" /><text x="4" y="29" fontFamily="'EB Garamond',Georgia,serif" fontWeight="700" fontSize="22" fill="white" letterSpacing="-1">bB</text></svg>
            <span style={{ fontFamily: "'EB Garamond',serif", fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span></span>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontFamily: "'EB Garamond',serif", color: 'var(--text-primary)', marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Join India&apos;s largest business platform</p>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg)', color: 'var(--crimson)', fontSize: 13 }}>{error}</div>}
            <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Full Name *</label>
              <input style={inp} placeholder="Rahul Sharma" value={f.name} onChange={set('name')} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Email *</label>
              <input type="email" style={inp} placeholder="you@example.com" value={f.email} onChange={set('email')} onFocus={focus} onBlur={blur} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Phone</label>
                <input style={inp} placeholder="+91 98100…" value={f.phone} onChange={set('phone')} onFocus={focus} onBlur={blur} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>City</label>
                <input style={inp} placeholder="Delhi" value={f.city} onChange={set('city')} onFocus={focus} onBlur={blur} /></div>
            </div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Password *</label>
              <input type="password" style={inp} placeholder="Min 6 characters" value={f.password} onChange={set('password')} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Confirm Password *</label>
              <input type="password" style={inp} placeholder="Repeat password" value={f.confirm} onChange={set('confirm')} onFocus={focus} onBlur={blur} /></div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
              {loading ? 'Creating…' : 'Create Free Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</Link>{' · '}
            <Link href="/register-business" style={{ color: 'var(--amber)', fontWeight: 600 }}>Register Business</Link>
          </p>
        </div>
      </div>
    </div>
  );
}