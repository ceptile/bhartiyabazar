'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { searchCategories, ALL_CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories';
import { reverseGeocode, getUserLocation } from '@/lib/geo';
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
  status?: string;
  createdAt?: { seconds: number } | string | number;
}

const CITIES = [
  'Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune',
  'Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida',
  'Faridabad','Firozabad','Agra','Mathura','Aligarh','Meerut',
];

// Additional aliases for fuzzy-matching IP/GPS results to CITIES list
const CITY_ALIASES: Record<string, string> = {
  'new delhi': 'Delhi',
  'south delhi': 'Delhi',
  'north delhi': 'Delhi',
  'east delhi': 'Delhi',
  'west delhi': 'Delhi',
  'central delhi': 'Delhi',
  'ncr': 'Delhi',
  'delhi ncr': 'Delhi',
  'bengaluru': 'Bangalore',
  'bombay': 'Mumbai',
  'calcutta': 'Kolkata',
  'gurugram': 'Gurgaon',
  'gurugaon': 'Gurgaon',
  'navi mumbai': 'Mumbai',
  'thane': 'Mumbai',
  'greater noida': 'Noida',
  'gautam buddha nagar': 'Noida',
  'secunderabad': 'Hyderabad',
};

/**
 * Tries to match a raw city string (from GPS/IP) to one of the canonical CITIES.
 * Returns the matched city name or the original string if no match.
 */
function matchToKnownCity(raw: string): string {
  if (!raw) return raw;
  const lower = raw.toLowerCase().trim();

  // 1. Direct exact match
  const exact = CITIES.find(c => c.toLowerCase() === lower);
  if (exact) return exact;

  // 2. Alias map
  if (CITY_ALIASES[lower]) return CITY_ALIASES[lower];

  // 3. Known city name contained in raw string (e.g. "Faridabad District" → "Faridabad")
  const contained = CITIES.find(c => lower.includes(c.toLowerCase()));
  if (contained) return contained;

  // 4. Raw string contained in a known city name
  const reverse = CITIES.find(c => c.toLowerCase().includes(lower));
  if (reverse) return reverse;

  // 5. Return raw as-is — unknown city, but still useful for text filter
  return raw;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name',   label: 'Name A–Z'     },
];

type LocState = 'idle' | 'loading' | 'success' | 'denied' | 'error';

function MapPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
    </svg>
  );
}

function getCreatedAtSeconds(val?: Listing['createdAt']): number {
  if (!val) return 0;
  if (typeof val === 'object' && 'seconds' in val) return val.seconds;
  if (typeof val === 'number') return val;
  return new Date(val).getTime() / 1000;
}

// IP-based location — no permission needed
async function detectCityByIP(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('ipapi failed');
    const data = await res.json();
    return data.city || data.region || '';
  } catch {
    try {
      const res2 = await fetch('https://ip-api.com/json/?fields=city,regionName', { signal: AbortSignal.timeout(5000) });
      const d2 = await res2.json();
      return d2.city || d2.regionName || '';
    } catch {
      return '';
    }
  }
}

