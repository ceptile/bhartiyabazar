'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { searchCategories, ALL_CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories';
import { getUserLocation, reverseGeocode } from '@/lib/geo';
import Link from 'next/link';

interface Business {
  slug: string; name: string; category: string;
  city: string; area?: string; description?: string; verified?: boolean;
}

const POPULAR = ['Restaurants', 'Doctors', 'Salons', 'Electricians', 'Plumbers', 'Grocery', 'Lawyers', 'Tutors'];

function LocIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>; }
function SearchIco() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function MapPin() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }
function XIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Business[]>([]);
  const [allBiz, setAllBiz] = useState<Business[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [catGroup, setCatGroup] = useState('');
  const [catSuggestions, setCatSuggestions] = useState<ReturnType<typeof searchCategories>>([]);
  const [city, setCity] = useState('');
  const [cityLabel, setCityLabel] = useState('Detecting…');
  const [locLoading, setLocLoading] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load all businesses once
  useEffect(() => {
    getDocs(collection(db, 'businesses')).then(snap => {
      const data = snap.docs.map(d => ({ slug: d.id, ...d.data() } as Business))
        .filter(b => !(b as unknown as { status?: string }).status || (b as unknown as { status?: string }).status === 'approved' || (b as unknown as { status?: string }).status === 'active');
      setAllBiz(data);
    }).catch(() => setAllBiz([]));
  }, []);

  // GPS on mount
  useEffect(() => {
    (async () => {
      setLocLoading(true);
      try {
        const pos = await getUserLocation();
        const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        const c = geo.city || geo.state || '';
        setCity(c); setCityLabel(c || 'All Cities'); setCityInput(c);
      } catch {
        setCity(''); setCityLabel('All Cities'); setCityInput('');
      }
      setLocLoading(false);
    })();
  }, []);

  // Close dropdowns outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setShowResults(false); setShowCategories(false); }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityPicker(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // AI search
  const [aiSummary, setAiSummary] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);

  // Live search with debounce
  const doSearch = useCallback(async (q: string, cityFilter: string) => {
    if (!q.trim()) { 
      setResults([]); 
      setCatSuggestions(searchCategories(q, 6)); 
      setAiSummary('');
      return; 
    }
    
    setSearching(true);
    const q2 = q.toLowerCase();
    
    // Natural language detection (if query > 3 words, try AI)
    const isNatural = q.split(' ').length >= 3;
    
    if (isNatural) {
      setIsAiMode(true);
      try {
        const res = await fetch('/api/ai-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, listings: allBiz })
        });
        const data = await res.json();
        if (data.slugs) {
          const aiBiz = allBiz.filter(b => data.slugs.includes(b.slug));
          setResults(aiBiz);
          setAiSummary(data.summary);
        }
      } catch (e) {
        console.error('AI search failed', e);
      } finally {
        setSearching(false);
      }
    } else {
      setIsAiMode(false);
      let data = allBiz.filter(b =>
        b.name?.toLowerCase().includes(q2) ||
        b.category?.toLowerCase().includes(q2) ||
        b.description?.toLowerCase().includes(q2) ||
        b.area?.toLowerCase().includes(q2)
      );
      if (cityFilter) data = data.filter(b => b.city?.toLowerCase().includes(cityFilter.toLowerCase()));
      // Boost verified
      data.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
      setResults(data.slice(0, 8));
      setCatSuggestions(searchCategories(q, 4));
      setSearching(false);
    }
  }, [allBiz]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query, city), 220);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, city, doSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/listings?q=${encodeURIComponent(query)}${city ? `&city=${encodeURIComponent(city)}` : ''}`);
  };

  const detectCity = async () => {
    setLocLoading(true);
    try {
      const pos = await getUserLocation();
      const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      const c = geo.city || geo.state || '';
      setCity(c); setCityLabel(c || 'All Cities'); setCityInput(c);
    } catch {
      setCity(''); setCityLabel('All Cities'); setCityInput('');
    }
    setLocLoading(false);
    setShowCityPicker(false);
  };

  const groupCats = catGroup ? ALL_CATEGORIES.filter(c => c.group === catGroup) : [];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <section style={{ padding: 'clamp(80px,10vw,140px) 16px clamp(48px,6vw,80px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', color: 'var(--amber)', fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            🇮🇳 India's Trusted Business Directory
          </div>
          <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.02em' }}>
            Find Any Business,<br/>Anywhere in India
          </h1>
          <p style={{ fontSize: 'clamp(1rem,1.5vw,1.2rem)', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Search restaurants, doctors, shops, services & more — near you or anywhere.
          </p>

          {/* ── Smart Search Bar ── */}
          <div style={{ display: 'flex', gap: 8, maxWidth: 680, margin: '0 auto', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>

            {/* City chip */}
            <div ref={cityRef} style={{ position: 'relative' }}>
              <button type="button" onClick={() => setShowCityPicker(p => !p)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 14px', borderRadius: 'var(--r-lg)', border: `1px solid ${showCityPicker ? 'var(--amber)' : 'var(--border-hover)'}`, background: 'var(--surface)', color: city ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', height: 50 }}>
                {locLoading
                  ? <div style={{ width: 13, height: 13, border: '2px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                }
                {cityLabel}
              </button>
              {showCityPicker && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 300, padding: 12, minWidth: 260 }}>
                  <button type="button" onClick={detectCity}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--amber-glow)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 8 }}>
                    <LocIcon /> 📡 Detect My Location
                  </button>
                  <input value={cityInput} onChange={e => { setCityInput(e.target.value); setCity(e.target.value); setCityLabel(e.target.value || 'All Cities'); }}
                    placeholder="Type city…"
                    autoFocus
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                  />
                  <button type="button" onClick={() => { setCity(''); setCityLabel('All Cities'); setCityInput(''); setShowCityPicker(false); }}
                    style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear → All India</button>
                </div>
              )}
            </div>

            {/* Main search box */}
            <div ref={searchRef} style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <form onSubmit={handleSearch}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '2px solid var(--border-hover)', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 50, boxShadow: 'var(--shadow-sm)' }}
                  onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)'; setShowResults(true); }}
                  onBlur={(e) => { if (!searchRef.current?.contains(e.relatedTarget as Node)) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; }}
                >
                  <div style={{ padding: '0 14px', color: 'var(--text-muted)', display: 'flex' }}><SearchIco /></div>
                  <input
                    value={query}
                    onChange={e => { setQuery(e.target.value); setShowResults(true); setShowCategories(false); }}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search businesses, categories, services…"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: 'var(--text-primary)', fontFamily: 'inherit' }}
                  />
                  {query && (
                    <button type="button" onClick={() => { setQuery(''); setResults([]); }} style={{ padding: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><XIcon /></button>
                  )}
                  <button type="submit" style={{ padding: '0 18px', background: 'var(--amber)', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 14, height: '100%', whiteSpace: 'nowrap' }}>Search</button>
                </div>
              </form>

              {/* Live results dropdown */}
              {showResults && (query.trim() || catSuggestions.length > 0) && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden', maxHeight: 420, overflowY: 'auto' }}>

                  {/* AI Summary */}
                  {isAiMode && aiSummary && (
                    <div style={{ padding: '12px 14px', background: 'var(--amber-subtle)', borderBottom: '1px solid var(--amber-glow)', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 11, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase' }}>
                        <span style={{ fontSize: 14 }}>✨</span> AI Summary
                      </div>
                      {aiSummary}
                    </div>
                  )}

                  {/* Category suggestions */}
                  {catSuggestions.length > 0 && (
                    <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ padding: '4px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categories</div>
                      {catSuggestions.map(cat => (
                        <button key={cat.id}
                          onClick={() => { router.push(`/listings?category=${encodeURIComponent(cat.name)}${city ? `&city=${encodeURIComponent(city)}` : ''}`); setShowResults(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <span style={{ fontSize: 18 }}>🏷️</span>
                          <span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 8 }}>{cat.group}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Business results */}
                  {searching ? (
                    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Searching…</div>
                  ) : results.length > 0 ? (
                    <div>
                      <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Businesses</div>
                      {results.map(biz => (
                        <Link key={biz.slug} href={`/business/${biz.slug}`} onClick={() => setShowResults(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', textDecoration: 'none', borderTop: '1px solid var(--border)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'var(--amber-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🏪</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              {biz.name}
                              {biz.verified && <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', fontWeight: 700 }}>✓</span>}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span>{biz.category}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin />{biz.area ? `${biz.area}, ${biz.city}` : biz.city}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link href={`/listings?q=${encodeURIComponent(query)}${city ? `&city=${encodeURIComponent(city)}` : ''}`}
                        onClick={() => setShowResults(false)}
                        style={{ display: 'block', padding: '10px 14px', textAlign: 'center', fontSize: 13, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                        See all results for "{query}" →
                      </Link>
                    </div>
                  ) : query.trim() ? (
                    <div style={{ padding: '16px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No results for "{query}"</span>
                      <br />
                      <Link href={`/listings?q=${encodeURIComponent(query)}`} style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>Browse all listings →</Link>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Popular chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
            {POPULAR.map(p => (
              <button key={p} onClick={() => { setQuery(p); setShowResults(true); }}
                style={{ padding: '5px 14px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--amber-subtle)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
              >{p}</button>
            ))}
            <button onClick={() => setShowCategories(p => !p)}
              style={{ padding: '5px 14px', borderRadius: 'var(--r-full)', border: `1px solid ${showCategories ? 'var(--amber)' : 'var(--border)'}`, background: showCategories ? 'var(--amber-subtle)' : 'var(--surface)', color: showCategories ? 'var(--amber)' : 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
              All Categories ▾
            </button>
          </div>

          {/* Category browser */}
          {showCategories && (
            <div style={{ maxWidth: 680, margin: '0 auto 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 16, boxShadow: 'var(--shadow-md)', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Groups</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {CATEGORY_GROUPS.map(g => (
                  <button key={g} onClick={() => setCatGroup(catGroup === g ? '' : g)}
                    style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 500, border: `1px solid ${catGroup === g ? 'var(--amber)' : 'var(--border)'}`, background: catGroup === g ? 'var(--amber-subtle)' : 'var(--bg)', color: catGroup === g ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}>{g}</button>
                ))}
              </div>
              {catGroup && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{catGroup}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {groupCats.map(cat => (
                      <button key={cat.id}
                        onClick={() => { router.push(`/listings?category=${encodeURIComponent(cat.name)}${city ? `&city=${encodeURIComponent(city)}` : ''}`); setShowCategories(false); }}
                        style={{ padding: '4px 11px', borderRadius: 'var(--r-full)', fontSize: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--amber-subtle)'; e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >{cat.name}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '0 16px 60px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[['10,000+', 'Businesses Listed'], ['500+', 'Cities Covered'], ['50+', 'Categories']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '20px 12px', background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 800, color: 'var(--amber)', fontFamily: "'EB Garamond',serif" }}>{n}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recently added ── */}
      {allBiz.length > 0 && (
        <section style={{ padding: '0 16px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 'clamp(1.3rem,2vw,1.7rem)', fontWeight: 700, color: 'var(--text-primary)' }}>Recently Listed</h2>
              <Link href="/listings" style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
              {allBiz.slice(0, 8).map(biz => (
                <Link key={biz.slug} href={`/business/${biz.slug}`}
                  style={{ textDecoration: 'none', display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 16, boxShadow: 'var(--shadow-sm)', transition: 'all 160ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{biz.name}</h3>
                    {biz.verified && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', fontWeight: 700, whiteSpace: 'nowrap' }}>✓</span>}
                  </div>
                  <span style={{ padding: '2px 7px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontSize: 10, fontWeight: 600 }}>{biz.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--text-faint)', fontSize: 11, marginTop: 8 }}>
                    <MapPin />{biz.area ? `${biz.area}, ${biz.city}` : biz.city}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '60px 16px 100px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 'clamp(1.5rem,2.5vw,2.2rem)', color: 'var(--text-primary)', marginBottom: 12 }}>Own a Business?</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>List it free on BhartiyaBazar and reach customers in your city.</p>
          <Link href="/register-business"
            style={{ display: 'inline-block', padding: '13px 32px', borderRadius: 'var(--r-lg)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--amber-dark)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--amber)')}
          >List Your Business Free →</Link>
        </div>
      </section>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
