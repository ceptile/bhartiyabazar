'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Inline SVG icon helper — no emojis, no external deps
function Icon({ d, size = 18, strokeWidth = 1.75, style }: { d: string | string[]; size?: number; strokeWidth?: number; style?: React.CSSProperties }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={style}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// Logo SVG — geometric mark
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="BhartiyaBazar">
      <rect width="32" height="32" rx="8" fill="var(--amber)" />
      <path d="M8 22V10h5c2.2 0 3.5 1 3.5 2.8 0 1.1-.5 2-1.4 2.4 1.2.4 1.9 1.4 1.9 2.8C17 20.9 15.5 22 13 22H8zm3-7.4h1.8c.9 0 1.4-.4 1.4-1.2s-.5-1.2-1.4-1.2H11v2.4zm0 5h2c1 0 1.6-.5 1.6-1.4S14 17 13 17h-2v2.6zM19 22V10h3l4 6.5V10h3v12h-3l-4-6.5V22h-3z" fill="white" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/search',  label: 'Find Business' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about',   label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [theme, setTheme]         = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const initial = (document.documentElement.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light')) as 'light' | 'dark';
    setTheme(initial);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      transition: 'background var(--t), border-color var(--t), box-shadow var(--t)',
      background: scrolled ? 'var(--surface-glass)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    }}>
      <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <LogoMark size={34} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>
              India&apos;s Business Hub
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }} className="hide-mobile">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '6px 13px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 500,
              color: isActive(l.href) ? 'var(--amber)' : 'var(--text-secondary)',
              background: isActive(l.href) ? 'var(--amber-subtle)' : 'transparent',
              border: isActive(l.href) ? '1px solid var(--amber-glow)' : '1px solid transparent',
              transition: 'all var(--t)',
            }}>{l.label}</Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme"
            style={{
              width: 36, height: 36, borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)',
              background: 'transparent', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all var(--t)', cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-hover)'; }}
          >
            {theme === 'dark'
              ? <Icon d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3m15.36-5.64l-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={16} />
              : <Icon d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" size={16} />
            }
          </button>

          <Link href="/login" className="btn btn-outline btn-sm hide-mobile">Sign In</Link>
          <Link href="/register-business" className="btn btn-primary btn-sm hide-mobile">List Business</Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              display: 'none', width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'transparent',
              color: 'var(--text-primary)', cursor: 'pointer', transition: 'all var(--t)',
            }}
            className="show-mobile"
          >
            {menuOpen
              ? <Icon d={['M18 6L6 18', 'M6 6l12 12']} size={18} />
              : <Icon d={['M3 12h18', 'M3 6h18', 'M3 18h18']} size={18} />
            }
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          padding: '16px 20px 24px',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 15, fontWeight: 500,
                  color: isActive(l.href) ? 'var(--amber)' : 'var(--text-primary)',
                  background: isActive(l.href) ? 'var(--amber-subtle)' : 'transparent',
                }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
            <Link href="/register-business" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>List Business</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}