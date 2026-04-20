'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/data';

const ROTATING = ['Electrician', 'Doctor', 'Restaurant', 'Tutor', 'Mechanic', 'Salon', 'Plumber', 'Gym'];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export default function HeroSection() {
  const [query, setQuery]     = useState('');
  const [city, setCity]       = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % ROTATING.length); setVisible(true); }, 280);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (city)  p.set('city', city);
    router.push(`/search?${p.toString()}`);
  };

  const quickLinks = ['AC Repair', 'Doctor', 'Restaurant', 'Tutor', 'Salon'];
  const topCats = categories.slice(0, 8);

  return (
    <section style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      paddingTop: 64,
    }}>
      <div style={{ width: '100%', maxWidth: 780, padding: '0 clamp(16px,4vw,48px)', textAlign: 'center' }}>

        {/* ── Brand wordmark ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontWeight: 700,
            fontSize: 'clamp(2.6rem, 7vw, 4.4rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--text-primary)',
          }}>
            Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
          </div>
          <div style={{
            marginTop: 12,
            fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
            color: 'var(--text-muted)',
          }}>
            Find the best{' '}
            <span style={{
              color: 'var(--amber)',
              fontWeight: 600,
              display: 'inline-block',
              transition: 'opacity 0.28s ease, transform 0.28s ease',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-8px)',
            }}>
              {ROTATING[wordIdx]}
            </span>
            {' '}near you
          </div>
        </div>

        {/* ── Search bar (identical to original) ── */}
        <form onSubmit={handleSearch}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--r-xl)',
            padding: 6,
            display: 'flex',
            gap: 6,
            maxWidth: 680,
            margin: '0 auto',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-faint)', display: 'flex', flexShrink: 0 }}><SearchIcon /></span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search businesses, services..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15 }}
              />
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'center', height: 24 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', minWidth: 140, borderRadius: 'var(--r-lg)', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-faint)', display: 'flex', flexShrink: 0 }}><MapPinIcon /></span>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City"
                style={{ width: 80, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14 }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '11px 24px', fontSize: 14, borderRadius: 'var(--r-lg)', flexShrink: 0 }}>
              Search
            </button>
          </div>
        </form>

        {/* ── Popular quick links ── */}
        <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 500 }}>Popular:</span>
          {quickLinks.map(q => (
            <a key={q} href={`/search?q=${encodeURIComponent(q)}`} className="chip">
              {q}
            </a>
          ))}
        </div>

        {/* ── Category chips ── */}
        <div style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {topCats.map(cat => (
            <a key={cat.id} href={`/search?category=${cat.slug}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 16px', borderRadius: 'var(--r-full)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
                transition: 'all var(--t)', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = cat.color;
                el.style.color = cat.color;
                el.style.background = cat.bg;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'var(--border)';
                el.style.color = 'var(--text-secondary)';
                el.style.background = 'var(--surface)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={cat.iconPath} />
              </svg>
              {cat.name.split(' ')[0]}
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}