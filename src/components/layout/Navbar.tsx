'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

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
  const dropRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => { setDropOpen(false); }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        height: 84,
        padding: '0 40px',
        borderBottom: '1px solid rgba(31, 30, 29, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, lineHeight: 1, textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--color-deep-charcoal)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--color-warm-terracotta)' }}>Bazar</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }} className="hide-mobile">
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
                {/* Avatar button */}
                <button
                  onClick={() => setDropOpen(v => !v)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown */}
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
                    {/* User info */}
                    <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid rgba(31,30,29,0.08)', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-deep-charcoal)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-light-gray)' }}>{user.email}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-warm-terracotta)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                        {user.role === 'business' ? 'Business Account' : 'User Account'}
                      </div>
                    </div>

                    {/* Nav links */}
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

                    {/* Studio — admin only */}
                    {isAdmin && (
                      <>
                        <div style={{ borderTop: '1px solid rgba(31,30,29,0.08)', margin: '4px 0' }} />
                        <a href="/studio"
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 14, color: 'var(--color-warm-terracotta)', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-off-white)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={14} />
                          Studio
                        </a>
                      </>
                    )}

                    <div style={{ borderTop: '1px solid rgba(31,30,29,0.08)', margin: '4px 0' }} />
                    <button
                      onClick={() => { logout(); router.push('/'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 14, color: '#e01e5a', textDecoration: 'none', cursor: 'pointer', width: '100%', background: 'transparent', border: 'none', fontFamily: 'var(--font-body)', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-off-white)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost hide-mobile">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Sign In
                </Link>
                <Link href="/list-business" className="btn btn-accent">
                  List Business
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}