'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { businesses, categories } from '@/lib/data';

const CITIES = ['All Cities','Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida'];
const RATINGS = ['Any Rating','4.5+ Stars','4.0+ Stars','3.5+ Stars'];

function Stars({ r }: { r: number }) {
  return <span>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r ? 'var(--gold)' : 'var(--border-strong)', fontSize: 12 }}>★</span>)}</span>;
}

export default function SearchPageClient() {
  const [query, setQuery]   = useState('');
  const [city, setCity]     = useState('All Cities');
  const [cat, setCat]       = useState('');
  const [rating, setRating] = useState('Any Rating');
  const [sort, setSort]     = useState('relevance');
  const [verified, setVerified] = useState(false);
  const [openNow, setOpenNow]   = useState(false);

  const filtered = useMemo(() => {
    let res = [...businesses];
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.area.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q)
      );
    }
    if (city !== 'All Cities') res = res.filter(b => b.city === city);
    if (cat) res = res.filter(b => b.categorySlug === cat);
    if (verified) res = res.filter(b => b.verified);
    if (openNow) res = res.filter(b => b.openNow);
    if (rating === '4.5+ Stars') res = res.filter(b => b.rating >= 4.5);
    if (rating === '4.0+ Stars') res = res.filter(b => b.rating >= 4.0);
    if (rating === '3.5+ Stars') res = res.filter(b => b.rating >= 3.5);
    if (sort === 'rating') res.sort((a,b) => b.rating - a.rating);
    else if (sort === 'reviews') res.sort((a,b) => b.reviewCount - a.reviewCount);
    else if (sort === 'trust') res.sort((a,b) => b.trustScore - a.trustScore);
    else res.sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return res;
  }, [query, city, cat, rating, sort, verified, openNow]);

  const selInp: React.CSSProperties = { padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>
      {/* Search header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--text-primary)', marginBottom: 16 }}>Find Businesses</h1>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search businesses, categories, services…"
                style={{ width: '100%', padding: '11px 16px 11px 40px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = 'var(--amber)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')}
              />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}>🔍</span>
            </div>
            <select style={selInp} value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select style={selInp} value={cat} onChange={e => setCat(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          {/* Filters row */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <select style={selInp} value={rating} onChange={e => setRating(e.target.value)}>
              {RATINGS.map(r => <option key={r}>{r}</option>)}
            </select>
            <select style={selInp} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="reviews">Sort: Most Reviews</option>
              <option value="trust">Sort: Trust Score</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} /> Verified Only
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={openNow} onChange={e => setOpenNow(e.target.checked)} /> Open Now
            </label>
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} results</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 56 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>No businesses found</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Try adjusting your search terms or filters.</p>
            <button onClick={() => { setQuery(''); setCity('All Cities'); setCat(''); setRating('Any Rating'); setVerified(false); setOpenNow(false); }}
              style={{ marginTop: 20, padding: '8px 20px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(b => (
              <Link key={b.id} href={`/business/${b.slug}`} style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '18px 20px', transition: 'all var(--t)', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--amber-glow)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Image */}
                  {b.images[0] && (
                    <img src={b.images[0]} alt={b.name} width={80} height={80} loading="lazy"
                      style={{ width: 80, height: 80, borderRadius: 'var(--r-md)', objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontSize: 'clamp(14px,1.5vw,16px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, fontFamily: 'inherit' }}>{b.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.category}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>•</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.area}, {b.city}</span>
                          {b.verified && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600 }}>✓ Verified</span>}
                          {b.openNow && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600 }}>Open Now</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Stars r={Math.round(b.rating)} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{b.rating}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.reviewCount} reviews</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, maxWidth: '100%', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.shortDesc}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {b.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber-dark)', fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}