'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, where, orderBy, limit, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { searchCategories, ALL_CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories';
import Link from 'next/link';

interface Listing {
  slug: string;
  name: string;
  category: string;
  city: string;
  area?: string;
  phone?: string;
  description?: string;
  verified?: boolean;
  ownerName?: string;
}

const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A–Z' },
];

function StarIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
}
function MapPin() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function SearchIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function XIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;
}
function FilterIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>;
}

export default function ListingsPage() {
  const [listings, setListings]   = useState<Listing[]>([]);
  const [loading, setLoading]     = useState(true);
  const [cityFilter, setCityFilter]   = useState('');
  const [catQuery, setCatQuery]       = useState('');
  const [catSelected, setCatSelected] = useState('');
  const [catSuggestions, setCatSuggestions] = useState<ReturnType<typeof searchCategories>>([]);
  const [sortBy, setSortBy]       = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [groupFilter, setGroupFilter] = useState('');
  const catRef = useRef<HTMLDivElement>(null);

  // Detect user city from browser (best-effort)
  useEffect(() => {
    if (typeof window !== 'undefined' && !cityFilter) {
      // Try to match a known city from timezone/locale — fallback to no filter
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Kolkata') || tz.includes('Calcutta')) setCityFilter('Kolkata');
    }
  }, []);

  // Category smart search
  useEffect(() => {
    if (catQuery.trim().length < 1) { setCatSuggestions([]); return; }
    setCatSuggestions(searchCategories(catQuery, 8));
  }, [catQuery]);

  // Close cat dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatSuggestions([]);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const constraints: QueryConstraint[] = [];
      if (cityFilter) constraints.push(where('city', '==', cityFilter));
      if (catSelected) constraints.push(where('category', '==', catSelected));
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(48));

      const snap = await getDocs(query(collection(db, 'businesses'), ...constraints));
      let data = snap.docs.map(d => ({ slug: d.id, ...d.data() } as Listing));

      if (sortBy === 'name') data = data.sort((a, b) => a.name.localeCompare(b.name));
      setListings(data);
    } catch (e) {
      console.error(e);
      setListings([]);
    }
    setLoading(false);
  }, [cityFilter, catSelected, sortBy]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const clearFilters = () => { setCityFilter(''); setCatSelected(''); setCatQuery(''); setGroupFilter(''); setSortBy('newest'); };
  const hasFilters = cityFilter || catSelected || groupFilter;

  // Category browser by group
  const groupCats = groupFilter ? ALL_CATEGORIES.filter(c => c.group === groupFilter) : [];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 72 }}>

      {/* ── Top bar ── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 0', position: 'sticky', top: 64, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>

          <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginRight: 8, whiteSpace: 'nowrap' }}>
            Listings
          </h1>

          {/* City filter */}
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: cityFilter ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer', outline: 'none' }}
          >
            <option value="">📍 All Cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Smart category search */}
          <div ref={catRef} style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)' }}>
              <SearchIcon size={14} />
              <input
                value={catQuery}
                onChange={e => { setCatQuery(e.target.value); if (!e.target.value) setCatSelected(''); }}
                placeholder={catSelected || 'Search category…'}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)', minWidth: 0 }}
              />
              {(catQuery || catSelected) && (
                <button onClick={() => { setCatQuery(''); setCatSelected(''); setCatSuggestions([]); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}>
                  <XIcon />
                </button>
              )}
            </div>
            {catSuggestions.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden' }}>
                {catSuggestions.map(cat => (
                  <button key={cat.id} onClick={() => { setCatSelected(cat.name); setCatQuery(cat.name); setCatSuggestions([]); }}
                    style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{cat.group}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More filters toggle */}
          <button onClick={() => setShowFilters(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--r-md)', border: `1px solid ${showFilters ? 'var(--amber)' : 'var(--border-hover)'}`, background: showFilters ? 'var(--amber-subtle)' : 'var(--bg)', color: showFilters ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <FilterIcon /> Filters {hasFilters ? '•' : ''}
          </button>

          {hasFilters && (
            <button onClick={clearFilters} style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>
              Clear all
            </button>
          )}

          <div style={{ marginLeft: 'auto' }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="container" style={{ marginTop: 12, padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Browse by Group</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORY_GROUPS.map(g => (
                  <button key={g} onClick={() => setGroupFilter(groupFilter === g ? '' : g)}
                    style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 500, border: `1px solid ${groupFilter === g ? 'var(--amber)' : 'var(--border)'}`, background: groupFilter === g ? 'var(--amber-subtle)' : 'var(--bg)', color: groupFilter === g ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            {groupFilter && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {groupFilter} categories
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {groupCats.map(cat => (
                    <button key={cat.id} onClick={() => { setCatSelected(cat.name); setCatQuery(cat.name); setShowFilters(false); }}
                      style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', fontSize: 12, border: `1px solid ${catSelected === cat.name ? 'var(--amber)' : 'var(--border)'}`, background: catSelected === cat.name ? 'var(--amber-subtle)' : 'var(--bg)', color: catSelected === cat.name ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="container" style={{ padding: '24px 0 48px' }}>

        {/* Active filter chips */}
        {(cityFilter || catSelected) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing:</span>
            {cityFilter && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', color: 'var(--amber)', fontSize: 12, fontWeight: 600 }}>
                📍 {cityFilter}
                <button onClick={() => setCityFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--amber)' }}><XIcon /></button>
              </span>
            )}
            {catSelected && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', color: 'var(--amber)', fontSize: 12, fontWeight: 600 }}>
                🏷️ {catSelected}
                <button onClick={() => { setCatSelected(''); setCatQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--amber)' }}><XIcon /></button>
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, height: 160 }}>
                <div style={{ height: 16, background: 'var(--surface-offset)', borderRadius: 4, marginBottom: 10, width: '60%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                <div style={{ height: 12, background: 'var(--surface-offset)', borderRadius: 4, marginBottom: 8, width: '40%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                <div style={{ height: 12, background: 'var(--surface-offset)', borderRadius: 4, width: '80%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 16px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 8 }}>No listings found</h2>
            <p style={{ fontSize: 14, marginBottom: 20 }}>
              {hasFilters ? 'Try changing your filters or clearing them.' : 'Be the first to list your business!'}
            </p>
            {hasFilters && <button onClick={clearFilters} style={{ padding: '10px 24px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>Clear Filters</button>}
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              {listings.length} listing{listings.length !== 1 ? 's' : ''} found
              {cityFilter ? ` in ${cityFilter}` : ''}
              {catSelected ? ` · ${catSelected}` : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {listings.map(biz => (
                <Link key={biz.slug} href={`/business/${biz.slug}`}
                  style={{ textDecoration: 'none', display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-sm)', transition: 'all var(--t)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, marginRight: 8 }}>
                      {biz.name}
                    </h3>
                    {biz.verified && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontSize: 11, fontWeight: 600 }}>
                      {biz.category}
                    </span>
                  </div>
                  {biz.description && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {biz.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-faint)', fontSize: 12 }}>
                    <MapPin />
                    {biz.area ? `${biz.area}, ${biz.city}` : biz.city}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 1 } 50% { opacity: 0.4 } 100% { opacity: 1 }
        }
        .container { max-width: 1200px; margin: 0 auto; padding-inline: clamp(16px, 4vw, 48px); }
      `}</style>
    </div>
  );
}