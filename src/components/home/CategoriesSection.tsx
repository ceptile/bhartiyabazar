import Link from 'next/link'

const categories = [
  { name: 'Restaurants & Food', icon: '🍛', count: '8,420', color: '#ef4444', href: '/search?cat=food' },
  { name: 'Electronics & Mobile', icon: '📱', count: '5,210', color: '#3b82f6', href: '/search?cat=electronics' },
  { name: 'Healthcare & Medical', icon: '🏥', count: '3,890', color: '#10b981', href: '/search?cat=health' },
  { name: 'Auto & Vehicles', icon: '🚗', count: '4,120', color: '#f59e0b', href: '/search?cat=auto' },
  { name: 'Education & Coaching', icon: '📚', count: '6,340', color: '#8b5cf6', href: '/search?cat=education' },
  { name: 'Clothing & Fashion', icon: '👗', count: '7,880', color: '#ec4899', href: '/search?cat=fashion' },
  { name: 'Home Services', icon: '🔧', count: '2,950', color: '#06b6d4', href: '/search?cat=home' },
  { name: 'Real Estate', icon: '🏠', count: '3,210', color: '#f97316', href: '/search?cat=realestate' },
  { name: 'Beauty & Salon', icon: '💅', count: '4,560', color: '#e879f9', href: '/search?cat=beauty' },
  { name: 'Sports & Fitness', icon: '🏋️', count: '1,870', color: '#84cc16', href: '/search?cat=sports' },
  { name: 'Travel & Tourism', icon: '✈️', count: '2,130', color: '#38bdf8', href: '/search?cat=travel' },
  { name: 'Finance & Banking', icon: '🏦', count: '1,560', color: '#a78bfa', href: '/search?cat=finance' },
]

export default function CategoriesSection() {
  return (
    <section className="py-20" style={{ background: 'var(--background)' }}>
      <div className="container-site">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Browse by Category</p>
            <h2 className="font-garamond font-bold" style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
              Explore All Business Types
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-medium hidden sm:block hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            View All →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(({ name, icon, count, color, href }) => (
            <Link
              key={name}
              href={href}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}18` }}
              >
                {icon}
              </div>
              <div>
                <p className="text-xs font-semibold leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{name}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{count} listed</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
