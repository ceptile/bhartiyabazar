'use client'

import { useState } from 'react'
import { Search, MapPin, ChevronDown, Mic, TrendingUp, Zap, Shield, Star } from 'lucide-react'

const TRENDING = ['AC Repair','Mobile Shop','Restaurant','Plumber','Electrician','Gym','Doctor','CA Services']

const STATS = [
  { v: '50K+', l: 'Businesses' },
  { v: '500+', l: 'Cities' },
  { v: '2L+',  l: 'Products' },
  { v: '4.8',  l: 'Avg Rating' },
]

export default function HeroSection() {
  const [query, setQuery]   = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <section style={{ background: 'var(--bg)', paddingTop: 'clamp(48px,8vw,96px)', paddingBottom: 'clamp(48px,8vw,96px)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle bg glow */}
      <div aria-hidden style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '70vw', height: '60vh', background: 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Pill Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--accent-subtle)',
            border: '1px solid rgba(249,115,22,0.25)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 14px',
            fontSize: '12px', fontWeight: 600,
          }}>
            <Zap size={11} /> India&apos;s Fastest Growing Business Directory
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          textAlign: 'center',
          fontSize: 'var(--text-3xl)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 16,
          color: 'var(--text-1)',
          fontFamily: 'var(--font-eb-garamond), Georgia, serif',
        }}>
          Find Any Business,<br />
          <span className="gradient-text">Anywhere in India</span>
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 'var(--text-md)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Search verified businesses, compare prices &amp; read real reviews.
          <strong style={{ color: 'var(--accent)' }}> 100% Free</strong> listings for every Indian business.
        </p>

        {/* Search Box */}
        <div style={{ maxWidth: 680, margin: '0 auto 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            background: 'var(--bg)',
            border: `2px solid ${focused ? 'var(--accent)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: focused ? `0 0 0 4px var(--accent-glow), var(--shadow-md)` : 'var(--shadow-md)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            {/* Location picker */}
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '0 14px',
              background: 'none', border: 'none',
              borderRight: '1px solid var(--border-strong)',
              color: 'var(--text-2)', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
            }}>
              <MapPin size={14} color="var(--accent)" />
              <span>Delhi</span>
              <ChevronDown size={12} />
            </button>

            {/* Input */}
            <input
              type="text"
              placeholder="Try: AC repair, mobile shop, restaurant near me..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ flex: 1, padding: '16px', background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', color: 'var(--text-1)', minWidth: 0 }}
            />

            {/* Mic */}
            <button style={{ padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }} aria-label="Voice search">
              <Mic size={17} />
            </button>

            {/* Search Btn */}
            <button
              className="btn btn-primary"
              style={{ borderRadius: 0, padding: '0 24px', fontSize: '15px', boxShadow: 'none', gap: 8 }}
            >
              <Search size={17} />
              <span>Search</span>
            </button>
          </div>

          {/* Trending tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text-3)', flexShrink: 0 }}>
              <TrendingUp size={12} /> Trending:
            </span>
            {TRENDING.map(t => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                style={{
                  padding: '4px 12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px', fontWeight: 500,
                  color: 'var(--text-2)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px,4vw,48px)', marginTop: 40, flexWrap: 'wrap' }}>
          {STATS.map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: 4, fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Trust pills */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20, marginTop: 28 }}>
          {[
            { icon: <Shield size={13} />, t: 'Verified Businesses' },
            { icon: '🇮🇳', t: 'Made in India' },
            { icon: '🆓', t: '100% Free Listings' },
            { icon: <Star size={13} />, t: 'Real Reviews' },
          ].map(({ icon, t }) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
              <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{icon}</span> {t}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
