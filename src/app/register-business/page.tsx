'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const CATS = ['Restaurants & Food','Electronics & Repair','Health & Doctors','Home Services','Education & Tutors','Salons & Beauty','Auto & Vehicles','Clothing & Fashion','Grocery & Kirana','Jewellery & Gifts','Real Estate','Events & Catering','Fitness & Gym','Travel & Tours','Photography','Legal & Finance'];
const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' };

export default function RegisterBusinessPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '', businessName: '', businessCategory: '', city: '', area: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF(p => ({ ...p, [k]: e.target.value }));
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'var(--amber)');
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'var(--border-hover)');

  const next = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    if (step === 1) {
      if (!f.name || !f.email || !f.password) { setError('Fill required fields.'); return; }
      if (f.password.length < 6) { setError('Password 6+ chars.'); return; }
      if (f.password !== f.confirm) { setError('Passwords do not match.'); return; }
      setStep(2);
    } else {
      if (!f.businessName || !f.businessCategory || !f.city) { setError('Fill required fields.'); return; }
      setLoading(true);
      const res = await register({ name: f.name, email: f.email, phone: f.phone, password: f.password, role: 'business', businessName: f.businessName, businessCategory: f.businessCategory, city: f.city });
      setLoading(false);
      if (!res.ok) { setError(res.error || 'Registration failed.'); setStep(1); return; }
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '80px 16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="var(--amber)" /><text x="4" y="29" fontFamily="'EB Garamond',Georgia,serif" fontWeight="700" fontSize="22" fill="white" letterSpacing="-1">bB</text></svg>
            <span style={{ fontFamily: "'EB Garamond',serif", fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span></span>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontFamily: "'EB Garamond',serif", color: 'var(--text-primary)', marginBottom: 6 }}>List Your Business</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Reach millions across India</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
          {[1,2].map((s,i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: s <= step ? 'var(--amber)' : 'var(--surface-2)', color: s <= step ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s}</div>
              <span style={{ marginLeft: 6, fontSize: 12, color: s === step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: s === step ? 600 : 400 }}>{s === 1 ? 'Your Account' : 'Business Info'}</span>
              {i === 0 && <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={next} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg)', color: 'var(--crimson)', fontSize: 13 }}>{error}</div>}
            {step === 1 ? <>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Your Full Name *</label><input style={inp} placeholder="Ramesh Kumar" value={f.name} onChange={set('name')} onFocus={focus} onBlur={blur} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Email *</label><input type="email" style={inp} placeholder="you@example.com" value={f.email} onChange={set('email')} onFocus={focus} onBlur={blur} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Phone</label><input style={inp} placeholder="+91 98100 00000" value={f.phone} onChange={set('phone')} onFocus={focus} onBlur={blur} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Password *</label><input type="password" style={inp} placeholder="Min 6 chars" value={f.password} onChange={set('password')} onFocus={focus} onBlur={blur} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Confirm *</label><input type="password" style={inp} placeholder="Repeat" value={f.confirm} onChange={set('confirm')} onFocus={focus} onBlur={blur} /></div>
              </div>
            </> : <>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Business Name *</label><input style={inp} placeholder="Sharma Electronics" value={f.businessName} onChange={set('businessName')} onFocus={focus} onBlur={blur} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Category *</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={f.businessCategory} onChange={set('businessCategory')} onFocus={focus} onBlur={blur}>
                  <option value="">Select category…</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>City *</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={f.city} onChange={set('city')} onFocus={focus} onBlur={blur}>
                    <option value="">Select city…</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Area / Locality</label><input style={inp} placeholder="Karol Bagh" value={f.area} onChange={set('area')} onFocus={focus} onBlur={blur} /></div>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Short Description</label>
                <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder="Describe your business…" value={f.description} onChange={set('description')} onFocus={focus} onBlur={blur} />
              </div>
            </>}
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {step === 2 && <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>← Back</button>}
              <button type="submit" disabled={loading} style={{ flex: 2, padding: 12, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Registering…' : step === 1 ? 'Continue →' : 'Register Business'}
              </button>
            </div>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Already have an account? <Link href="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}