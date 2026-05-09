'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, ChevronDown, PlusCircle } from 'lucide-react';

const ADMIN_EMAIL = 'ceptile.com@gmail.com';

function Icon({ d, size = 18 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/listings', label: 'Listings' },
  { href: '/pricing',  label: 'Pricing' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
];

export default function Navbar() {
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setDropOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActive  = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  const initials  = user?.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '';
  const isAdmin   = user?.email === ADMIN_EMAIL;

  const dropItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
    { href: '/profile',   label: 'My Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { href: '/settings',  label: 'Settings',   icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  ];

  return (
    <>
      <header style={{
        background: 'var(--color-off-white)',
        height: 60,
        padding: '0 16px',
        borderBottom: '1px solid rgba(31, 30, 29, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 1440, margin: '0 auto', width: '100%' }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, lineHeight: 1, textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-deep-charcoal)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--color-warm-terracotta)' }}>Bazar</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link ${isActive(l.href) ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative' }}>
            {user ? (
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--color-deep-charcoal)',
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-warm-terracotta)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>{initials}</div>
                  <span className="hide-mobile">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="hide-mobile" />
                </button>

                {dropOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 224,
                    background: '#fff',
                    border: '1px solid rgba(31, 30, 29, 0.15)',
                    borderRadius: 12,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)',
                    padding: '6px',
                    zIndex: 300,
                  }}>
                    <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid rgba(31,30,29,0.08)', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-deep-charcoal)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-light-gray)' }}>{user.email}</div>
                    </div>
                    {dropItems.map(item => (
                      <a key={item.href} href={item.href}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 14, color: 'var(--color-deep-charcoal)', textDecoration: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-off-white)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Icon d={item.icon} size={14} />
                        {item.label}
                      </a>
                    ))}
                    {isAdmin && (
                      <>
                        <div style={{ borderTop: '1px solid rgba(31,30,29,0.08)', margin: '4px 0' }} />
                        <a href="/studio"
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 14, color: 'var(--color-warm-terracotta)', fontWeight: 600, textDecoration: 'none' }}>
                          <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={14} />
                          Studio
                        </a>
                      </>
                    )}
                    <div style={{ borderTop: '1px solid rgba(31,30,29,0.08)', margin: '4px 0' }} />
                    <button
                      onClick={() => { logout(); router.push('/'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 14, color: '#e01e5a', cursor: 'pointer', width: '100%', background: 'transparent', border: 'none', fontFamily: 'var(--font-body)', textAlign: 'left' }}
                    >
                      <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost hide-mobile" style={{ height: 36, padding: '0 12px', fontSize: 13 }}>
                  Sign In
                </Link>
                <Link href="/list-business" className="btn btn-accent" style={{ height: 36, padding: '0 14px', fontSize: 13 }}>
                  <PlusCircle size={14} />
                  <span className="hide-mobile">List Business</span>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle menu"
              className="mobile-menu-btn"
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-off-white)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                cursor: 'pointer',
                color: 'var(--color-deep-charcoal)',
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '85%',
          maxWidth: 320,
          background: 'var(--color-pure-white)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.1)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(31, 30, 29, 0.1)',
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-deep-charcoal)' }}>
                Bhartiya<span style={{ color: 'var(--color-warm-terracotta)' }}>Bazar</span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-off-white)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* User info */}
          {user && (
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(31, 30, 29, 0.1)',
              background: 'var(--color-off-white)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--color-warm-terracotta)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-deep-charcoal)' }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-light-gray)' }}>{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 12px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  color: isActive(l.href) ? 'var(--color-warm-terracotta)' : 'var(--color-deep-charcoal)',
                  background: isActive(l.href) ? 'rgba(217, 119, 87, 0.08)' : 'transparent',
                  textDecoration: 'none',
                  marginBottom: 2,
                }}
              >
                {l.label}
              </Link>
            ))}

            <div style={{ borderTop: '1px solid rgba(31, 30, 29, 0.1)', margin: '12px 0' }}>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} style={drawerLinkStyle}>Dashboard</Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} style={drawerLinkStyle}>Profile</Link>
              <Link href="/settings" onClick={() => setMobileMenuOpen(false)} style={drawerLinkStyle}>Settings</Link>
              {isAdmin && <Link href="/studio" onClick={() => setMobileMenuOpen(false)} style={drawerLinkStyle}>Studio</Link>}
            </div>
          </nav>

          {/* CTA */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(31, 30, 29, 0.1)' }}>
            {user ? (
              <button
                onClick={() => { logout(); router.push('/'); }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(224, 30, 90, 0.08)',
                  color: '#e01e5a',
                  border: '1px solid rgba(224, 30, 90, 0.2)',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={16} />
                Sign Out
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', background: 'var(--color-warm-terracotta)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  <PlusCircle size={16} />
                  List Your Business — Free
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', background: 'var(--color-off-white)', color: 'var(--color-deep-charcoal)', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--border)' }}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

const drawerLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 12px',
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--color-medium-gray)',
  textDecoration: 'none',
  marginBottom: 2,
};