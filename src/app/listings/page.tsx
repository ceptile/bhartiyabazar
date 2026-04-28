'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { searchCategories, ALL_CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories';
import { reverseGeocode } from '@/lib/geo';
import Link from 'next/link';

interface Listing {
  slug: string; name: string; category: string; city: string;
  area?: string; phone?: string; description?: string;
  verified?: boolean; ownerName?: string; status?: string;
}

const CITY_PILLS = ['All Cities','Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];
const CAT_PILLS  = ['All Categories','Restaurants','Electronics','Health','Home Services','Education','Salons','Auto','Clothing','Grocery','Jewellery','Real Estate','Events','Fitness'];
const SORT_OPTIONS = [
  { value: 'best',    label: 'Best Match' },
  { value: 'rated',   label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'newest',  label: 'Newest' },
];

function MapPin() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }
function SearchIcon({ size=18 }: { size?:number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function XIcon({ size=14 }: { size?:number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

type LocState = 'idle' | 'loading' | 'success' | 'denied' | 'error';

export default function ListingsPage() {
  const [allListings, setAllListings]   = useState<Listing[]>([]);
  const [listings,    setListings]      = useState<Listing[]>([]);
  const [loading,     setLoading]       = useState(true);

  // city
  const [cityFilter,  setCityFilter]    = useState('');
  const [cityLabel,   setCityLabel]     = useState('All Cities');
  const [locState,    setLocState]      = useState<LocState>('idle');
  const [locError,    setLocError]      = useState('');

  // category
  const [catSelected, setCatSelected]   = useState('');
  const [catQuery,    setCatQuery]      = useState('');
  const [catSugg,     setCatSugg]       = useState<ReturnType<typeof searchCategories>>([]);
  const catRef = useRef<HTMLDivElement>(null);

  // sort / search
  const [sortBy,      setSortBy]        = useState('newest');
  const [textSearch,  setTextSearch]    = useState('');

  // ── Fetch businesses ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'businesses'));
        const data: Listing[] = snap.docs.map(d => ({ slug: d.id, ...d.data() } as Listing));
        setAllListings(data.filter(b => !b.status || b.status === 'approved' || b.status === 'active'));
      } catch (e) {
        console.error('[listings]', e);
        setAllListings([]);
      }
      setLoading(false);
    })();
  }, []);

  // ── GPS on mount ──────────────────────────────────────────────────────────
  useEffect(() => { detectLocation(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocState('error');
      setLocError('Geolocation not supported by your browser.');
      return;
    }
    setLocState('loading');
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          const city = geo.city || geo.state || '';
          setCityFilter(city);
          setCityLabel(city || 'All Cities');
          setLocState('success');
        } catch {
          setLocState('error');
          setLocError('Could not resolve your city. Please select manually.');
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocState('denied');
          setLocError('Location permission denied. Please allow it in your browser settings, or select a city manually.');
        } else if (err.code === err.TIMEOUT) {
          setLocState('error');
          setLocError('Location request timed out. Try again.');
        } else {
          setLocState('error');
          setLocError('Could not get location. Try again.');
        }
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }, []);

  // ── Filter + sort ─────────────────────────────────────────────────────────
  useEffect(() => {
    let data = [...allListings];
    if (cityFilter && cityFilter !== 'All Cities') {
      data = data.filter(b =>
        b.city?.toLowerCase().includes(cityFilter.toLowerCase()) ||
        b.area?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }
    if (catSelected && catSelected !== 'All Categories') {
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
    if (sortBy === 'newest') data.reverse();
    else if (sortBy === 'best' || sortBy === 'name') data.sort((a, b) => a.name.localeCompare(b.name));
    setListings(data.slice(0, 120));
  }, [allListings, cityFilter, catSelected, textSearch, sortBy]);

  // ── Category suggestions ──────────────────────────────────────────────────
  useEffect(() => {
    if (catQuery.trim().length < 1) { setCatSugg([]); return; }
    setCatSugg(searchCategories(catQuery, 8));
  }, [catQuery]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatSugg([]);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const selectCity = (city: string) => {
    if (city === 'All Cities') { setCityFilter(''); setCityLabel('All Cities'); }
    else { setCityFilter(city); setCityLabel(city); }
    setLocState('success');
  };

  const selectCat = (cat: string) => {
    if (cat === 'All Categories') { setCatSelected(''); setCatQuery(''); }
    else { setCatSelected(cat); setCatQuery(cat); }
  };

  const hasFilters = (cityFilter && cityFilter !== 'All Cities') || (catSelected && catSelected !== 'All Categories') || textSearch.trim();

  const clearAll = () => {
    setCityFilter(''); setCityLabel('All Cities');
    setCatSelected(''); setCatQuery(''); setTextSearch('');
    setSortBy('newest'); setLocState('idle');
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>

      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '32px 0 0' }}>
        <div className="lc">

          {/* Title */}
          <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Business Directory
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
            Find Businesses Across India &nbsp;·&nbsp; Be the first to list your business — completely free
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240, background: 'var(--bg)', border: '1.5px solid var(--border-hover)', borderRadius: 'var(--r-lg)', padding: '10px 14px', boxShadow: 'var(--shadow-sm)' }}>
              <SearchIcon size={16} />
              <input
                value={textSearch}
                onChange={e => setTextSearch(e.target.value)}
                placeholder="Search businesses, categories, cities…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--text-primary)' }}
              />
              {textSearch && (
                <button onClick={() => setTextSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}><XIcon /></button>
              )}
            </div>

            {/* Category search */}
            <div ref={catRef} style={{ position: 'relative', minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1.5px solid var(--border-hover)', borderRadius: 'var(--r-lg)', padding: '10px 14px', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: 14 }}>🏷️</span>
                <input
                  value={catQuery}
                  onChange={e => { setCatQuery(e.target.value); if (!e.target.value) setCatSelected(''); }}
                  placeholder={catSelected || 'Category…'}
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--text-primary)', minWidth: 100 }}
                />
                {(catQuery || catSelected) && (
                  <button onClick={() => { setCatQuery(''); setCatSelected(''); setCatSugg([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}><XIcon /></button>
                )}
              </div>
              {catSugg.length > 0 && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 300, overflow: 'hidden' }}>
                  {catSugg.map(cat => (
                    <button key={cat.id} onClick={() => { setCatSelected(cat.name); setCatQuery(cat.name); setCatSugg([]); }}
                      style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '9px 14px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}
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
          </div>

          {/* Location detection status */}
          {locState === 'loading' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', marginBottom: 12, width: 'fit-content', fontSize: 13, color: 'var(--amber)' }}>
              <div style={{ width: 13, height: 13, border: '2px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
              Detecting your location…
            </div>
          )}
          {(locState === 'denied' || locState === 'error') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '8px 12px', borderRadius: 'var(--r-md)', background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 12, fontSize: 13, color: '#b91c1c', maxWidth: 560 }}>
              <span>⚠️ {locError}</span>
              {locState !== 'denied' && (
                <button onClick={detectLocation} style={{ background: 'var(--amber)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', padding: '3px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Retry
                </button>
              )}
            </div>
          )}

          {/* City pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 14, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {/* Detect button as first pill */}
            <button
              onClick={detectLocation}
              disabled={locState === 'loading'}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--amber)', background: locState === 'loading' ? 'var(--amber-subtle)' : 'var(--amber)', color: locState === 'loading' ? 'var(--amber)' : '#fff', fontSize: 12, fontWeight: 600, cursor: locState === 'loading' ? 'default' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.18s' }}
            >
              {locState === 'loading'
                ? <><div style={{ width: 10, height: 10, border: '2px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Detecting…</>
                : <><span>📡</span> Detect My Location</>
              }
            </button>
            {CITY_PILLS.map(city => {
              const active = city === 'All Cities' ? (!cityFilter || cityFilter === '') : cityFilter === city;
              return (
                <button key={city} onClick={() => selectCity(city)}
                  style={{ padding: '6px 14px', borderRadius: 'var(--r-full)', border: `1.5px solid ${active ? 'var(--amber)' : 'var(--border)'}`, background: active ? 'var(--amber-subtle)' : 'var(--bg)', color: active ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.18s' }}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {CAT_PILLS.map(cat => {
              const active = cat === 'All Categories' ? !catSelected : catSelected === cat;
              return (
                <button key={cat} onClick={() => selectCat(cat)}
                  style={{ padding: '6px 14px', borderRadius: 'var(--r-full)', border: `1.5px solid ${active ? 'var(--amber)' : 'var(--border)'}`, background: active ? 'var(--amber-subtle)' : 'var(--bg)', color: active ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.18s' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Results bar ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
        <div className="lc" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {!loading && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
              {listings.length} business{listings.length !== 1 ? 'es' : ''} found
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>Sort:</span>
            {SORT_OPTIONS.map(o => (
              <button key={o.value} onClick={() => setSortBy(o.value)}
                style={{ padding: '5px 10px', borderRadius: 'var(--r-md)', border: `1px solid ${sortBy === o.value ? 'var(--amber)' : 'var(--border)'}`, background: sortBy === o.value ? 'var(--amber-subtle)' : 'none', color: sortBy === o.value ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 12, fontWeight: sortBy === o.value ? 600 : 400, cursor: 'pointer' }}>
                {o.label}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearAll} style={{ padding: '5px 10px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>Clear all</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category sub-pills (quick mobile filter) ─────────────────────── */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
        <div className="lc">
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {['All Categories','Restaurants','Electronics','Health','Home Services','Education','Salons','Auto'].map(cat => {
              const active = cat === 'All Categories' ? !catSelected : catSelected === cat;
              return (
                <button key={cat} onClick={() => selectCat(cat)}
                  style={{ padding: '4px 12px', borderRadius: 'var(--r-full)', border: `1px solid ${active ? 'var(--amber)' : 'var(--border)'}`, background: active ? 'var(--amber-subtle)' : 'var(--bg)', color: active ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Listings grid ────────────────────────────────────────────────────── */}
      <div className="lc" style={{ padding: '24px 0 56px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, height: 160 }}>
                <div style={{ height: 14, background: 'var(--surface-offset)', borderRadius: 4, marginBottom: 10, width: '60%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                <div style={{ height: 11, background: 'var(--surface-offset)', borderRadius: 4, marginBottom: 8, width: '40%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                <div style={{ height: 11, background: 'var(--surface-offset)', borderRadius: 4, width: '80%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 16px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏪</div>
            <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 8 }}>
              {hasFilters ? 'No businesses found' : 'No businesses listed yet'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 400, marginInline: 'auto' }}>
              {hasFilters
                ? `No results${cityFilter ? ` in "${cityLabel}"` : ''}${catSelected ? ` for "${catSelected}"` : ''}. Try different filters.`
                : 'BhartiyaBazar is growing. Be the first to list your business — completely free.'}
            </p>
            {hasFilters ? (
              <button onClick={clearAll} style={{ padding: '11px 28px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>Clear Filters</button>
            ) : (
              <Link href="/list-business" style={{ display: 'inline-block', padding: '11px 28px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
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
                  {biz.verified && <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>✓ Verified</span>}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontSize: 11, fontWeight: 600 }}>{biz.category}</span>
                </div>
                {biz.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{biz.description}</p>}
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
        .lc { max-width:1200px; margin:0 auto; padding-inline:clamp(16px,4vw,48px); }
        @keyframes shimmer { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}
