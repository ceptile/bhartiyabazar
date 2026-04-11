'use client';
import { useState } from 'react';

const recentBusinesses = [
  {
    id: '1',
    name: 'Sharma Electronics',
    category: 'Electronics',
    city: 'Delhi',
    rating: 4.5,
    reviews: 23,
    icon: '🔌',
    badge: 'New',
    badgeColor: 'var(--green)',
    badgeBg: 'var(--green-bg)',
    addedAgo: '2 hours ago',
    phone: '+91 98100 00001',
  },
  {
    id: '2',
    name: 'Riya Beauty Salon',
    category: 'Salon & Spa',
    city: 'Mumbai',
    rating: 4.8,
    reviews: 11,
    icon: '💅',
    badge: 'New',
    badgeColor: 'var(--green)',
    badgeBg: 'var(--green-bg)',
    addedAgo: '5 hours ago',
    phone: '+91 98200 00002',
  },
  {
    id: '3',
    name: 'FastFix Plumbers',
    category: 'Home Services',
    city: 'Bangalore',
    rating: 4.3,
    reviews: 7,
    icon: '🔧',
    badge: 'New',
    badgeColor: 'var(--green)',
    badgeBg: 'var(--green-bg)',
    addedAgo: '8 hours ago',
    phone: '+91 98300 00003',
  },
  {
    id: '4',
    name: 'Green Leaf Restaurant',
    category: 'Food & Dining',
    city: 'Jaipur',
    rating: 4.6,
    reviews: 34,
    icon: '🍽️',
    badge: 'New',
    badgeColor: 'var(--green)',
    badgeBg: 'var(--green-bg)',
    addedAgo: '12 hours ago',
    phone: '+91 98400 00004',
  },
  {
    id: '5',
    name: 'TechZone Computers',
    category: 'Electronics',
    city: 'Pune',
    rating: 4.4,
    reviews: 18,
    icon: '💻',
    badge: 'New',
    badgeColor: 'var(--green)',
    badgeBg: 'var(--green-bg)',
    addedAgo: '1 day ago',
    phone: '+91 98500 00005',
  },
  {
    id: '6',
    name: 'Dr. Mehta Clinic',
    category: 'Healthcare',
    city: 'Ahmedabad',
    rating: 4.9,
    reviews: 56,
    icon: '🏥',
    badge: 'Verified',
    badgeColor: 'var(--blue)',
    badgeBg: 'var(--blue-bg)',
    addedAgo: '1 day ago',
    phone: '+91 98600 00006',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, marginLeft: 4 }}>{rating}</span>
    </div>
  );
}

export default function RecentlyAdded() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="section-sm" style={{ background: 'var(--navy-2)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(32px,5vw,48px)', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 'var(--radius-full)', background: 'var(--green-bg)', border: '1px solid rgba(0,214,143,0.2)', marginBottom: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px var(--green)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Updates</span>
            </div>
            <h2 className="section-title" style={{ marginBottom: 8 }}>Recently Added Businesses</h2>
            <p className="section-sub">Fresh listings added by business owners today</p>
          </div>
          <a
            href="/search"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-hover)', color: 'var(--text-secondary)',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--saffron)'; (e.currentTarget as HTMLElement).style.color = 'var(--saffron)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
          >
            View All
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
          gap: 20,
        }}>
          {recentBusinesses.map((biz, i) => (
            <div
              key={biz.id}
              onMouseEnter={() => setHoveredId(biz.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: hoveredId === biz.id ? 'var(--surface-2)' : 'var(--surface)',
                border: hoveredId === biz.id ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all var(--transition)',
                transform: hoveredId === biz.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hoveredId === biz.id ? 'var(--shadow-md)' : 'none',
                cursor: 'pointer',
                animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--radius-md)',
                background: 'var(--surface-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
                border: '1px solid var(--border)',
              }}>
                {biz.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{biz.name}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: biz.badgeBg,
                    color: biz.badgeColor,
                    flexShrink: 0,
                  }}>{biz.badge}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{biz.category}</span>
                  <span style={{ color: 'var(--border)', fontSize: 10 }}>•</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    {biz.city}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <StarRating rating={biz.rating} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Added {biz.addedAgo}</span>
                </div>
              </div>

              {/* Contact button */}
              <a
                href={`tel:${biz.phone}`}
                onClick={e => e.stopPropagation()}
                style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: hoveredId === biz.id ? 'var(--saffron)' : 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all var(--transition)',
                  color: hoveredId === biz.id ? '#fff' : 'var(--text-muted)',
                  textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
            🏪 <strong style={{ color: 'var(--text-secondary)' }}>Own a business?</strong> Get listed for FREE in under 2 minutes
          </p>
          <a
            href="/register"
            className="btn btn-saffron btn-lg"
            style={{ textDecoration: 'none', display: 'inline-flex' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Add Your Business — It&apos;s FREE
          </a>
        </div>
      </div>
    </section>
  );
}
