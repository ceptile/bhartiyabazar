'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Sun, Moon, MapPin, PlusCircle, ChevronDown } from 'lucide-react'

const NAV_CATS = ['Restaurants','Electronics','Healthcare','Auto Services','Clothing','Home Services','Education','Real Estate']

export default function Header() {
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--bg)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-strong)' : 'var(--border)'}`,
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Main Row */}
      <div className="site-container">
        <div style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '16px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #f97316, #fbbf24)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '16px', color: '#fff',
              fontFamily: 'Georgia, serif',
              flexShrink: 0,
            }}>bB</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>BhartiyaBazar</span>
              <span style={{ fontSize: '10px', color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>India&apos;s Business Hub</span>
            </div>
          </Link>

          {/* Search Bar — Desktop */}
          <div style={{ flex: 1, maxWidth: 520, display: 'none' }} className="md-search">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--surface)',
              border: '1.5px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: 42,
            }}>
              {/* ✅ FIX: split border shorthand into borderStyle + borderWidth + borderColor, then override borderRight only */}
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '0 12px',
                borderStyle: 'none',
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'var(--border)',
                color: 'var(--text-3)',
                fontSize: '13px',
                flexShrink: 0,
                height: '100%',
                background: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                <MapPin size={13} color="var(--accent)" />
                <span>Delhi</span>
                <ChevronDown size={12} />
              </button>
              <input
                type="text"
                placeholder="Search businesses, services..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0 12px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: 'var(--text-1)',
                  height: '100%',
                }}
              />
              <button
                style={{
                  padding: '0 16px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <Link
              href="/register"
              className="btn btn-primary btn-list-biz"
              style={{ fontSize: '13px', padding: '8px 16px', display: 'none' }}
            >
              <PlusCircle size={14} />
              List Business
            </Link>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-2)',
                cursor: 'pointer',
                transition: 'all var(--dur) var(--ease)',
              }}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-2)',
                cursor: 'pointer',
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mobile-search" style={{ paddingBottom: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--surface)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: 42,
          }}>
            <input
              type="text"
              placeholder="Search businesses, services..."
              style={{
                flex: 1,
                padding: '0 14px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: 'var(--text-1)',
                height: '100%',
              }}
            />
            <button
              style={{
                padding: '0 16px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        overflowX: 'auto',
      }}>
        <div className="site-container">
          <div style={{ display: 'flex', gap: 4, height: 40, alignItems: 'center', overflowX: 'auto' }}>
            {NAV_CATS.map(cat => (
              <Link
                key={cat}
                href={`/search?cat=${cat.toLowerCase()}`}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--dur) var(--ease)',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.color = 'var(--accent)'
                  ;(e.target as HTMLElement).style.background = 'var(--accent-subtle)'
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.color = 'var(--text-2)'
                  ;(e.target as HTMLElement).style.background = 'transparent'
                }}
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/categories"
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              All <ChevronDown size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg)',
          padding: '16px',
        }}>
          <div className="site-container" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={() => setMenuOpen(false)}
            >
              <PlusCircle size={16} /> List Your Business — Free
            </Link>
            <Link
              href="/login"
              style={{ padding: '10px 16px', color: 'var(--text-2)', fontSize: '14px', borderRadius: 'var(--radius-md)' }}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              style={{ padding: '10px 16px', color: 'var(--text-2)', fontSize: '14px', borderRadius: 'var(--radius-md)' }}
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .md-search { display: block !important; }
          .mobile-search { display: none !important; }
        }
        @media (min-width: 640px) {
          .btn-list-biz { display: flex !important; }
        }
      `}</style>
    </header>
  )
}