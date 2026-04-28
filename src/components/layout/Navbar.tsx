'use client';
import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [pathname]);

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
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'var(--surface-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all var(--t)',
      }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, lineHeight: 1, textDecoration: 'none' }}>
            <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
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
                transition: 'all var(--t)', textDecoration: 'none',
              }}>{l.label}</Link>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                {/* Avatar button */}
                <button onClick={() => setDropOpen(p => !p)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 8px 4px 4px', borderRadius: 'var(--r-full)',
                  border: '1px solid var(--border-hover)', background: 'var(--surface)', cursor: 'pointer',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{initials}</div>
                  <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</span>
                  <Icon d="M6 9l6 6 6-6" size={14} />
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 220, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', padding: '8px 0', zIndex: 300 }}>
                    {/* User info header */}
                    <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                      <div style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                        {user.role === 'business' ? 'Business Account' : 'User Account'}
                      </div>
                    </div>

                    {/* Standard nav items */}
                    {dropItems.map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setDropOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <Icon d={item.icon} size={14} />{item.label}
                      </Link>
                    ))}

                    {/* Studio link — admin only */}
                    {isAdmin && (
                      <>
                        <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                        <Link href="/studio" onClick={() => setDropOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', fontSize: 13, color: 'var(--amber)', textDecoration: 'none', fontWeight: 600 }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--amber-subtle)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={14} />
                          Studio
                        </Link>
                      </>
                    )}

                    <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                    {/* Sign out */}
                    <button onClick={() => { logout(); router.push('/'); setDropOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 16px', fontSize: 13, color: 'var(--crimson)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hide-mobile" style={{ padding: '7px 16px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 500, border: '1px solid var(--border-strong)', color: 'var(--text-primary)', background: 'transparent', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Sign In
                </Link>
                <Link href="/list-business" style={{ padding: '7px 16px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 600, background: 'var(--amber)', color: '#fff', border: '1px solid var(--amber)', textDecoration: 'none' }}>
                  List Business
                </Link>
              </>
            )}
            <button onClick={() => setMenuOpen(p => !p)} aria-label="Menu" className="show-mobile"
              style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'transparent', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon d={menuOpen ? 'M18 6L6 18 M6 6l12 12' : 'M3 12h18 M3 6h18 M3 18h18'} size={18} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, fontWeight: 500, color: isActive(l.href) ? 'var(--amber)' : 'var(--text-primary)', background: isActive(l.href) ? 'var(--amber-subtle)' : 'transparent', textDecoration: 'none' }}>{l.label}</Link>
            ))}
            {!user ? (
              <Link href="/login" style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign in with Google
              </Link>
            ) : (
              <>
                <Link href="/dashboard" style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>Dashboard</Link>
                {isAdmin && (
                  <Link href="/studio" style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={15} />
                    Studio
                  </Link>
                )}
                <button onClick={() => { logout(); router.push('/'); }} style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--crimson)', fontWeight: 500, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
              </>
            )}
          </div>
        )}
      </header>
      {dropOpen && <div onClick={() => setDropOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />}
    </>
  );
}