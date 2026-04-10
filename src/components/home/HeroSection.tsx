'use client'

import { useState, useRef } from 'react'
import { Search, MapPin, ChevronDown, Mic, TrendingUp, Zap, Shield } from 'lucide-react'

const trendingSearches = [
  'AC Repair', 'Mobile Shop', 'Restaurant Near Me',
  'Plumber', 'Electrician', 'Gym', 'Doctor',
]

const heroStats = [
  { icon: '🏪', value: '50,000+', label: 'Businesses' },
  { icon: '🌆', value: '500+', label: 'Cities' },
  { icon: '📦', value: '2 Lakh+', label: 'Products' },
  { icon: '⭐', value: '4.8/5', label: 'Avg Rating' },
]

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [location] = useState('New Delhi')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // suppress unused warning
  void inputRef

  return (
    <section
      className="relative overflow-hidden py-20 md:py-32"
      style={{ background: 'var(--background)' }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, var(--accent) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container-site relative z-10">
        <div className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              borderColor: 'rgba(249,115,22,0.3)',
            }}
          >
            <Zap size={12} />
            India&apos;s Fastest Growing Business Directory
          </span>
        </div>

        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1
            className="font-garamond font-bold leading-tight mb-4"
            style={{ fontSize: 'var(--text-3xl)', color: 'var(--text-primary)' }}
          >
            Find Any Business,
            <span className="gradient-text"> Anywhere in India</span>
          </h1>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Search verified businesses, compare prices, read real reviews.
            Free listings for every Indian business.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div
            className="flex items-stretch rounded-2xl overflow-hidden border-2 transition-all duration-300"
            style={{
              background: 'var(--surface-2)',
              borderColor: focused ? 'var(--accent)' : 'var(--border-strong)',
              boxShadow: focused ? '0 0 0 4px rgba(249,115,22,0.12)' : 'var(--shadow-md)',
            }}
          >
            <button
              className="flex items-center gap-2 px-4 py-4 border-r text-sm font-medium shrink-0 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
            >
              <MapPin size={16} style={{ color: 'var(--accent)' }} />
              <span className="hidden sm:inline max-w-[100px] truncate">{location}</span>
              <ChevronDown size={14} />
            </button>

            <input
              ref={inputRef}
              type="text"
              placeholder="Try: AC repair, mobile shop, restaurant..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="flex-1 px-4 py-4 bg-transparent text-base outline-none"
              style={{ color: 'var(--text-primary)' }}
            />

            <button
              className="px-3 transition-opacity hover:opacity-70 hidden sm:flex items-center"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Voice search"
            >
              <Mic size={18} />
            </button>

            <button
              className="flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <TrendingUp size={12} /> Trending:
            </span>
            {trendingSearches.map((s) => (
              <button
                key={s}
                className="px-3 py-1 rounded-full text-xs transition-all hover:opacity-80"
                style={{
                  background: 'var(--surface-3)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => setQuery(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {heroStats.map(({ icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 py-4 px-3 rounded-xl text-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <span className="text-2xl">{icon}</span>
              <span className="font-rajdhani font-bold text-lg" style={{ color: 'var(--accent)' }}>
                {value}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 mt-10">
          {[
            { icon: <Shield size={14} key="shield" />, text: 'Verified Businesses' },
            { icon: '🇮🇳', text: 'Made in India' },
            { icon: '🆓', text: '100% Free Listings' },
            { icon: '⚡', text: 'Real-time Updates' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent)' }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
