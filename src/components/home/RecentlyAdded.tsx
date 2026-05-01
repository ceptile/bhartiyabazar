'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Listing {
  slug: string; name: string; category: string;
  city: string; area?: string; description?: string;
  verified?: boolean; status?: string;
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
function MapPin() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1M12 20v1M3 12h1M20 12h1M5.64 5.64l.71.71M17.66 17.66l.71.71M5.64 18.36l.71-.71M17.66 6.34l.71-.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, height: 150 }}>
      <div style={{ height: 14, background: 'var(--surface-offset)', borderRadius: 4, marginBottom: 10, width: '60%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      <div style={{ height: 11, background: 'var(--surface-offset)', borderRadius: 4, marginBottom: 8, width: '35%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      <div style={{ height: 11, background: 'var(--surface-offset)', borderRadius: 4, width: '75%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
    </div>
  );
}

export default function RecentlyAdded() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'businesses'), orderBy('createdAt', 'desc'), limit(8))
        );
        const data: Listing[] = snap.docs.map(d => ({ slug: d.id, ...d.data() } as Listing));
        // show all except explicitly rejected
        setListings(data.filter(b => b.status !== 'rejected'));
      } catch {
        // fallback: fetch without orderBy in case index doesn't exist
        try {
          const snap2 = await getDocs(collection(db, 'businesses'));
          const data: Listing[] = snap2.docs.map(d => ({ slug: d.id, ...d.data() } as Listing));
          setListings(data.filter(b => b.status !== 'rejected').slice(0, 8));
        } catch (e) {
          console.error('[RecentlyAdded]', e);
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <section className="section-sm" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', border: '1px solid rgba(45,122,58,0.15)', marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Growing Every Day</span>
            </div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>New on BhartiyaBazar</h2>
            <p className="section-sub">Freshly listed businesses across India</p>
          </div>
          <Link href="/listings" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            View All <ArrowRightIcon />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ border: '1px dashed var(--border-hover)', borderRadius: 'var(--r-xl)', padding: 'clamp(48px,8vw,80px) 24px', textAlign: 'center', background: 'var(--surface)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, fontFamily: 'var(--font-display)' }}>
              Be the first business here
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.7 }}>
              BhartiyaBazar is building India&apos;s most trusted business directory. List your business today — completely free.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register-business" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <SparkleIcon /> List Your Business Free
              </Link>
              <Link href="/listings" className="btn btn-outline">Browse Directory</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {listings.map(biz => (
              <Link key={biz.slug} href={`/business/${biz.slug}`}
                style={{ textDecoration: 'none', display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-sm)', transition: 'all var(--t)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, marginRight: 8 }}>{biz.name}</h3>
                  {biz.verified && <span style={{ padding: '2px 7px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>✓ Verified</span>}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontSize: 11, fontWeight: 600 }}>{biz.category}</span>
                </div>
                {biz.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{biz.description}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-faint)', fontSize: 12 }}>
                  <MapPin />
                  {biz.area ? `${biz.area}, ${biz.city}` : biz.city}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}`}</style>
    </section>
  );
}