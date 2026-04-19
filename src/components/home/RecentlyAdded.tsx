'use client';
import { businesses } from '@/lib/data';
import Link from 'next/link';

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center', color: 'var(--gold)' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 3, color: 'var(--text-secondary)' }}>{rating}</span>
    </div>
  );
}

function VerifiedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

// Use real data from data.ts — no hardcoded fake businesses
const recentSlice = businesses.slice(0, 6);

export default function RecentlyAdded() {
  return (
    <section className="section-sm" style={{ background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', border: '1px solid rgba(45,122,58,0.15)', marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live Updates</span>
            </div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>Recently Listed</h2>
            <p className="section-sub">Fresh businesses verified and live on the platform</p>
          </div>
          <Link href="/search" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            View All <ArrowRightIcon />
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {recentSlice.map(biz => (
            <Link key={biz.id} href={`/business/${biz.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '20px',
                transition: 'all var(--t)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border-hover)';
                el.style.boxShadow = 'var(--shadow-md)';
                el.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  {/* Avatar initial */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--r-md)',
                    background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: 'var(--amber)',
                    fontFamily: 'var(--font-display)', flexShrink: 0,
                  }}>
                    {biz.name.charAt(0)}
                  </div>

                  {/* Badge */}
                  {biz.badge && (
                    <span className="badge badge-amber">{biz.badge}</span>
                  )}
                </div>

                {/* Name + category */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', lineHeight: 1.3 }}>
                      {biz.name}
                    </h3>
                    {biz.verified && (
                      <span style={{ color: 'var(--info)', display: 'flex', flexShrink: 0 }} title="Verified">
                        <VerifiedIcon />
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 500, marginBottom: 0 }}>{biz.category}</p>
                </div>

                {/* Short desc */}
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }} className="line-clamp-2">
                  {biz.shortDesc}
                </p>

                {/* Rating + location */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto' }}>
                  <div style={{ display: 'flex', align: 'center', gap: 8 }}>
                    <StarRow rating={biz.rating} />
                    <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>({biz.reviewCount})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                    <MapPinIcon />{biz.area}, {biz.city}
                  </div>
                </div>

                {/* Open status + phone */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: biz.openNow ? 'var(--success)' : 'var(--text-muted)', background: biz.openNow ? 'var(--success-bg)' : 'var(--surface-2)', padding: '3px 10px', borderRadius: 'var(--r-full)', border: `1px solid ${biz.openNow ? 'rgba(45,122,58,0.15)' : 'var(--border)'}` }}>
                    {biz.openNow ? 'Open Now' : 'Closed'}
                  </span>
                  <a href={`tel:${biz.phone}`} onClick={e => e.stopPropagation()}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--amber)', fontWeight: 500 }}>
                    <PhoneIcon />{biz.phone}
                  </a>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}