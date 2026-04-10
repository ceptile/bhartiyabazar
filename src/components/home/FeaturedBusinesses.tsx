'use client'

import { MapPin, Star, Phone, MessageCircle, BadgeCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const BIZ = [
  {
    id: 1, name: 'Sharma Electronics', category: 'Electronics', location: 'Karol Bagh, Delhi',
    rating: 4.8, reviews: 324, phone: '+919876543210',
    tag: 'featured', tagLabel: '⭐ Featured', tagColor: '#f97316',
    trustScore: 96, desc: 'Authorized dealer for Samsung, Sony & LG. Repair services available.',
    emoji: '📱', distance: '1.2 km', bgColor: '#3b82f620',
  },
  {
    id: 2, name: 'Punjabi Dhaba', category: 'Restaurant', location: 'Lajpat Nagar, Delhi',
    rating: 4.6, reviews: 891, phone: '+918765432109',
    tag: 'verified', tagLabel: '✅ Verified', tagColor: '#16a34a',
    trustScore: 92, desc: 'Authentic Punjabi food since 1985. Dal Makhani & Butter Chicken.',
    emoji: '🍛', distance: '0.8 km', bgColor: '#f9731620',
  },
  {
    id: 3, name: 'Dr. Mehta Clinic', category: 'Healthcare', location: 'Saket, Delhi',
    rating: 4.9, reviews: 567, phone: '+917654321098',
    tag: 'new', tagLabel: '🆕 New', tagColor: '#2563eb',
    trustScore: 98, desc: 'General physician, 15+ years experience. Open 7 days a week.',
    emoji: '🏥', distance: '2.1 km', bgColor: '#10b98120',
  },
]

export default function FeaturedBusinesses() {
  return (
    <section style={{ background: 'var(--surface)', padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 6 }}>Top Picks</p>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Featured Businesses</h2>
          </div>
          <Link href="/search" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>View All <ChevronRight size={16} /></Link>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {BIZ.map(b => (
            <div
              key={b.id}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              {/* Card Top */}
              <div style={{
                height: 130,
                background: b.bgColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 56,
                position: 'relative',
              }}>
                {b.emoji}
                {/* Tag */}
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: `${b.tagColor}20`,
                  color: b.tagColor,
                  border: `1px solid ${b.tagColor}40`,
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                  fontSize: '11px', fontWeight: 700,
                }}>{b.tagLabel}</span>
                {/* Trust score */}
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 8px',
                  fontSize: '11px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 3,
                }}><BadgeCheck size={11} /> {b.trustScore}%</span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{
                  display: 'inline-block',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 10px',
                  fontSize: '11px', fontWeight: 600,
                  marginBottom: 8, alignSelf: 'flex-start',
                }}>{b.category}</span>

                <Link href={`/business/${b.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginBottom: 4, lineHeight: 1.3 }}>{b.name}</h3>
                </Link>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5, flex: 1, marginBottom: 12 }}>{b.desc}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text-3)' }}>
                    <MapPin size={12} color="var(--accent)" />
                    {b.location}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>📍 {b.distance}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
                  <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{b.rating}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>({b.reviews} reviews)</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`tel:${b.phone}`}
                    onClick={e => e.stopPropagation()}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      padding: '9px 0',
                      background: 'var(--accent)', color: '#fff',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px', fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  >
                    <Phone size={13} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${b.phone.replace(/\D/g,'')}`}
                    onClick={e => e.stopPropagation()}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      padding: '9px 0',
                      background: '#25D366', color: '#fff',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px', fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
