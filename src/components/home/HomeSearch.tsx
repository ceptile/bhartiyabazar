'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/data';

const ROTATING = ['Electrician', 'Doctor', 'Restaurant', 'Tutor', 'Mechanic', 'Salon', 'Plumber', 'Gym'];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function HomeSearch() {
  const [query, setQuery]     = useState('');
  const [city, setCity]       = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % ROTATING.length); setVisible(true); }, 260);
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (city)  p.set('city', city);
    router.push(`/search?${p.toString()}`);
  };

  const quickLinks = ['AC Repair', 'Doctor', 'Restaurant', 'Tutor', 'Salon', 'Plumber'];
  const topCats    = categories.slice(0, 8);

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '80px 16px 40px',
    }}>

      {/* ── Brand wordmark ── */}
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 700,
          fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: 'var(--text-primary)',
        }}>
          Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 14,
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          Find the best{' '}
          <span style={{
            color: 'var(--amber)',
            fontWeight: 600,
            display: 'inline-block',
            transition: 'opacity 0.26s ease, transform 0.26s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-6px)',
          }}>
            {ROTATING[wordIdx]}
          </span>
          {' '}near you
        </div>
      </div>

      {/* ── Search bar ── */}
      <form onSubmit={go} style={{ width: '100%', maxWidth: 680 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--r-full)',
          padding: '5px 5px 5px 20px',
          boxShadow: 'var(--shadow-md)',
          gap: 6,
          transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--amber)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
        >
          <span style={{ color: 'var(--text-faint)', display: 'flex', flexShrink: 0 }}>
            <SearchIcon />
          </span>

          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search businesses, services..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 15,
              minWidth: 0,
            }}
          />

          {/* Vertical divider */}
          <div style={{ width: 1, height: 22, background: 'var(--border)', flexShrink: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', flexShrink: 0 }}>
            <span style={{ color: 'var(--text-faint)', display: 'flex' }}><MapPinIcon /></span>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="City"
              style={{
                width: 90,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 22px',
              borderRadius: 'var(--r-full)',
              background: 'var(--amber)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background var(--t)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--amber-dark)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--amber)')}
          >
            Search
          </button>
        </div>
      </form>

      {/* ── Quick links ── */}
      <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>Popular:</span>
        {quickLinks.map(q => (
          <a
            key={q}
            href={`/search?q=${encodeURIComponent(q)}`}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--r-full)',
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              background: 'var(--surface)',
              transition: 'all var(--t)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'var(--amber)';
              el.style.color = 'var(--amber)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'var(--border)';
              el.style.color = 'var(--text-secondary)';
            }}
          >
            {q}
          </a>
        ))}
      </div>

      {/* ── Category chips ── */}
      <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 640 }}>
        {topCats.map(cat => (
          <a
            key={cat.id}
            href={`/search?category=${cat.slug}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px',
              borderRadius: 'var(--r-full)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              fontWeight: 500,
              transition: 'all var(--t)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = cat.color;
              el.style.color = cat.color;
              el.style.background = cat.bg;
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'var(--border)';
              el.style.color = 'var(--text-secondary)';
              el.style.background = 'var(--surface)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={cat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={cat.iconPath} />
            </svg>
            {cat.name.split(' ')[0]}
          </a>
        ))}
      </div>

      {/* ── Bottom links (Google-style) ── */}
      <div style={{ marginTop: 48, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'List Your Business', href: '/register-business' },
          { label: 'Browse All', href: '/search' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ].map(l => (
          <a
            key={l.label}
            href={l.href}
            style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color var(--t)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            {l.label}
          </a>
        ))}
      </div>

    </div>
  );
}