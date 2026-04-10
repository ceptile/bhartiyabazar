import Link from 'next/link'

const CATS = [
  { name: 'Restaurants & Food',    icon: '🍛', count: '8,420', color: '#ef4444', href: '/search?cat=food' },
  { name: 'Electronics & Mobile',  icon: '📱', count: '5,210', color: '#3b82f6', href: '/search?cat=electronics' },
  { name: 'Healthcare & Medical',  icon: '🏥', count: '3,890', color: '#10b981', href: '/search?cat=health' },
  { name: 'Auto & Vehicles',       icon: '🚗', count: '4,120', color: '#f59e0b', href: '/search?cat=auto' },
  { name: 'Education & Coaching',  icon: '📚', count: '6,340', color: '#8b5cf6', href: '/search?cat=education' },
  { name: 'Clothing & Fashion',    icon: '👗', count: '7,880', color: '#ec4899', href: '/search?cat=fashion' },
  { name: 'Home Services',         icon: '🔧', count: '2,950', color: '#06b6d4', href: '/search?cat=home' },
  { name: 'Real Estate',           icon: '🏠', count: '3,210', color: '#f97316', href: '/search?cat=realestate' },
  { name: 'Beauty & Salon',        icon: '💅', count: '4,560', color: '#e879f9', href: '/search?cat=beauty' },
  { name: 'Sports & Fitness',      icon: '🏋️', count: '1,870', color: '#84cc16', href: '/search?cat=sports' },
  { name: 'Travel & Tourism',      icon: '✈️', count: '2,130', color: '#38bdf8', href: '/search?cat=travel' },
  { name: 'Finance & Banking',     icon: '🏦', count: '1,560', color: '#a78bfa', href: '/search?cat=finance' },
]

export default function CategoriesSection() {
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 6 }}>Browse by Category</p>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Explore All Business Types</h2>
          </div>
          <Link href="/categories" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>View All →</Link>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {CATS.map(({ name, icon, count, color, href }) => (
            <Link
              key={name}
              href={href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 10, padding: '20px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                transition: 'all 0.2s var(--ease)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = 'var(--shadow-lg)'
                el.style.borderColor = color
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = ''
                el.style.boxShadow = ''
                el.style.borderColor = 'var(--border)'
              }}
            >
              <div style={{
                width: 52, height: 52,
                borderRadius: 'var(--radius-lg)',
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
                transition: 'transform 0.2s',
              }}>{icon}</div>
              <div>
                <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3, marginBottom: 2 }}>{name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>{count} listed</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
