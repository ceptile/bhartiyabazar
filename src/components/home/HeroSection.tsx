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
    <div style={{ minHeight: '100dvh', background: 'var(--color-off-white)' }}>

      {/* ── Hero ── */}
      <section style={{ padding: 'clamp(60px,8vw,120px) 16px clamp(40px,5vw,64px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="badge badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 11 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            India&apos;s Trusted Business Directory
          </div>
          <h1 className="text-display" style={{ marginBottom: 12, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
            Find Any Business,<br/>Anywhere in India
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', color: 'var(--color-medium-gray)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            Search restaurants, doctors, shops, services & more — near you or anywhere.
          </p>

          {/* ── Smart Search Bar ── */}
          <div style={{ display: 'flex', gap: 8, maxWidth: 680, margin: '0 auto', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>

            {/* City chip */}
            <div ref={cityRef} style={{ position: 'relative' }}>
              <button type="button" onClick={() => setShowCityPicker(p => !p)} className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, height: 50, whiteSpace: 'nowrap' }}>
                {locLoading
                  ? <div className="spinner" />
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                }
                {cityLabel}
              </button>
              {showCityPicker && (
                <div className="nav-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 300, minWidth: 260 }}>
                  <button type="button" onClick={detectCity} className="btn btn-accent btn-sm" style={{ width: '100%', marginBottom: 8 }}>
                    <LocIcon /> Detect My Location
                  </button>
                  <input value={cityInput} onChange={e => { setCityInput(e.target.value); setCity(e.target.value); setCityLabel(e.target.value || 'All Cities'); }}
                    placeholder="Type city…" autoFocus className="input"
                  />
                  <button type="button" onClick={() => { setCity(''); setCityLabel('All Cities'); setCityInput(''); setShowCityPicker(false); }}
                    style={{ marginTop: 6, fontSize: 12, color: 'var(--color-light-gray)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear → All India</button>
                </div>
              )}
            </div>

            {/* Main search box */}
            <div ref={searchRef} style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <form onSubmit={handleSearch}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-pure-white)', border: '2px solid var(--color-muted-border)', borderRadius: 'var(--radius-very-rounded)', overflow: 'hidden', height: 50, boxShadow: 'var(--shadow-subtle)' }}
                  onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-warm-terracotta)'; setShowResults(true); }}
                  onBlur={(e) => { if (!searchRef.current?.contains(e.relatedTarget as Node)) (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-muted-border)'; }}
                >
                  <div style={{ padding: '0 14px', color: 'var(--color-light-gray)', display: 'flex' }}><SearchIco /></div>
                  <input
                    value={query}
                    onChange={e => { setQuery(e.target.value); setShowResults(true); setShowCategories(false); }}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search businesses, categories, services…"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: 'var(--color-deep-charcoal)', fontFamily: 'inherit' }}
                  />
                  {query && (
                    <button type="button" onClick={() => { setQuery(''); setResults([]); }} style={{ padding: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-light-gray)', display: 'flex' }}><XIcon /></button>
                  )}
                  <button type="submit" className="btn btn-accent" style={{ height: '100%', borderRadius: 0, whiteSpace: 'nowrap' }}>Search</button>
                </div>
              </form>

              {/* Live results dropdown */}
              {showResults && (query.trim() || catSuggestions.length > 0) && (
                <div className="nav-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200, overflow: 'hidden', maxHeight: 420, overflowY: 'auto' }}>

                  {/* AI Summary */}
                  {isAiMode && aiSummary && (
                    <div style={{ padding: '12px 14px', background: 'rgba(217,119,87,0.05)', borderBottom: '1px solid rgba(217,119,87,0.2)', fontSize: 13, color: 'var(--color-deep-charcoal)', lineHeight: 1.5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 11, fontWeight: 700, color: 'var(--color-warm-terracotta)', textTransform: 'uppercase' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        AI Summary
                      </div>
                      {aiSummary}
                    </div>
                  )}

                  {/* Category suggestions */}
                  {catSuggestions.length > 0 && (
                    <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-muted-border)' }}>
                      <div style={{ padding: '4px 14px', fontSize: 11, fontWeight: 600, color: 'var(--color-light-gray)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categories</div>
                      {catSuggestions.map(cat => (
                        <button key={cat.id}
                          onClick={() => { router.push(`/listings?category=${encodeURIComponent(cat.name)}${city ? `&city=${encodeURIComponent(city)}` : ''}`); setShowResults(false); }}
                          className="nav-dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                          <span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-deep-charcoal)' }}>{cat.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--color-light-gray)', marginLeft: 8 }}>{cat.group}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Business results */}
                  {searching ? (
                    <div style={{ padding: 16, textAlign: 'center', color: 'var(--color-light-gray)', fontSize: 13 }}>Searching…</div>
                  ) : results.length > 0 ? (
                    <div>
                      <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 600, color: 'var(--color-light-gray)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Businesses</div>
                      {results.map(biz => (
                        <Link key={biz.slug} href={`/business/${biz.slug}`} onClick={() => setShowResults(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', textDecoration: 'none', borderTop: '1px solid var(--color-muted-border)' }}
                          className="nav-dropdown-item">
                          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-rounded)', background: 'rgba(217,119,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🏪</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-deep-charcoal)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              {biz.name}
                              {biz.verified && <span className="badge badge-success" style={{ fontSize: 10 }}>Verified</span>}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--color-light-gray)', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span>{biz.category}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin />{biz.area ? `${biz.area}, ${biz.city}` : biz.city}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link href={`/listings?q=${encodeURIComponent(query)}${city ? `&city=${encodeURIComponent(city)}` : ''}`}
                        onClick={() => setShowResults(false)}
                        style={{ display: 'block', padding: '10px 14px', textAlign: 'center', fontSize: 13, color: 'var(--color-warm-terracotta)', fontWeight: 600, textDecoration: 'none', borderTop: '1px solid var(--color-muted-border)', background: 'var(--color-off-white)' }}>
                        See all results for &quot;{query}&quot; →
                      </Link>
                    </div>
                  ) : query.trim() ? (
                    <div style={{ padding: '16px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--color-light-gray)' }}>No results for &quot;{query}&quot;</span>
                      <br />
                      <Link href={`/listings?q=${encodeURIComponent(query)}`} style={{ fontSize: 12, color: 'var(--color-warm-terracotta)', fontWeight: 600, textDecoration: 'none' }}>Browse all listings →</Link>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Popular chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
            {POPULAR.map(p => (
              <button key={p} onClick={() => { setQuery(p); setShowResults(true); }} className="chip">{p}</button>
            ))}
            <button onClick={() => setShowCategories(p => !p)} className={`chip ${showCategories ? 'active' : ''}`}>
              All Categories ▾
            </button>
          </div>

          {/* Category browser */}
          {showCategories && (
            <div style={{ maxWidth: 680, margin: '0 auto 12px', background: 'var(--color-pure-white)', border: '1px solid var(--color-muted-border)', borderRadius: 'var(--radius-very-rounded)', padding: 16, boxShadow: 'var(--shadow-medium)', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-light-gray)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Groups</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {CATEGORY_GROUPS.map(g => (
                  <button key={g} onClick={() => setCatGroup(catGroup === g ? '' : g)} className={`chip ${catGroup === g ? 'active' : ''}`}>{g}</button>
                ))}
              </div>
              {catGroup && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-light-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{catGroup}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {groupCats.map(cat => (
                      <button key={cat.id}
                        onClick={() => { router.push(`/listings?category=${encodeURIComponent(cat.name)}${city ? `&city=${encodeURIComponent(city)}` : ''}`); setShowCategories(false); }}
                        className="chip">{cat.name}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[['10,000+', 'Businesses Listed'], ['500+', 'Cities Covered'], ['50+', 'Categories']].map(([n, l]) => (
            <div key={l} className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, color: 'var(--color-warm-terracotta)', fontFamily: 'var(--font-display)' }}>{n}</div>
              <div style={{ fontSize: 11, color: 'var(--color-light-gray)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recently added ── */}
      {allBiz.length > 0 && (
        <section style={{ padding: '0 16px 64px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 700, color: 'var(--color-deep-charcoal)' }}>Recently Listed</h2>
              <Link href="/listings" style={{ fontSize: 13, color: 'var(--color-warm-terracotta)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {allBiz.slice(0, 8).map(biz => (
                <Link key={biz.slug} href={`/business/${biz.slug}`} className="card" style={{ textDecoration: 'none', display: 'block', padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-deep-charcoal)', lineHeight: 1.3 }}>{biz.name}</h3>
                    {biz.verified && <span className="badge badge-success" style={{ fontSize: 9, whiteSpace: 'nowrap' }}>Verified</span>}
                  </div>
                  <span className="badge badge-accent" style={{ fontSize: 10 }}>{biz.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--color-light-gray)', fontSize: 11, marginTop: 8 }}>
                    <MapPin />{biz.area ? `${biz.area}, ${biz.city}` : biz.city}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '60px 16px 100px', background: 'var(--color-off-white)', borderTop: '1px solid var(--color-muted-border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,2.5vw,2.2rem)', color: 'var(--color-deep-charcoal)', marginBottom: 12 }}>Own a Business?</h2>
          <p style={{ fontSize: 15, color: 'var(--color-light-gray)', marginBottom: 28 }}>List it free on BhartiyaBazar and reach customers in your city.</p>
          <Link href="/list-business" className="btn btn-accent btn-lg">
            List Your Business Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
