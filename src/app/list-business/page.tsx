'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CATS = ['Restaurants & Food','Electronics & Repair','Health & Doctors','Home Services','Education & Tutors','Salons & Beauty','Auto & Vehicles','Clothing & Fashion','Grocery & Kirana','Jewellery & Gifts','Real Estate','Events & Catering','Fitness & Gym','Travel & Tours','Photography','Legal & Finance'];
const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' };
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'var(--amber)');
const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'var(--border-hover)');

export default function ListBusinessPage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();

  const [f, setF] = useState({ businessName: '', businessCategory: '', city: '', area: '', phone: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  // Auth guard — redirect to login if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/list-business');
    }
  }, [user, authLoading, router]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!f.businessName.trim()) { setError('Business name is required.'); return; }
    if (!f.businessCategory)    { setError('Please select a category.'); return; }
    if (!f.city)                { setError('Please select a city.'); return; }
    if (!user)                  { router.replace('/login?redirect=/list-business'); return; }

    setLoading(true);
    try {
      const slug = f.businessName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
      const businessRef = doc(db, 'businesses', slug);
      await setDoc(businessRef, {
        slug,
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email,
        name: f.businessName.trim(),
        category: f.businessCategory,
        city: f.city,
        area: f.area.trim(),
        phone: f.phone.trim() || user.phone || '',
        description: f.description.trim(),
        verified: false,
        createdAt: serverTimestamp(),
      });
      // Update user profile to business role
      await updateProfile({
        role: 'business',
        businessName: f.businessName.trim(),
        businessCategory: f.businessCategory,
        businessSlug: slug,
        city: f.city,
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setError('Failed to save. Please try again.');
    }
    setLoading(false);
  };

  // Loading state while auth is resolving
  if (authLoading || (!user && !authLoading)) {
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
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Your business has been submitted for review. We&apos;ll verify and publish it shortly.</p>
          <Link href="/dashboard" style={{ padding: '11px 28px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Go to Dashboard →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '80px 16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: '#fff0f0', border: '1px solid #fca5a5', color: '#dc2626', fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Business Name *</label>
              <input style={inp} placeholder="Sharma Electronics" value={f.businessName} onChange={set('businessName')} onFocus={focus} onBlur={blur} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Category *</label>
              <select style={{ ...inp, cursor: 'pointer' }} value={f.businessCategory} onChange={set('businessCategory')} onFocus={focus} onBlur={blur}>
                <option value="">Select a category…</option>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>City *</label>
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
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Business Phone</label>
              <input style={inp} placeholder="+91 98100 00000" value={f.phone} onChange={set('phone')} onFocus={focus} onBlur={blur} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Short Description</label>
              <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder="Tell customers what makes your business special…" value={f.description} onChange={set('description')} onFocus={focus} onBlur={blur} />
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: 13, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}
            >
              {loading
                ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving…</>
                : 'List My Business →'
              }
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
