'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function Icon({ d, size = 18, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
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

const dropRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 16px', fontSize: 13,
  color: 'var(--text-secondary)', background: 'transparent',
  width: '100%', border: 'none', cursor: 'pointer',
  textDecoration: 'none', transition: 'background var(--t)',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pathname                = usePathname();
  const router                  = useRouter();
  const { user, logout }        = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDropOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const initials = user?.name
    .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '';

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
        <div className="container" style={{
          height: 64, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, lineHeight: 1, textDecoration: 'none' }}>
            <div style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontWeight: 700, fontSize: 22,
              color: 'var(--text-primary)', letterSpacing: '-0.02em',
            }}>
              Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '6px 13px', borderRadius: 'var(--r-md)',
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
                color: isActive(l.href) ? 'var(--amber)' : 'var(--text-secondary)',
                background: isActive(l.href) ? 'var(--amber-subtle)' : 'transparent',
                border: isActive(l.href) ? '1px solid var(--amber-glow)' : '1px solid transparent',
                transition: 'all var(--t)',
              }}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropOpen(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '4px 8px 4px 4px', borderRadius: 'var(--r-full)',
                    border: '1px solid var(--border-hover)',
                    background: 'var(--surface)', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--amber)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {initials}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <Icon d="M6 9l6 6 6-6" size={14} />
                </button>

                {dropOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: 230, background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
                    boxShadow: 'var(--shadow-lg)', padding: '8px 0', zIndex: 300,
                  }}>
                    {/* User info */}
                    <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                      <div style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                        {user.role === 'business' ? 'Business Account' : 'User Account'}
                      </div>
                    </div>

                    {/* List / Manage Business CTA — fixed href */}
                    <div style={{ padding: '8px 10px 4px' }}>
                      <Link
                        href="/register-business"
                        onClick={() => setDropOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 12px', borderRadius: 'var(--r-md)',
                          background: 'var(--amber)', color: '#fff',
                          fontSize: 13, fontWeight: 600, textDecoration: 'none',
                        }}
                      >
                        <Icon d="M12 5v14 M5 12h14" size={14} sw={2.5} />
                        {user.role === 'business' ? 'Manage My Business' : 'List My Business'}
                      </Link>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--border)', margin: '4px 0' }} />

                    {[
                      { href: '/dashboard', label: 'Dashboard',  icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
                      { href: '/profile',   label: 'My Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                      { href: '/settings',  label: 'Settings',   icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
                    ].map(item => (
                      <Link
                        key={item.href} href={item.href}
                        onClick={() => setDropOpen(false)}
                        style={dropRow}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Icon d={item.icon} size={14} />{item.label}
                      </Link>
                    ))}

                    <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

                    <button
                      onClick={() => { logout(); router.push('/'); setDropOpen(false); }}
                      style={{ ...dropRow, color: 'var(--crimson)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in — Sign In + List Business */
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link
                  href="/login"
                  style={{
                    padding: '7px 16px', borderRadius: 'var(--r-md)',
                    fontSize: 13, fontWeight: 500, textDecoration: 'none',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)', background: 'transparent',
                    transition: 'all var(--t)',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register-business"
                  style={{
                    padding: '7px 16px', borderRadius: 'var(--r-md)',
                    fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    background: 'var(--amber)', color: '#fff',
                    border: '1px solid var(--amber)',
                    transition: 'all var(--t)',
                  }}
                >
                  List Business
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {dropOpen && (
        <div
          onClick={() => setDropOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 199 }}
        />
      )}
    </>
  );
}