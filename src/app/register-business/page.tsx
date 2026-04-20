'use client';
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const CATS = ['Restaurants & Food','Electronics & Repair','Health & Doctors','Home Services','Education & Tutors','Salons & Beauty','Auto & Vehicles','Clothing & Fashion','Grocery & Kirana','Jewellery & Gifts','Real Estate','Events & Catering','Fitness & Gym','Travel & Tours','Photography','Legal & Finance'];
const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
  border: '1px solid var(--border-hover)', background: 'var(--bg)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
};

export default function RegisterBusinessPage() {
  const { user, loading: authLoading, register, updateProfile } = useAuth();
  const router = useRouter();

  // If user is already logged in, start at step 2 (business info only)
  const [step, setStep] = useState(1);
  const [f, setF] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
    businessName: '', businessCategory: '', city: '', area: '', description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Once auth resolves, pre-fill and jump to step 2 if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      setStep(2);
      setF(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
      }));
    }
  }, [authLoading, user]);

  const set = (k: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setF(p => ({ ...p, [k]: e.target.value }));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--amber)');
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--border-hover)');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Step 1 → 2 (only shown when not logged in)
    if (step === 1) {
      if (!f.name || !f.email || !f.password) { setError('Fill all required fields.'); return; }
      if (f.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (f.password !== f.confirm) { setError('Passwords do not match.'); return; }
      setStep(2);
      return;
    }

    // Step 2 — business info
    if (!f.businessName || !f.businessCategory || !f.city) {
      setError('Please fill all required business fields.');
      return;
    }

    setLoading(true);

    if (user) {
      // Already logged in — just update their profile with business info
      const slug = f.businessName
        .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await updateProfile({
        role: 'business',
        businessName: f.businessName.trim(),
        businessCategory: f.businessCategory,
        businessSlug: slug,
        city: f.city,
      });
      setLoading(false);
      router.push('/dashboard');
    } else {
      // Not logged in — create a new account with role=business
      const res = await register({
        name: f.name,
        email: f.email,
        phone: f.phone,
        password: f.password,
        role: 'business',
        businessName: f.businessName,
        businessCategory: f.businessCategory,
        city: f.city,
      });
      setLoading(false);
      if (!res.ok) { setError(res.error || 'Registration failed.'); setStep(1); return; }
      router.push('/dashboard');
    }
  };

  // Show spinner while auth loads
  if (authLoading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--amber)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Determine which steps to show
  const isLoggedIn = !!user;
  const totalSteps = isLoggedIn ? 1 : 2; // logged-in users only see business step

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '80px 16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: 12, textDecoration: 'none' }}>
            <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontFamily: "'EB Garamond', serif", color: 'var(--text-primary)', marginBottom: 6 }}>
            List Your Business
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {isLoggedIn
              ? `Signed in as ${user.name} · ${user.email}`
              : 'Reach millions of customers across India'}
          </p>
        </div>

        {/* Step indicators — only show multi-step if not logged in */}
        {!isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
            {[1, 2].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: s <= step ? 'var(--amber)' : 'var(--surface-2)',
                  color: s <= step ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>{s}</div>
                <span style={{ marginLeft: 6, fontSize: 12, color: s === step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: s === step ? 600 : 400 }}>
                  {s === 1 ? 'Your Account' : 'Business Info'}
                </span>
                {i === 0 && <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 12px' }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: '#fff0f0', border: '1px solid #fca5a5', color: '#dc2626', fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Step 1 — Account (only for guests) */}
            {step === 1 && !isLoggedIn && (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Your Full Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input style={inp} placeholder="Ramesh Kumar" value={f.name} onChange={set('name')} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Email <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input type="email" style={inp} placeholder="you@example.com" value={f.email} onChange={set('email')} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Phone</label>
                  <input style={inp} placeholder="+91 98100 00000" value={f.phone} onChange={set('phone')} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                      Password <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input type="password" style={inp} placeholder="Min 6 chars" value={f.password} onChange={set('password')} onFocus={focus} onBlur={blur} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                      Confirm <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input type="password" style={inp} placeholder="Repeat" value={f.confirm} onChange={set('confirm')} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
              </>
            )}

            {/* Step 2 — Business Info (always shown when logged in, or after step 1) */}
            {(step === 2 || isLoggedIn) && (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Business Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input style={inp} placeholder="Sharma Electronics" value={f.businessName} onChange={set('businessName')} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Category <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={f.businessCategory} onChange={set('businessCategory')} onFocus={focus} onBlur={blur}>
                    <option value="">Select category…</option>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                      City <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select style={{ ...inp, cursor: 'pointer' }} value={f.city} onChange={set('city')} onFocus={focus} onBlur={blur}>
                      <option value="">Select city…</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Area / Locality</label>
                    <input style={inp} placeholder="Karol Bagh" value={f.area} onChange={set('area')} onFocus={focus} onBlur={blur} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Short Description</label>
                  <textarea
                    style={{ ...inp, minHeight: 80, resize: 'vertical' }}
                    placeholder="Describe your business…"
                    value={f.description}
                    onChange={set('description')}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>
              </>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {step === 2 && !isLoggedIn && (
                <button
                  type="button" onClick={() => setStep(1)}
                  style={{ flex: 1, padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >
                  ← Back
                </button>
              )}
              <button
                type="submit" disabled={loading}
                style={{ flex: 2, padding: 12, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {loading
                  ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving…</>
                  : step === 1 && !isLoggedIn ? 'Continue →'
                  : isLoggedIn ? 'List My Business'
                  : 'Register & List Business'
                }
              </button>
            </div>

          </form>

          {!isLoggedIn && (
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/login?redirect=/register-business" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in first</Link>
            </p>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}