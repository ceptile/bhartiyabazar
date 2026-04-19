'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>('dark');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('bb-theme');
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme((stored as 'light'|'dark') || sys);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('bb-theme', next); } catch(_e){}
  };

  const openSearch = () => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Search' },
    { href: '/categories', label: 'Categories' },
    { href: '/register-business', label: 'List Business', highlight: true },
  ];

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'80px 16px 0' }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{ width:'100%', maxWidth:640, background:'var(--surface)', borderRadius:'var(--radius-xl)', padding:24, boxShadow:'var(--shadow-xl)', border:'1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
            className="animate-scaleIn"
          >
            <form action="/search" method="get">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color:'var(--text-muted)', flexShrink:0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={searchRef}
                  name="q"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search businesses, products, services..."
                  style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:18, color:'var(--text)' }}
                />
                <button type="button" onClick={() => setSearchOpen(false)} style={{ color:'var(--text-muted)', fontSize:20, lineHeight:1 }}>✕</button>
              </div>
              <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)' }}>
                <p style={{ fontSize:12, color:'var(--text-faint)', marginBottom:8, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase' }}>Quick searches</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {['AC Repair','Restaurant near me','Mobile shop','Doctor','Tutor'].map(q => (
                    <Link key={q} href={`/search?q=${encodeURIComponent(q)}`} onClick={() => setSearchOpen(false)}
                      style={{ padding:'6px 14px', background:'var(--surface-2)', borderRadius:'var(--radius-full)', fontSize:13, color:'var(--text-muted)', border:'1px solid var(--border)', transition:'all 0.2s' }}
                    >{q}</Link>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: scrolled ? 'var(--surface)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div className="container" style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{
              width:36, height:36, borderRadius:'var(--radius-md)',
              background:'linear-gradient(135deg, var(--saffron), var(--saffron-light))',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 12px rgba(255,107,0,0.3)', flexShrink:0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <path d="M8 11h6M11 8v6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--text)', letterSpacing:'-0.02em' }}>Bhartiya<span style={{ color:'var(--saffron)' }}>Bazar</span></span>
              <div style={{ fontSize:9, color:'var(--text-faint)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:-2 }}>India&apos;s Business Search</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 14,
                  fontWeight: link.highlight ? 600 : 500,
                  color: link.highlight ? '#fff' : pathname === link.href ? 'var(--saffron)' : 'var(--text-muted)',
                  background: link.highlight ? 'linear-gradient(135deg, var(--saffron), var(--saffron-light))' : pathname === link.href ? 'var(--surface-2)' : 'transparent',
                  transition: 'all 0.2s',
                  boxShadow: link.highlight ? '0 4px 12px rgba(255,107,0,0.25)' : 'none',
                  textDecoration: 'none',
                }}
              >{link.label}</Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button
              onClick={openSearch}
              style={{ width:36, height:36, borderRadius:'var(--radius-full)', background:'var(--surface-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', transition:'all 0.2s' }}
              aria-label="Search"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              style={{ width:36, height:36, borderRadius:'var(--radius-full)', background:'var(--surface-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', transition:'all 0.2s' }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ width:36, height:36, borderRadius:'var(--radius-full)', background:'var(--surface-2)', border:'1px solid var(--border)', display:'none', alignItems:'center', justifyContent:'center', color:'var(--text)', transition:'all 0.2s' }}
              aria-label="Menu"
              className="mobile-menu-btn"
            >
              {menuOpen ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div style={{
            position:'absolute', top:64, left:0, right:0,
            background:'var(--surface)',
            borderBottom:'1px solid var(--border)',
            padding:'16px',
            boxShadow:'var(--shadow-lg)',
          }} className="animate-fadeUp">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{
                  display:'block', padding:'12px 16px',
                  borderRadius:'var(--radius-md)',
                  fontSize:15, fontWeight:500,
                  color: link.highlight ? 'var(--saffron)' : 'var(--text)',
                  marginBottom:4,
                }}
              >{link.label}</Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 768px) { .mobile-menu-btn { display: none !important; } }
        @media (max-width: 767px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } }
      `}</style>
    </>
  );
}