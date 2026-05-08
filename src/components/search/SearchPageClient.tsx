'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { businesses, categories } from '@/lib/data';

const CITIES = ['All Cities','Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida'];
const RATINGS = ['Any Rating','4.5+ Stars','4.0+ Stars','3.5+ Stars'];

function Stars({ r }: { r: number }) {
  return <span>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r ? 'var(--color-warm-terracotta)' : 'var(--color-muted-border)', fontSize: 12 }}>★</span>)}</span>;
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

  const selInp: React.CSSProperties = { padding: '8px 12px', borderRadius: 'var(--radius-generous)', border: '1px solid var(--color-muted-border)', background: 'var(--color-pure-white)', color: 'var(--color-deep-charcoal)', fontSize: 13, outline: 'none', cursor: 'pointer', height: 40 };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-off-white)', paddingTop: 84 }}>
      {/* Search header */}
      <div style={{ background: 'var(--color-pure-white)', borderBottom: '1px solid var(--color-muted-border)', padding: '24px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--color-deep-charcoal)', marginBottom: 16 }}>Find Businesses</h1>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search businesses, categories, services…"
                className="input"
                style={{ paddingLeft: 40 }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-deep-charcoal)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-muted-border)')}
              />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-light-gray)', fontSize: 16 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </span>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-medium-gray)', cursor: 'pointer' }}>
              <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} /> Verified Only
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-medium-gray)', cursor: 'pointer' }}>
              <input type="checkbox" checked={openNow} onChange={e => setOpenNow(e.target.checked)} /> Open Now
            </label>
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-light-gray)' }}>{filtered.length} results</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 56 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-light-gray)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <h3 style={{ fontSize: 18, color: 'var(--color-deep-charcoal)', marginBottom: 8 }}>No businesses found</h3>
            <p style={{ fontSize: 14, color: 'var(--color-light-gray)' }}>Try adjusting your search terms or filters.</p>
            <button onClick={() => { setQuery(''); setCity('All Cities'); setCat(''); setRating('Any Rating'); setVerified(false); setOpenNow(false); }}
              className="btn btn-accent btn-sm" style={{ marginTop: 20 }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(b => (
              <Link key={b.id} href={`/business/${b.slug}`} className="card" style={{ display: 'block', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-warm-terracotta)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--shadow-medium)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-muted-border)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--shadow-subtle)'; }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Image */}
                  {b.images[0] && (
                    <img src={b.images[0]} alt={b.name} width={80} height={80} loading="lazy"
                      style={{ width: 80, height: 80, borderRadius: 'var(--radius-generous)', objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontSize: 'clamp(14px,1.5vw,16px)', fontWeight: 600, color: 'var(--color-deep-charcoal)', marginBottom: 4, fontFamily: 'inherit' }}>{b.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: 'var(--color-medium-gray)' }}>{b.category}</span>
                          <span style={{ fontSize: 11, color: 'var(--color-light-gray)' }}>•</span>
                          <span style={{ fontSize: 12, color: 'var(--color-medium-gray)' }}>{b.area}, {b.city}</span>
                          {b.verified && <span className="badge badge-success">Verified</span>}
                          {b.openNow && <span className="badge badge-success">Open Now</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Stars r={Math.round(b.rating)} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-deep-charcoal)' }}>{b.rating}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-light-gray)' }}>{b.reviewCount} reviews</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-medium-gray)', marginTop: 6, maxWidth: '100%', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.shortDesc}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {b.tags.slice(0, 3).map(t => (
                        <span key={t} className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>{t}</span>
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
