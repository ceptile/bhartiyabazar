'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Listing {
  slug: string;
  name: string;
  category: string;
  city: string;
  area?: string;
  description?: string;
  verified?: boolean;
}

interface AIResult {
  summary: string;
  slugs: string[];
}

let cachedListings: Listing[] | null = null;

async function getListings(): Promise<Listing[]> {
  if (cachedListings) return cachedListings;
  const snap = await getDocs(collection(db, 'businesses'));
  cachedListings = snap.docs
    .map((d) => ({ slug: d.id, ...d.data() } as Listing))
    .filter((b) => (b as unknown as Record<string, string>).status !== 'rejected');
  return cachedListings;
}

export default function AISearch() {
  const [query, setQuery]       = useState('');
  const [status, setStatus]     = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult]     = useState<AIResult | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // preload listings in background
  useEffect(() => { getListings().then(setListings); }, []);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 3) { setStatus('idle'); setResult(null); return; }
    setStatus('loading');
    try {
      const all = listings.length ? listings : await getListings();
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, listings: all }),
      });
      if (!res.ok) throw new Error('API error');
      const data: AIResult = await res.json();
      setResult(data);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }, [listings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setStatus('idle'); setResult(null); return; }
    debounceRef.current = setTimeout(() => runSearch(val), 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      runSearch(query);
    }
    if (e.key === 'Escape') { setQuery(''); setStatus('idle'); setResult(null); }
  };

  const resultMap = result
    ? Object.fromEntries(
        listings
          .filter((b) => result.slugs.includes(b.slug))
          .map((b) => [b.slug, b])
      )
    : {};

  const orderedResults = result?.slugs
    .map((s) => resultMap[s])
    .filter(Boolean) ?? [];

  return (
    <div style={{ width: '100%', maxWidth: 680, margin: '0 auto', position: 'relative' }}>
      {/* Search bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px',
        borderRadius: 'var(--r-full)',
        border: '2px solid var(--amber)',
        background: 'var(--surface)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <span style={{ fontSize: 20 }}>✨</span>
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything… e.g. best paneer dhaba in Faridabad"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: 15, color: 'var(--text-primary)',
            fontFamily: 'inherit',
          }}
        />
        {status === 'loading' && (
          <div style={{
            width: 18, height: 18,
            border: '2.5px solid var(--amber)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'ai-spin 0.7s linear infinite',
            flexShrink: 0,
          }} />
        )}
        {query && status !== 'loading' && (
          <button
            onClick={() => { setQuery(''); setStatus('idle'); setResult(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 18, lineHeight: 1, padding: 0 }}
            aria-label="Clear"
          >×</button>
        )}
      </div>

      {/* Results panel */}
      {(status === 'done' || status === 'error') && (
        <div style={{
          marginTop: 10,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {status === 'error' && (
            <div style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: 14 }}>
              ⚠️ Could not complete AI search. Please try again.
            </div>
          )}

          {status === 'done' && (
            <>
              {/* AI Summary */}
              {result?.summary && (
                <div style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--amber-subtle)',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🤖</span>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {result.summary}
                  </p>
                </div>
              )}

              {/* Business results */}
              {orderedResults.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  No matching businesses found. Try a different query.
                </div>
              ) : (
                <div>
                  {orderedResults.map((biz, i) => (
                    <Link
                      key={biz.slug}
                      href={`/business/${biz.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 20px',
                        borderBottom: i < orderedResults.length - 1 ? '1px solid var(--border)' : 'none',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--r-md)',
                        background: 'var(--amber-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                      }}>🏪</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {biz.name}
                          </span>
                          {biz.verified && (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 'var(--r-full)', background: '#d1fae5', color: '#065f46', flexShrink: 0 }}>✓</span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                          {biz.category}
                          {biz.city ? ` · ${biz.area ? biz.area + ', ' : ''}${biz.city}` : ''}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-faint)', flexShrink: 0 }}>→</span>
                    </Link>
                  ))}

                  {/* See all link */}
                  <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <Link
                      href={`/listings?q=${encodeURIComponent(query)}`}
                      style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      See all results in Listings →
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes ai-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
