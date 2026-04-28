'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { searchCategories, ALL_CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories';
import { getUserLocation, reverseGeocode } from '@/lib/geo';
import Link from 'next/link';

const ROTATING = ['Electrician', 'Doctor', 'Restaurant', 'Tutor', 'Mechanic', 'Salon', 'Plumber', 'Gym', 'Lawyer', 'CA / Accountant'];

interface Business { slug: string; name: string; category: string; city: string; area?: string; description?: string; verified?: boolean; }

function MapPinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function SearchIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function XIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;
}

export default function HeroSection() {
  const [query2, setQuery2]     = useState('');
  const [city, setCity]         = useState('');
  const [cityLabel, setCityLabel] = useState('Detecting…');
  const [wordIdx, setWordIdx]   = useState(0);
  const [visible, setVisible]   = useState(true);
  const [results, setResults]   = useState<Business[]>([]);
  const [allData, setAllData]   = useState<Business[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [catSuggestions, setCatSuggestions] = useState<ReturnType<typeof searchCategories>>([]);
  const [showCatBrowse, setShowCatBrowse]   = useState(false);
  const [activeGroup, setActiveGroup]       = useState(CATEGORY_GROUPS[0]);
  const [selectedCat, setSelectedCat]       = useState('');
  const [locLoading, setLocLoading]         = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounce  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Rotating placeholder
  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % ROTATING.length); setVisible(true); }, 280);
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  // Live GPS location
  useEffect(() => {
    (async () => {
      setLocLoading(true);
      try {
        const pos = await getUserLocation();
        const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        const c = geo.city || geo.state || '';
        setCity(c);
        setCityLabel(c || 'All Cities');
      } catch {
        setCity('');
        setCityLabel('All Cities');
      }
      setLocLoading(false);
    })();
  }, []);

  // Preload all approved businesses for instant search
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'businesses'), where('status', '==', 'approved'), limit(300)));
        setAllData(snap.docs.map(d => ({ slug: d.id, ...d.data() } as Business)));
      } catch { /* silent */ }
    })();
  }, []);

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false); setShowCatBrowse(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const runSearch = useCallback((q: string, cat: string, c: string) => {
    if (!q.trim() && !cat) { setResults([]); setShowResults(false); return; }
    setSearching(true);
    const lower = q.toLowerCase();
    const catKeywords = cat ? (ALL_CATEGORIES.find(a => a.name === cat)?.keywords || []) : [];
    let filtered = allData.filter(b => {
      const cityMatch = !c || b.city.toLowerCase().includes(c.toLowerCase());
      const textMatch = !q.trim() || b.name.toLowerCase().includes(lower) ||
        b.category.toLowerCase().includes(lower) ||
        (b.description || '').toLowerCase().includes(lower) ||
        b.city.toLowerCase().includes(lower);
      const catMatch = !cat || b.category === cat ||
        catKeywords.some(k => b.category.toLowerCase().includes(k));
      return cityMatch && textMatch && catMatch;
    });
    // boost verified
    filtered = [...filtered.filter(b => b.verified), ...filtered.filter(b => !b.verified)];
    setResults(filtered.slice(0, 8));
    setShowResults(true);
    setSearching(false);
  }, [allData]);

  const handleInput = (v: string) => {
    setQuery2(v);
    if (debounce.current) clearTimeout(debounce.current);
    // Category suggestions
    if (v.length >= 1) {
      setCatSuggestions(searchCategories(v, 5));
    } else {
      setCatSuggestions([]);
    }
    debounce.current = setTimeout(() => runSearch(v, selectedCat, city), 220);
  };

  const handleCatPick = (name: string) => {
    setSelectedCat(name); setQuery2(name);
    setCatSuggestions([]); setShowCatBrowse(false);
    runSearch(name, name, city);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query2) p.set('q', query2);
    if (city)   p.set('city', city);
    if (selectedCat) p.set('cat', selectedCat);
    router.push(`/search?${p.toString()}`);
  };

  const detectCity = async () => {
    setLocLoading(true);
    try {
      const pos = await getUserLocation();
      const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      const c = geo.city || geo.state || '';
      setCity(c); setCityLabel(c || 'All Cities');
    } catch {
      setCity(''); setCityLabel('All Cities');
    }
    setLocLoading(false);
  };

  const groupCats = ALL_CATEGORIES.filter(c => c.group === activeGroup);

  return (
    <section style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', paddingTop: 64 }}>
      <div style={{ width: '100%', maxWidth: 780, padding: '0 clamp(16px,4vw,48px)', textAlign: 'center' }}>

        {/* Brand */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2.6rem,7vw,4.4rem)', letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)' }}>
            Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 'clamp(0.95rem,1.6vw,1.1rem)', color: 'var(--text-muted)' }}>
            Find the best{' '}
            <span style={{ color: 'var(--amber)', fontWeight: 600, display: 'inline-block', transition: 'opacity 0.28s ease, transform 0.28s ease', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-8px)' }}>
              {ROTATING[wordIdx]}
            </span>
            {' '}near you
          </div>
        </div>

        {/* Smart search box */}
        <div ref={searchRef} style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border-hover)', borderRadius: 'var(--r-xl)', padding: 6, display: 'flex', gap: 6, boxShadow: 'var(--shadow-lg)' }}>

              {/* Query input */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--bg)', border: '1px solid var(--border)', position: 'relative' }}>
                <span style={{ color: 'var(--text-faint)', display: 'flex', flexShrink: 0 }}><SearchIcon /></span>
                <input
                  value={query2}
                  onChange={e => handleInput(e.target.value)}
                  onFocus={() => { if (query2) setShowResults(true); }}
                  placeholder={`Search for ${ROTATING[wordIdx]}…`}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15, fontFamily: 'inherit' }}
                />
                {query2 && (
                  <button type="button" onClick={() => { setQuery2(''); setSelectedCat(''); setCatSuggestions([]); setResults([]); setShowResults(false); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}><XIcon /></button>
                )}
              </div>

              {/* City chip */}
              <button type="button" onClick={detectCity}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', borderRadius: 'var(--r-lg)', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer', minWidth: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <span style={{ color: locLoading ? 'var(--amber)' : 'var(--text-faint)', display: 'flex', flexShrink: 0 }}>{locLoading ? <div style={{ width: 14, height: 14, border: '2px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <MapPinIcon />}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{cityLabel}</span>
              </button>

              <button type="submit" style={{ padding: '11px 24px', fontSize: 14, borderRadius: 'var(--r-lg)', background: 'var(--amber)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                Search
              </button>
            </div>
          </form>

          {/* Category suggestions dropdown */}
          {catSuggestions.length > 0 && !showResults && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 500, overflow: 'hidden' }}>
              <div style={{ padding: '7px 14px 3px', fontSize: 11, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categories</div>
              {catSuggestions.map(cat => (
                <button key={cat.id} type="button" onClick={() => handleCatPick(cat.name)}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{cat.group}</span>
                </button>
              ))}
            </div>
          )}

          {/* Live search results */}
          {showResults && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 500, overflow: 'hidden' }}>
              {searching ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Searching…</div>
              ) : results.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>No businesses found. Try different keywords.</div>
                  <Link href={`/listings?q=${encodeURIComponent(query2)}`} style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>Browse all listings →</Link>
                </div>
              ) : (
                <>
                  {results.map(biz => (
                    <Link key={biz.slug} href={`/business/${biz.slug}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'var(--amber-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 16 }}>🏪</span>
                      </div>
                      <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {biz.name}
                          {biz.verified && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{biz.category} · {biz.area ? `${biz.area}, ${biz.city}` : biz.city}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-faint)', flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  ))}
                  <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
                    <button type="button" onClick={handleSubmit as unknown as React.MouseEventHandler}
                      style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      See all results for &ldquo;{query2}&rdquo; →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick category browse */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Browse</span>
            <button type="button" onClick={() => setShowCatBrowse(p => !p)}
              style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
              {showCatBrowse ? 'Hide categories' : 'All categories'}
            </button>
          </div>

          {/* Popular quick chips */}
          {!showCatBrowse && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Restaurant', 'Doctor / Clinic', 'Electrician', 'Plumber', 'Salon / Hair Studio', 'Tutor / Home Tuition', 'Gym / Fitness Center', 'Grocery / Kirana'].map(name => (
                <button key={name} type="button" onClick={() => handleCatPick(name)}
                  style={{ padding: '6px 14px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 500, border: `1px solid ${selectedCat === name ? 'var(--amber)' : 'var(--border)'}`, background: selectedCat === name ? 'var(--amber-subtle)' : 'var(--surface)', color: selectedCat === name ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}
                  onMouseEnter={e => { if (selectedCat !== name) e.currentTarget.style.borderColor = 'var(--amber-glow)'; }}
                  onMouseLeave={e => { if (selectedCat !== name) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Full category browser */}
          {showCatBrowse && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', textAlign: 'left', maxHeight: 380 }}>
              <div style={{ display: 'flex', height: 380 }}>
                <div style={{ width: 140, borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
                  {CATEGORY_GROUPS.map(g => (
                    <button key={g} type="button" onClick={() => setActiveGroup(g)}
                      style={{ display: 'block', width: '100%', padding: '9px 12px', background: activeGroup === g ? 'var(--amber-subtle)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12, fontWeight: activeGroup === g ? 700 : 500, color: activeGroup === g ? 'var(--amber)' : 'var(--text-secondary)', borderLeft: activeGroup === g ? '3px solid var(--amber)' : '3px solid transparent' }}>
                      {g}
                    </button>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {groupCats.map(cat => (
                      <button key={cat.id} type="button" onClick={() => { handleCatPick(cat.name); setShowCatBrowse(false); }}
                        style={{ padding: '6px 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 500, border: `1px solid ${selectedCat === cat.name ? 'var(--amber)' : 'var(--border)'}`, background: selectedCat === cat.name ? 'var(--amber-subtle)' : 'var(--bg)', color: selectedCat === cat.name ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer' }}
                        onMouseEnter={e => { if (selectedCat !== cat.name) e.currentTarget.style.borderColor = 'var(--amber-glow)'; }}
                        onMouseLeave={e => { if (selectedCat !== cat.name) e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}
