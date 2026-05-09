'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getUserLocation, reverseGeocode, forwardGeocode } from '@/lib/geo';
import { searchCategories, ALL_CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: '1px solid rgba(31, 30, 29, 0.3)', background: 'var(--color-off-white)',
  color: 'var(--color-deep-charcoal)', fontSize: 14, outline: 'none',
};

function LocIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>; }
function XIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

// ─── Category selector panel ───────────────────────────────────────────────
function CategoryPanel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchCategories>>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) setSuggestions(searchCategories(query, 10));
    else setSuggestions([]);
  }, [query]);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const groupCats = group ? ALL_CATEGORIES.filter(c => c.group === group) : [];

  return (
    <div ref={ref}>
      <div onClick={() => setOpen(p => !p)}
        style={{ ...inp, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>{value || 'Select or search category…'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {open && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 300, padding: 12, marginTop: 4 }}>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search category (e.g. restaurant, doctor, salon)…"
            style={{ ...inp, marginBottom: 10, fontSize: 13 }} />
          {suggestions.length > 0 ? (
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
              {suggestions.map(s => (
                <button key={s.id} onClick={() => { onChange(s.name); setOpen(false); setQuery(''); }}
                  style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '8px 12px', background: s.name === value ? 'var(--amber-subtle)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 'var(--r-sm)', marginBottom: 2 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = s.name === value ? 'var(--amber-subtle)' : 'none')}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.name === value ? 'var(--amber)' : 'var(--text-primary)' }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{s.group}</span>
                </button>
              ))}
            </div>
          ) : null}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Browse by Group</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {CATEGORY_GROUPS.map(g => (
              <button key={g} onClick={() => setGroup(group === g ? '' : g)}
                style={{ padding: '4px 10px', borderRadius: 'var(--r-full)', fontSize: 11, fontWeight: 500, border: `1px solid ${group === g ? 'var(--amber)' : 'var(--border)'}`, background: group === g ? 'var(--amber-subtle)' : 'var(--bg)', color: group === g ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>{g}</button>
            ))}
          </div>
          {group && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxHeight: 140, overflowY: 'auto' }}>
              {groupCats.map(cat => (
                <button key={cat.id} onClick={() => { onChange(cat.name); setOpen(false); setQuery(''); setGroup(''); }}
                  style={{ padding: '4px 10px', borderRadius: 'var(--r-full)', fontSize: 12, border: `1px solid ${cat.name === value ? 'var(--amber)' : 'var(--border)'}`, background: cat.name === value ? 'var(--amber-subtle)' : 'var(--bg)', color: cat.name === value ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>{cat.name}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Full address picker ────────────────────────────────────────────────────
function AddressPicker({ value, onChange }: {
  value: { country: string; state: string; city: string; area: string; street: string; building: string; pincode: string };
  onChange: (v: typeof value) => void;
}) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<Array<{ display_name: string; address: Record<string, string> }>>([]);
  const [cityQuery, setCityQuery] = useState(value.city);
  const [showCitySug, setShowCitySug] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCitySug(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const detectLive = async () => {
    setGeoLoading(true);
    try {
      const pos = await getUserLocation();
      const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      const next = {
        country: geo.country || value.country,
        state: geo.state || value.state,
        city: geo.city || value.city,
        area: geo.area || value.area,
        street: geo.street || value.street,
        building: value.building,
        pincode: geo.postcode || value.pincode,
      };
      onChange(next);
      setCityQuery(next.city);
    } catch {
      alert('Could not detect location. Please allow location access.');
    }
    setGeoLoading(false);
  };

  const searchCity = async (q: string) => {
    setCityQuery(q);
    onChange({ ...value, city: q });
    if (q.length < 3) { setCitySuggestions([]); setShowCitySug(false); return; }
    const results = await forwardGeocode(q);
    setCitySuggestions(results.slice(0, 5));
    setShowCitySug(true);
  };

  const label = (txt: string, req = false) => (
    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
      {txt}{req && <span style={{ color: '#dc2626' }}> *</span>}
    </label>
  );
  const field = (key: keyof typeof value, ph: string, req = false, colSpan = 1) => (
    <div style={{ gridColumn: `span ${colSpan}` }}>
      {label(key === 'building' ? 'Building / House / Flat No.' :
             key === 'area' ? 'Area / Locality / Neighbourhood' :
             key === 'street' ? 'Street / Colony / Road' :
             key === 'pincode' ? 'Pincode / ZIP' :
             key.charAt(0).toUpperCase() + key.slice(1), req)}
      <input style={inp} placeholder={ph} value={(value as Record<string, string>)[key] || ''}
        onChange={e => onChange({ ...value, [key]: e.target.value })}
        onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')}
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button type="button" onClick={detectLive} disabled={geoLoading}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--amber-glow)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontWeight: 600, fontSize: 13, cursor: geoLoading ? 'wait' : 'pointer', alignSelf: 'flex-start' }}>
        {geoLoading
          ? <div style={{ width: 13, height: 13, border: '2px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          : <LocIcon />}
        📡 Use My Live Location (Autofill)
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {field('country', 'India', true)}
        {field('state', 'e.g. Uttar Pradesh', true)}
      </div>

      <div ref={cityRef} style={{ position: 'relative' }}>
        {label('City / Town / District', true)}
        <input style={inp} placeholder="e.g. Lucknow, Firozabad…" value={cityQuery}
          onChange={e => searchCity(e.target.value)}
          onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')}
        />
        {showCitySug && citySuggestions.length > 0 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 300, overflow: 'hidden' }}>
            {citySuggestions.map((s, i) => (
              <button key={i} type="button"
                onClick={() => {
                  const a = s.address;
                  const city = a.city || a.town || a.village || a.county || '';
                  const state = a.state || '';
                  const country = a.country || '';
                  const area = a.suburb || a.neighbourhood || '';
                  onChange({ ...value, city, state, country, area });
                  setCityQuery(city);
                  setShowCitySug(false);
                }}
                style={{ display: 'block', width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >{s.display_name}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {field('area', 'e.g. Civil Lines, Sadar Bazar')}
        {field('street', 'e.g. MG Road, Station Road')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
        {field('building', 'e.g. Shop 3, Sharma Complex, Near Bus Stand')}
        {field('pincode', 'e.g. 283203')}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function RegisterBusinessPage() {
  const { user, loading: authLoading, register, updateProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [f, setF] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
    businessName: '', businessCategory: '', description: '',
    address: { country: 'India', state: '', city: '', area: '', street: '', building: '', pincode: '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      setStep(2);
      setF(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: { ...prev.address, city: user.city || '' },
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

    if (step === 1) {
      if (!f.name || !f.email || !f.password) { setError('Fill all required fields.'); return; }
      if (f.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (f.password !== f.confirm) { setError('Passwords do not match.'); return; }
      setStep(2);
      return;
    }

    if (!f.businessName || !f.businessCategory || !f.address.city) {
      setError('Please fill business name, category, and city.');
      return;
    }

    setLoading(true);
    const addressStr = [f.address.building, f.address.street, f.address.area, f.address.city, f.address.state, f.address.pincode, f.address.country].filter(Boolean).join(', ');
    const slug = f.businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Always write to businesses collection
    const bizData = {
      name: f.businessName.trim(),
      category: f.businessCategory,
      description: f.description.trim(),
      slug,
      city: f.address.city,
      area: f.address.area,
      address: addressStr,
      country: f.address.country,
      state: f.address.state,
      pincode: f.address.pincode,
      ownerName: user?.name || f.name,
      phone: user?.phone || f.phone,
      status: 'active',
      verified: false,
      createdAt: serverTimestamp(),
    };

    if (user) {
      await updateProfile({
        role: 'business',
        businessName: f.businessName.trim(),
        businessCategory: f.businessCategory,
        businessSlug: slug,
        city: f.address.city,
        area: f.address.area,
        address: addressStr,
        country: f.address.country,
        state: f.address.state,
        pincode: f.address.pincode,
      });
      await setDoc(doc(db, 'businesses', slug), { ...bizData, ownerId: user.id });
      setLoading(false);
      router.push('/dashboard');
    } else {
      const res = await register({
        name: f.name, email: f.email, phone: f.phone, password: f.password,
        role: 'business',
        businessName: f.businessName, businessCategory: f.businessCategory,
        city: f.address.city, area: f.address.area,
        address: addressStr, country: f.address.country, state: f.address.state, pincode: f.address.pincode,
      });
      if (!res.ok) { setLoading(false); setError(res.error || 'Registration failed.'); setStep(1); return; }
      // Write to businesses collection after successful registration
      await setDoc(doc(db, 'businesses', slug), { ...bizData, ownerEmail: f.email });
      setLoading(false);
      router.push('/dashboard');
    }
  };

  if (authLoading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-off-white)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(31, 30, 29, 0.2)', borderTopColor: 'var(--color-warm-terracotta)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const isLoggedIn = !!user;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-off-white)', padding: '72px 16px 60px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: 10, textDecoration: 'none' }}>
            <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 700, fontSize: 22, color: 'var(--color-deep-charcoal)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--color-warm-terracotta)' }}>Bazar</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontFamily: "'EB Garamond', serif", color: 'var(--color-deep-charcoal)', marginBottom: 4 }}>List Your Business</h1>
          <p style={{ fontSize: 13, color: 'var(--color-light-gray)' }}>
            {isLoggedIn ? `Signed in as ${user.name}` : 'Reach millions of customers across India'}
          </p>
        </div>

        {!isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
            {[1, 2].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: s <= step ? 'var(--amber)' : 'var(--surface-2)', color: s <= step ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s}</div>
                <span style={{ marginLeft: 6, fontSize: 12, color: s === step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: s === step ? 600 : 400 }}>
                  {s === 1 ? 'Your Account' : 'Business Info'}
                </span>
                {i === 0 && <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 12px' }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ background: 'var(--color-pure-white)', border: '1px solid rgba(31, 30, 29, 0.12)', borderRadius: 16, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: '#fff0f0', border: '1px solid #fca5a5', color: '#dc2626', fontSize: 13 }}>⚠️ {error}</div>
            )}

            {step === 1 && !isLoggedIn && (
              <>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Your Full Name <span style={{ color: '#dc2626' }}>*</span></label>
                  <input style={inp} placeholder="Ramesh Kumar" value={f.name} onChange={set('name')} onFocus={focus} onBlur={blur} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Email <span style={{ color: '#dc2626' }}>*</span></label>
                  <input type="email" style={inp} placeholder="you@example.com" value={f.email} onChange={set('email')} onFocus={focus} onBlur={blur} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Phone</label>
                  <input style={inp} placeholder="+91 98100 00000" value={f.phone} onChange={set('phone')} onFocus={focus} onBlur={blur} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Password <span style={{ color: '#dc2626' }}>*</span></label>
                    <input type="password" style={inp} placeholder="Min 6 chars" value={f.password} onChange={set('password')} onFocus={focus} onBlur={blur} /></div>
                  <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Confirm <span style={{ color: '#dc2626' }}>*</span></label>
                    <input type="password" style={inp} placeholder="Repeat" value={f.confirm} onChange={set('confirm')} onFocus={focus} onBlur={blur} /></div>
                </div>
              </>
            )}

            {(step === 2 || isLoggedIn) && (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Business Name <span style={{ color: '#dc2626' }}>*</span></label>
                  <input style={inp} placeholder="Sharma Electronics" value={f.businessName} onChange={set('businessName')} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Category <span style={{ color: '#dc2626' }}>*</span></label>
                  <CategoryPanel value={f.businessCategory} onChange={v => setF(p => ({ ...p, businessCategory: v }))} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Short Description</label>
                  <textarea style={{ ...inp, minHeight: 70, resize: 'vertical' }} placeholder="Describe your business in 1-2 sentences…" value={f.description} onChange={set('description')} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>📍 Business Address</div>
                  <AddressPicker value={f.address} onChange={addr => setF(p => ({ ...p, address: addr }))} />
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {step === 2 && !isLoggedIn && (
                <button type="button" onClick={() => setStep(1)}
                  style={{ flex: 1, padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>← Back</button>
              )}
              <button type="submit" disabled={loading}
                style={{ flex: 2, padding: 12, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading
                  ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving…</>
                  : step === 1 && !isLoggedIn ? 'Continue →'
                  : isLoggedIn ? 'List My Business'
                  : 'Register & List Business'}
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
