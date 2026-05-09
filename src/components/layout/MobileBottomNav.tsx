'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Heart, User, X, Menu } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',         label: 'Home',      icon: Home },
  { href: '/search',   label: 'Search',    icon: Search },
  { href: '/register', label: 'Add',        icon: PlusCircle, highlight: true },
  { href: '/listings', label: 'Listings',  icon: Heart },
  { href: '/profile',  label: 'Profile',    icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <div className="mobile-bottom-nav-inner">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {item.highlight ? (
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-warm-terracotta), #e8765a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(217, 119, 87, 0.4)',
                    transform: active ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 180ms ease',
                  }}>
                    <Icon size={22} color="#fff" />
                  </div>
                ) : (
                  <Icon size={22} />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMenuOpen(false)}
          style={{ display: 'block' }}
        />
      )}

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="mobile-menu-drawer" style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(31, 30, 29, 0.1)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-deep-charcoal)' }}>
              Bhartiya<span style={{ color: 'var(--color-warm-terracotta)' }}>Bazar</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                width: 36,
                height: 36,
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
              <X size={18} />
            </button>
          </div>

          {[
            { href: '/', label: 'Home', icon: Home },
            { href: '/listings', label: 'All Listings', icon: Search },
            { href: '/search', label: 'Search Businesses', icon: Search },
            { href: '/pricing', label: 'Pricing', icon: PlusCircle },
            { href: '/about', label: 'About Us', icon: User },
            { href: '/contact', label: 'Contact', icon: User },
            { href: '/dashboard', label: 'Dashboard', icon: User },
            { href: '/login', label: 'Sign In', icon: User },
            { href: '/register', label: 'Create Account', icon: PlusCircle },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-menu-drawer-item ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <div style={{ marginTop: 20, padding: '16px 0', borderTop: '1px solid rgba(31, 30, 29, 0.1)' }}>
            <Link
              href="/register"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '14px 20px',
                background: 'var(--color-warm-terracotta)',
                color: '#fff',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(217, 119, 87, 0.3)',
              }}
              onClick={() => setMenuOpen(false)}
            >
              <PlusCircle size={18} />
              List Your Business — Free
            </Link>
          </div>
        </div>
      )}

      {/* Hamburger button for opening drawer */}
      <button
        className="mobile-menu-trigger hide-mobile"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          bottom: 100,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--color-deep-charcoal)',
          color: '#fff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'all 180ms ease',
        }}
      >
        <Menu size={22} />
      </button>
    </>
  );
}