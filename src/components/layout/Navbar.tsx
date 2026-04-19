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

// EB Garamond "bB" logo — lowercase b + uppercase B
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="BhartiyaBazar logo">
      <rect width="40" height="40" rx="10" fill="var(--amber)" />
      <text x="4" y="29"
        fontFamily="'EB Garamond', Georgia, serif"
        fontWeight="700" fontSize="22" fill="white" letterSpacing="-1">
        bB
      </text>
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [theme, setTheme]       = useState<'light'|'dark'>('light');
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const mq   = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = document.documentElement.getAttribute('data-theme');
    setTheme((saved || (mq.matches ? 'dark' : 'light')) as 'light'|'dark');
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [pathname]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '';

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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <LogoMark size={36} />
            <div>
              <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
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
            <button onClick={toggleTheme} aria-label="Toggle theme" style={{
              width: 36, height: 36, borderRadius: 'var(--r-md)',
              border: '1px solid var(--border-hover)', background: 'transparent',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: 'all var(--t)',
            }}>
              <Icon d={theme === 'dark'
                ? 'M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'
                : 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
              } size={16} />
            </button>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropOpen(p => !p)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 8px 4px 4px', borderRadius: 'var(--r-full)',
                  border: '1px solid var(--border-hover)', background: 'var(--surface)', cursor: 'pointer',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{initials}</div>
                  <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</span>
                  <Icon d="M6 9l6 6 6-6" size={14} />
                </button>

                {dropOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 220, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', padding: '8px 0', zIndex: 300 }}>
                    <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                      <div style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                        {user.role === 'business' ? 'Business Account' : 'User Account'}
                      </div>
                    </div>
                    {[
                      { href: '/dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
                      { href: '/profile', label: 'My Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setDropOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <Icon d={item.icon} size={14} />{item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                    <button onClick={() => { logout(); router.push('/'); setDropOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 16px', fontSize: 13, color: 'var(--crimson)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hide-mobile" style={{ padding: '7px 16px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 500, border: '1px solid var(--border-strong)', color: 'var(--text-primary)', background: 'transparent' }}>Sign In</Link>
                <Link href="/register-business" style={{ padding: '7px 16px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 600, background: 'var(--amber)', color: '#fff', border: '1px solid var(--amber)' }}>List Business</Link>
              </>
            )}

            <button onClick={() => setMenuOpen(p => !p)} aria-label="Menu" className="show-mobile"
              style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'transparent', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={menuOpen ? 'M18 6L6 18 M6 6l12 12' : 'M3 12h18 M3 6h18 M3 18h18'} size={18} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, fontWeight: 500, color: isActive(l.href) ? 'var(--amber)' : 'var(--text-primary)', background: isActive(l.href) ? 'var(--amber-subtle)' : 'transparent' }}>{l.label}</Link>
            ))}
            {!user ? <>
              <Link href="/login" style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>Sign In</Link>
              <Link href="/register" style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>Create Account</Link>
            </> : <>
              <Link href="/dashboard" style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>Dashboard</Link>
              <button onClick={() => { logout(); router.push('/'); }} style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--crimson)', fontWeight: 500, textAlign: 'left' }}>Sign Out</button>
            </>}
          </div>
        )}
      </header>
      {dropOpen && <div onClick={() => setDropOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />}
    </>
  );
}