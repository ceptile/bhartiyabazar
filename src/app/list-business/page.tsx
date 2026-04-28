'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CategorySelector from '@/components/CategorySelector';
import LocationPicker, { LocationValue } from '@/components/LocationPicker';

const EMPTY_LOC: LocationValue = { country: 'India', state: '', city: '', area: '', street: '', building: '', postcode: '' };

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
  border: '1px solid var(--border-hover)', background: 'var(--bg)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
};
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'var(--amber)');
const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'var(--border-hover)');

export default function ListBusinessPage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();

  const [businessName, setBusinessName] = useState('');
  const [category, setCategory]         = useState('');
  const [phone, setPhone]               = useState('');
  const [description, setDescription]   = useState('');
  const [location, setLocation]         = useState<LocationValue>(EMPTY_LOC);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [done, setDone]                 = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=/list-business');
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!businessName.trim()) { setError('Business name is required.'); return; }
    if (!category)            { setError('Please select a category.'); return; }
    if (!location.city.trim()) { setError('Please enter your city.'); return; }
    if (!user)                { router.replace('/login?redirect=/list-business'); return; }

    setLoading(true);
    try {
      const slug = businessName.trim().toLowerCase()
        .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

      const fullAddress = [
        location.building,
        location.street,
        location.area,
        location.city,
        location.state,
        location.postcode,
        location.country,
      ].filter(Boolean).join(', ');

      await setDoc(doc(db, 'businesses', slug), {
        slug,
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email,
        name: businessName.trim(),
        category,
        country: location.country,
        state: location.state,
        city: location.city,
        area: location.area,
        street: location.street,
        building: location.building,
        postcode: location.postcode,
        fullAddress,
        phone: phone.trim() || user.phone || '',
        description: description.trim(),
        verified: false,
        status: 'approved',
        createdAt: serverTimestamp(),
      });

      await updateProfile({
        role: 'business',
        businessName: businessName.trim(),
        businessCategory: category,
        businessSlug: slug,
        city: location.city,
      });

      setDone(true);
    } catch (err) {
      console.error(err);
      setError('Failed to save. Please try again.');
    }
    setLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--amber)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '80px 16px' }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: 'var(--text-primary)', marginBottom: 12 }}>Business Listed!</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Your business is now live on BhartiyaBazar!</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/listings" style={{ padding: '11px 28px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>View Listings →</Link>
            <Link href="/dashboard" style={{ padding: '11px 28px', borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid var(--border)' }}>Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '80px 16px 60px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: 12, textDecoration: 'none' }}>
            <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </div>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontFamily: "'EB Garamond',serif", color: 'var(--text-primary)', marginBottom: 6 }}>List Your Business</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Logged in as <strong>{user.name}</strong> ({user.email})</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg)', border: '1px solid var(--crimson-glow)', color: 'var(--error)', fontSize: 13 }}>⚠️ {error}</div>}

            {/* Business name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Name *</label>
              <input style={inp} placeholder="Sharma Electronics" value={businessName}
                onChange={e => setBusinessName(e.target.value)} onFocus={focus} onBlur={blur} />
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category *</label>
              <CategorySelector value={category} onChange={setCategory} required />
              {category && <p style={{ fontSize: 12, color: 'var(--amber)', marginTop: 5 }}>✓ {category}</p>}
            </div>

            {/* Location */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Location *</label>
              <LocationPicker value={location} onChange={setLocation} required showBuilding />
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Phone</label>
              <input style={inp} placeholder="+91 98100 00000" value={phone}
                onChange={e => setPhone(e.target.value)} onFocus={focus} onBlur={blur} />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Short Description</label>
              <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }}
                placeholder="Tell customers what makes your business special…"
                value={description} onChange={e => setDescription(e.target.value)} onFocus={focus} onBlur={blur}
              />
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 13, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading
                ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving…</>
                : 'List My Business →'
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-faint)' }}>
          By listing, you agree to our <Link href="/terms" style={{ color: 'var(--amber)' }}>Terms of Service</Link>
        </p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