export default function ListingsPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [listings,    setListings]    = useState<Listing[]>([]);
  const [loading,     setLoading]     = useState(true);

  const [cityFilter,  setCityFilter]  = useState('');
  const [cityLabel,   setCityLabel]   = useState('All Cities');
  const [locState,    setLocState]    = useState<LocState>('idle');
  const [locError,    setLocError]    = useState('');
  const [locMethod,   setLocMethod]   = useState<'gps'|'ip'|''>('');

  const [catQuery,      setCatQuery]      = useState('');
  const [catSelected,   setCatSelected]   = useState('');
  const [catSuggestions,setCatSuggestions]= useState<ReturnType<typeof searchCategories>>([]);
  const [groupFilter,   setGroupFilter]   = useState('');
  const [showFilters,   setShowFilters]   = useState(false);

  const [sortBy,      setSortBy]      = useState('newest');
  const [textSearch,  setTextSearch]  = useState('');

  const catRef = useRef<HTMLDivElement>(null);

  // ── Fetch ALL businesses once ──
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'businesses'));
        const data: Listing[] = snap.docs.map(d => ({ slug: d.id, ...d.data() } as Listing));
        setAllListings(data.filter(b => b.status !== 'rejected'));
      } catch (e) {
        console.error('[listings] fetch error', e);
        setAllListings([]);
      }
      setLoading(false);
    })();
  }, []);

  // ── Location detect: GPS first → smart city match → IP fallback ──
  const detectLocation = useCallback(async () => {
    setLocState('loading');
    setLocError('');
    setLocMethod('');

    // 1️⃣ GPS
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        const pos = await getUserLocation();
        const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        const rawCity = geo.city || geo.state || '';
        if (rawCity) {
          const matched = matchToKnownCity(rawCity);
          setCityFilter(matched);
          setCityLabel(matched);
          setLocState('success');
          setLocMethod('gps');
          return;
        }
      } catch (err: unknown) {
        const code = (err as GeolocationPositionError)?.code;
        console.warn('[detectLocation] GPS failed, code:', code);
      }
    }

    // 2️⃣ IP fallback
    try {
      const rawCity = await detectCityByIP();
      if (rawCity) {
        const matched = matchToKnownCity(rawCity);
        setCityFilter(matched);
        setCityLabel(matched);
        setLocState('success');
        setLocMethod('ip');
      } else {
        setLocState('error');
        setLocError('Could not detect your location automatically. Please select a city from the list below.');
      }
    } catch {
      setLocState('error');
      setLocError('Could not detect your location automatically. Please select a city from the list below.');
    }
  }, []);

  // ── Filter + sort ──
  useEffect(() => {
    let data = [...allListings];

    if (cityFilter && cityFilter !== 'All Cities') {
      const q = cityFilter.toLowerCase();
      data = data.filter(b =>
        b.city?.toLowerCase().includes(q) ||
        b.area?.toLowerCase().includes(q) ||
        q.includes(b.city?.toLowerCase() ?? '__')
      );
    }
    if (catSelected) {
      data = data.filter(b => b.category?.toLowerCase() === catSelected.toLowerCase());
    }
    if (textSearch.trim()) {
      const q = textSearch.toLowerCase();
      data = data.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'newest') {
      data.sort((a, b) => getCreatedAtSeconds(b.createdAt) - getCreatedAtSeconds(a.createdAt));
    } else if (sortBy === 'name') {
      data.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    }

    setListings(data.slice(0, 120));
  }, [allListings, cityFilter, catSelected, textSearch, sortBy]);

  // ── Category smart search ──
  useEffect(() => {
    if (catQuery.trim().length < 1) { setCatSuggestions([]); return; }
    setCatSuggestions(searchCategories(catQuery, 8));
  }, [catQuery]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatSuggestions([]);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const selectCity = (city: string) => {
    if (city === 'All Cities') { setCityFilter(''); setCityLabel('All Cities'); }
    else { setCityFilter(city); setCityLabel(city); }
    setLocState('success');
  };

  const clearFilters = () => {
    setCityFilter(''); setCityLabel('All Cities');
    setCatSelected(''); setCatQuery(''); setTextSearch('');
    setGroupFilter(''); setSortBy('newest'); setLocState('idle');
    setLocMethod('');
  };

  const hasFilters = !!(cityFilter || catSelected || textSearch.trim());
  const groupCats  = groupFilter
    ? (ALL_CATEGORIES ?? []).filter(c => c.group === groupFilter)
    : [];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 72 }}>

      {/* ── Sticky top bar ── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 0', position: 'sticky', top: 64, zIndex: 100 }}>
        <div className="lc">

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              Listings
            </h1>

            {/* Text search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, maxWidth: 340, padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)' }}>
              <SearchIcon size={14} />
              <input
                value={textSearch}
                onChange={e => setTextSearch(e.target.value)}
                placeholder="Search businesses…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)', minWidth: 0 }}
              />
              {textSearch && (
                <button onClick={() => setTextSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}>
                  <XIcon />
                </button>
              )}
            </div>

            {/* Smart category search */}
            <div ref={catRef} style={{ position: 'relative', minWidth: 180, maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)' }}>
                <span style={{ fontSize: 13 }}>🏷️</span>
                <input
                  value={catQuery}
                  onChange={e => { setCatQuery(e.target.value); if (!e.target.value) setCatSelected(''); }}
                  placeholder={catSelected || 'Category…'}
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
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 300, overflow: 'hidden' }}>
                  {catSuggestions.map(cat => (
                    <button key={cat.id}
                      onClick={() => { setCatSelected(cat.name); setCatQuery(cat.name); setCatSuggestions([]); }}
                      style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--border)' }}
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

            {/* Filters toggle */}
            <button onClick={() => setShowFilters(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--r-md)', border: `1px solid ${showFilters ? 'var(--amber)' : 'var(--border-hover)'}`, background: showFilters ? 'var(--amber-subtle)' : 'var(--bg)', color: showFilters ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <FilterIcon /> Filters {hasFilters ? '·' : ''}
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

          {/* Location row */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none', alignItems: 'center', flexWrap: 'nowrap' }}>
            {/* Detect button */}
            <button
              onClick={detectLocation}
              disabled={locState === 'loading'}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--amber)', background: locState === 'loading' ? 'var(--amber-subtle)' : 'var(--amber)', color: locState === 'loading' ? 'var(--amber)' : '#fff', fontSize: 12, fontWeight: 600, cursor: locState === 'loading' ? 'default' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.18s' }}
            >
              {locState === 'loading'
                ? <><div style={{ width: 10, height: 10, border: '2px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Detecting…</>
                : <>📡 Detect My Location</>
              }
            </button>

            {/* City pills */}
            {['All Cities', ...CITIES].map(city => {
              const active = city === 'All Cities'
                ? (!cityFilter || cityFilter === '')
                : cityFilter.toLowerCase() === city.toLowerCase();
              return (
                <button key={city} onClick={() => selectCity(city)}
                  style={{ padding: '6px 14px', borderRadius: 'var(--r-full)', border: `1.5px solid ${active ? 'var(--amber)' : 'var(--border)'}`, background: active ? 'var(--amber-subtle)' : 'var(--bg)', color: active ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.18s' }}>
                  {city}
                </button>
              );
            })}
          </div>

          {/* Location feedback */}
          {locState === 'success' && cityLabel !== 'All Cities' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--r-md)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', fontSize: 13, color: 'var(--amber)', fontWeight: 600, width: 'fit-content', marginTop: 8 }}>
              {locMethod === 'gps' ? '📍' : '🌐'} Showing results near <strong style={{ marginLeft: 3 }}>{cityLabel}</strong>
              {locMethod === 'ip' && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>(approximate)</span>}
              {locMethod === 'gps' && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>(GPS)</span>}
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--amber)', padding: '0 0 0 4px', fontSize: 13 }}>✕</button>
            </div>
          )}
          {locState === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '7px 12px', borderRadius: 'var(--r-md)', background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#b91c1c', maxWidth: 520, marginTop: 8 }}>
              ⚠️ {locError}
              <button onClick={detectLocation} style={{ background: 'var(--amber)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', padding: '3px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Retry</button>
            </div>
          )}
        </div>

        {/* Expanded filters panel */}
        {showFilters && (
          <div className="lc" style={{ marginTop: 12 }}>
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Browse by Group</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(CATEGORY_GROUPS ?? []).map(g => (
                    <button key={g} onClick={() => setGroupFilter(groupFilter === g ? '' : g)}
                      style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 500, border: `1px solid ${groupFilter === g ? 'var(--amber)' : 'var(--border)'}`, background: groupFilter === g ? 'var(--amber-subtle)' : 'var(--bg)', color: groupFilter === g ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              {groupFilter && groupCats.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {groupFilter} categories
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {groupCats.map(cat => (
                      <button key={cat.id}
                        onClick={() => { setCatSelected(cat.name); setCatQuery(cat.name); setShowFilters(false); }}
                        style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', fontSize: 12, border: `1px solid ${catSelected === cat.name ? 'var(--amber)' : 'var(--border)'}`, background: catSelected === cat.name ? 'var(--amber-subtle)' : 'var(--bg)', color: catSelected === cat.name ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="lc" style={{ padding: '20px 0 56px' }}>

        {/* Active filter chips */}
        {(cityFilter || catSelected || textSearch) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing:</span>
            {cityFilter && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', color: 'var(--amber)', fontSize: 12, fontWeight: 600 }}>
                📍 {cityLabel}
                <button onClick={() => { setCityFilter(''); setCityLabel('All Cities'); setLocState('idle'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--amber)' }}><XIcon size={12} /></button>
              </span>
            )}
            {catSelected && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', color: 'var(--amber)', fontSize: 12, fontWeight: 600 }}>
                🏷️ {catSelected}
                <button onClick={() => { setCatSelected(''); setCatQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--amber)' }}><XIcon size={12} /></button>
              </span>
            )}
            {textSearch && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', color: 'var(--amber)', fontSize: 12, fontWeight: 600 }}>
                🔍 &ldquo;{textSearch}&rdquo;
                <button onClick={() => setTextSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--amber)' }}><XIcon size={12} /></button>
              </span>
            )}
          </div>
        )}

        {!loading && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            {listings.length} business{listings.length !== 1 ? 'es' : ''} found
            {cityFilter ? ` in ${cityLabel}` : ''}
            {catSelected ? ` · ${catSelected}` : ''}
          </p>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
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
            <div style={{ fontSize: 52, marginBottom: 16 }}>🏪</div>
            <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 8 }}>
              {hasFilters ? 'No businesses found' : 'No businesses listed yet'}
            </h2>
            <p style={{ fontSize: 14, marginBottom: 24, maxWidth: 400, marginInline: 'auto' }}>
              {hasFilters
                ? `No results${cityFilter ? ` in "${cityLabel}"` : ''}${catSelected ? ` for "${catSelected}"` : ''}. Try different filters.`
                : 'BhartiyaBazar is growing. Be the first to list your business — completely free.'}
            </p>
            {hasFilters ? (
              <button onClick={clearFilters} style={{ padding: '11px 28px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                Clear Filters
              </button>
            ) : (
              <Link href="/register-business" style={{ display: 'inline-block', padding: '11px 28px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                List Your Business Free →
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {listings.map(biz => (
              <Link key={biz.slug} href={`/business/${biz.slug}`}
                style={{ textDecoration: 'none', display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-sm)', transition: 'all var(--t)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, marginRight: 8 }}>{biz.name}</h3>
                  {biz.verified && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>✓ Verified</span>
                  )}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontSize: 11, fontWeight: 600 }}>{biz.category}</span>
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
        )}
      </div>

      <style>{`
        .lc { max-width: 1200px; margin: 0 auto; padding-inline: clamp(16px, 4vw, 48px); }
        @keyframes shimmer { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
