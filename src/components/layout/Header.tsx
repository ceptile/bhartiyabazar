'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'
import {
  Search, Menu, X, Sun, Moon, MapPin, ChevronDown,
  Bell, User, PlusCircle, Building2
} from 'lucide-react'

const categories = [
  'Restaurants', 'Electronics', 'Clothing', 'Auto Services',
  'Healthcare', 'Real Estate', 'Education', 'Home Services',
]

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('New Delhi')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'shadow-lg border-b'
          : 'border-b border-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? 'var(--surface)' : 'var(--background)',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
      }}
    >
      {/* Top Bar */}
      <div className="container-site">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex flex-col leading-none">
              <span
                className="font-garamond text-2xl font-bold tracking-tight"
                style={{ color: 'var(--accent)' }}
              >
                bB
              </span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="font-garamond text-lg font-semibold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                BhartiyaBazar
              </span>
              <span
                className="text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                India&apos;s Business Hub
              </span>
            </div>
          </Link>

          {/* Search Bar — center */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2">
            <div
              className="flex flex-1 items-center rounded-xl border overflow-hidden search-focus transition-all"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--border-strong)',
              }}
            >
              {/* Location */}
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm border-r shrink-0 hover:opacity-80 transition-opacity"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <MapPin size={14} style={{ color: 'var(--accent)' }} />
                <span className="max-w-[80px] truncate">{location}</span>
                <ChevronDown size={12} />
              </button>

              {/* Input */}
              <input
                type="text"
                placeholder="Search businesses, products, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-transparent outline-none"
                style={{ color: 'var(--text-primary)' }}
              />

              {/* Search Button */}
              <button
                className="px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                }}
              >
                <Search size={16} />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* List Business CTA */}
            <Link
              href="/register"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'var(--accent-subtle)',
                color: 'var(--accent)',
                border: '1px solid rgba(249,115,22,0.25)',
              }}
            >
              <PlusCircle size={15} />
              <span>List Business</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User */}
            <button
              className="p-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
              }}
              aria-label="User account"
            >
              <User size={18} />
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-all"
              style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div
            className="flex items-center rounded-xl border overflow-hidden"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border-strong)' }}
          >
            <input
              type="text"
              placeholder="Search businesses, products..."
              className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              className="px-4 py-2.5"
              style={{ background: 'var(--accent)', color: '#fff' }}
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div
        className="border-t hidden md:block"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="container-site">
          <div className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/search?category=${cat.toLowerCase()}`}
                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:opacity-80"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/categories"
              className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1"
              style={{ color: 'var(--accent)' }}
            >
              All Categories <ChevronDown size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="container-site py-4 flex flex-col gap-3">
            <Link
              href="/register"
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm"
              style={{ background: 'var(--accent)', color: '#fff' }}
              onClick={() => setMobileOpen(false)}
            >
              <PlusCircle size={16} />
              List Your Business — Free
            </Link>
            <Link href="/login" className="text-sm py-2" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileOpen(false)}>Login</Link>
            <Link href="/signup" className="text-sm py-2" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  )
}
