'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Find Business' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(8,12,20,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    }}>
      <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: 'var(--shadow-saffron)',
          }}>🏪</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1.1 }}>Bhartiya<span style={{ color: 'var(--saffron)' }}>Bazar</span></div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>INDIA'S BUSINESS HUB</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '7px 14px', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500,
              color: isActive(l.href) ? 'var(--saffron)' : 'var(--text-secondary)',
              textDecoration: 'none', transition: 'all var(--transition)',
              background: isActive(l.href) ? 'var(--saffron-glow)' : 'transparent',
            }}>{l.label}</Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/login" className="btn btn-outline btn-sm hide-mobile" style={{ textDecoration: 'none' }}>Login</Link>
          <Link href="/register" className="btn btn-saffron btn-sm" style={{ textDecoration: 'none' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            List Business
          </Link>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            className="hamburger"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--navy-2)', borderTop: '1px solid var(--border)',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fadeIn 0.2s ease',
        }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 15,
              color: isActive(l.href) ? 'var(--saffron)' : 'var(--text-secondary)',
              textDecoration: 'none', background: isActive(l.href) ? 'var(--saffron-glow)' : 'transparent',
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
            <Link href="/login" className="btn btn-outline" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="/register" className="btn btn-saffron" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>List Business</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
