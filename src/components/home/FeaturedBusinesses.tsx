import { MapPin, Star, Phone, MessageCircle, BadgeCheck } from 'lucide-react'
import Link from 'next/link'

const businesses = [
  {
    id: 1,
    name: 'Sharma Electronics',
    category: 'Electronics',
    location: 'Karol Bagh, Delhi',
    rating: 4.8,
    reviews: 324,
    phone: '+91 98765 43210',
    tag: 'featured',
    tagLabel: '⭐ Featured',
    trustScore: 96,
    description: 'Authorized dealer for Samsung, Sony & LG. Repair services available.',
    image: '📱',
    distance: '1.2 km',
  },
  {
    id: 2,
    name: 'Punjabi Dhaba',
    category: 'Restaurant',
    location: 'Lajpat Nagar, Delhi',
    rating: 4.6,
    reviews: 891,
    phone: '+91 87654 32109',
    tag: 'verified',
    tagLabel: '✅ Verified',
    trustScore: 92,
    description: 'Authentic Punjabi food since 1985. Try our Dal Makhani & Butter Chicken.',
    image: '🍛',
    distance: '0.8 km',
  },
  {
    id: 3,
    name: 'Dr. Mehta Clinic',
    category: 'Healthcare',
    location: 'Saket, Delhi',
    rating: 4.9,
    reviews: 567,
    phone: '+91 76543 21098',
    tag: 'new',
    tagLabel: '🆕 New',
    trustScore: 98,
    description: 'General physician with 15+ years experience. Open 7 days.',
    image: '🏥',
    distance: '2.1 km',
  },
]

const tagStyles: Record<string, { bg: string; color: string }> = {
  featured: { bg: 'rgba(249,115,22,0.15)', color: 'var(--accent)' },
  verified: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  new:      { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
}

export default function FeaturedBusinesses() {
  return (
    <section className="py-20" style={{ background: 'var(--surface)' }}>
      <div className="container-site">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Top Picks</p>
            <h2 className="font-garamond font-bold" style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
              Featured Businesses
            </h2>
          </div>
          <Link href="/search" className="text-sm font-medium hidden sm:block hover:opacity-80" style={{ color: 'var(--accent)' }}>View All →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <Link
              key={biz.id}
              href={`/business/${biz.id}`}
              className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 card-hover"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            >
              <div
                className="relative flex items-center justify-center h-40 text-7xl"
                style={{ background: 'var(--surface-2)' }}
              >
                {biz.image}
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={tagStyles[biz.tag]}
                >
                  {biz.tagLabel}
                </span>
                <span
                  className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                >
                  <BadgeCheck size={11} /> {biz.trustScore}%
                </span>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <div className="mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
                  >
                    {biz.category}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-1 group-hover:text-orange-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {biz.name}
                </h3>
                <p className="text-sm flex-1 mb-3" style={{ color: 'var(--text-muted)' }}>{biz.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={12} style={{ color: 'var(--accent)' }} />
                    {biz.location}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>📍 {biz.distance}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{biz.rating}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({biz.reviews} reviews)</span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <a
                    href={`tel:${biz.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    <Phone size={13} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${biz.phone.replace(/\D/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                    style={{ background: '#25D366', color: '#fff' }}
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
