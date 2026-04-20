'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

function Icon({ d, size = 18, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

function Stars({ r, size = 13 }: { r: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(r) ? 'var(--gold)' : 'none'}
          stroke={s <= Math.round(r) ? 'var(--gold)' : 'var(--border-strong)'}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Restaurants', value: 'Restaurants & Food' },
  { label: 'Electronics', value: 'Electronics & Repair' },
  { label: 'Health', value: 'Health & Doctors' },
  { label: 'Home Services', value: 'Home Services' },
  { label: 'Education', value: 'Education & Tutors' },
  { label: 'Salons', value: 'Salons & Beauty' },
  { label: 'Auto', value: 'Auto & Vehicles' },
  { label: 'Clothing', value: 'Clothing & Fashion' },
  { label: 'Grocery', value: 'Grocery & Kirana' },
  { label: 'Jewellery', value: 'Jewellery & Gifts' },
  { label: 'Real Estate', value: 'Real Estate' },
  { label: 'Events', value: 'Events & Catering' },
  { label: 'Fitness', value: 'Fitness & Gym' },
];

const CITIES = ['All Cities','Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];

const SORT_OPTIONS = [
  { label: 'Best Match', value: 'match' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
  { label: 'Newest', value: 'newest' },
];

type Business = {
  id: string;
  name: string;
  category: string;
  city: string;
  area: string;
  rating: number;
  reviewCount: number;
  description: string;
  phone: string;
  verified: boolean;
  slug: string;
  joinedAt: string;
};

function getRegisteredBusinesses(): Business[] {
  try {
    const users = JSON.parse(localStorage.getItem('bb_users_db') || '[]');
    return users
      .filter((u: { role: string; businessName?: string }) => u.role === 'business' && u.businessName)
      .map((u: { id: string; businessName: string; businessCategory?: string; city?: string; area?: string; phone?: string; businessSlug?: string; joinedAt?: string }) => ({
        id: u.id,
        name: u.businessName,
        category: u.businessCategory || 'Other',
        city: u.city || 'India',
        area: u.area || '',
        rating: 0,
        reviewCount: 0,
        description: 'A verified business on BhartiyaBazar.',
        phone: u.phone || '',
        verified: false,
        slug: u.businessSlug || u.id,
        joinedAt: u.joinedAt || new Date().toISOString(),
      }));
  } catch { return []; }
}

export default function SearchPage() {
  const [query, setQuery]       = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity]         = useState('');
  const [sort, setSort]         = useState('match');
  const [page, setPage]         = useState(1);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const PER_PAGE = 9;

  useEffect(() => {
    setBusinesses(getRegisteredBusinesses());
  }, []);

  const filtered = useMemo(() => {
    let list = [...businesses];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.area.toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter(b => b.category === category);
    if (city && city !== 'All Cities') list = list.filter(b => b.city === city);
    if (sort === 'rating')  list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'reviews') list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    if (sort === 'newest')  list = [...list].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
    return list;
  }, [businesses, query, category, city, sort]);

  const paginated   = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages  = Math.ceil(filtered.length / PER_PAGE);

  const inp: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border-hover)',
    borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: 14,
    color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)',
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>

      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(28px,5vw,48px) 0' }}>
        <div className="container">
          <span className="section-label">Business Directory</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.5rem)', color: 'var(--text-primary)', marginBottom: 8 }}>
            Find Businesses Across India
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 500 }}>
            {businesses.length > 0
              ? `${businesses.length} businesses listed`
              : 'Be the first to list your business — completely free'}
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 800 }}>
            <div style={{ flex: '2 1 240px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }}>
                <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={16} />
              </div>
              <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search businesses, services..."
                style={{ ...inp, width: '100%', paddingLeft: 38 }}
                onFocus={e => (e.target.style.borderColor = 'var(--info)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
            </div>
            <select value={city} onChange={e => { setCity(e.target.value); setPage(1); }}
              style={{ ...inp, flex: '1 1 140px', cursor: 'pointer' }}>
              {CITIES.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Sidebar filters */}
          <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }} className="hide-mobile">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Category</div>
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => { setCategory(c.value); setPage(1); }}
                style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: category === c.value ? 600 : 400, color: category === c.value ? 'var(--amber)' : 'var(--text-secondary)', background: category === c.value ? 'var(--amber-subtle)' : 'transparent', border: category === c.value ? '1px solid var(--amber-glow)' : '1px solid transparent', cursor: 'pointer', transition: 'all var(--t)' }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{filtered.length}</span> businesses found
                {(query || category || city) && (
                  <button onClick={() => { setQuery(''); setCategory(''); setCity(''); setPage(1); }}
                    style={{ marginLeft: 10, fontSize: 12, color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Clear filters
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sort:</span>
                {SORT_OPTIONS.map(s => (
                  <button key={s.value} onClick={() => setSort(s.value)}
                    style={{ padding: '5px 12px', borderRadius: 'var(--r-sm)', fontSize: 12, fontWeight: sort === s.value ? 600 : 400, color: sort === s.value ? 'var(--amber)' : 'var(--text-muted)', background: sort === s.value ? 'var(--amber-subtle)' : 'transparent', border: sort === s.value ? '1px solid var(--amber-glow)' : '1px solid transparent', cursor: 'pointer', transition: 'all var(--t)' }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile category chips */}
            <div className="show-mobile" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
              {CATEGORIES.slice(0, 8).map(c => (
                <button key={c.value} onClick={() => { setCategory(c.value); setPage(1); }}
                  className={`chip ${category === c.value ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Empty state */}
            {paginated.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" size={48} />
                </div>
                <h3>{businesses.length === 0 ? 'No businesses listed yet' : 'No businesses found'}</h3>
                <p>
                  {businesses.length === 0
                    ? 'BhartiyaBazar is growing. Be the first to list your business — completely free.'
                    : 'Try different keywords or clear your filters.'}
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link href="/register-business" className="btn btn-primary">List Your Business Free</Link>
                  {businesses.length > 0 && (
                    <button onClick={() => { setQuery(''); setCategory(''); setCity(''); }} className="btn btn-outline">
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Cards grid */}
            {paginated.length > 0 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                  {paginated.map((b, i) => (
                    <BusinessCard key={b.id} biz={b} delay={i * 50} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon d="M15 18l-6-6 6-6" size={14} /> Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                      .map(n => (
                        <button key={n} onClick={() => setPage(n)}
                          style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: n === page ? 700 : 400, background: n === page ? 'var(--amber)' : 'var(--surface)', border: `1px solid ${n === page ? 'var(--amber)' : 'var(--border)'}`, color: n === page ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}>
                          {n}
                        </button>
                      ))}
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                      className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      Next <Icon d="M9 18l6-6-6-6" size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessCard({ biz, delay }: { biz: Business; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--surface)', border: `1px solid ${hovered ? 'var(--amber-glow)' : 'var(--border)'}`, borderRadius: 'var(--r-lg)', padding: '20px', transition: 'all var(--t)', transform: hovered ? 'translateY(-2px)' : 'none', boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}
      className="anim-fadeUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--amber-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
          {biz.name.charAt(0)}
        </div>
        {biz.verified && (
          <span className="badge badge-success">
            <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" size={10} />
            Verified
          </span>
        )}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, fontFamily: 'var(--font-display)' }}>{biz.name}</h3>
      <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 500, marginBottom: 6 }}>{biz.category}</div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxWidth: '100%' }}>{biz.description}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {biz.rating > 0 ? (
          <>
            <Stars r={biz.rating} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{biz.rating.toFixed(1)}</span>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>({biz.reviewCount})</span>
          </>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>No reviews yet</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 14 }}>
        <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={12} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{biz.area ? `${biz.area}, ` : ''}{biz.city}</span>
      </div>

      <Link href={`/business/${biz.slug}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
        View Details
        <Icon d="M9 18l6-6-6-6" size={13} />
      </Link>
    </div>
  );
}