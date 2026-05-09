'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, MapPin, Grid, Map, SlidersHorizontal, X } from 'lucide-react';

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
}

const CITIES = [
  'Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune',
  'Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida',
  'Faridabad','Firozabad','Agra','Mathura','Aligarh','Meerut',
];

export default function ListingsPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');
  const [cityFilter, setCityFilter] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [catSelected, setCatSelected] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'businesses'));
        const data: Listing[] = snap.docs.map(d => ({
          slug: d.id,
          ...d.data(),
        } as Listing));
        setAllListings(data.filter(b => b.status !== 'rejected'));
      } catch (e) {
        console.error('[listings] fetch error', e);
        setAllListings([]);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let data = [...allListings];
    if (cityFilter) data = data.filter(b => b.city?.toLowerCase().includes(cityFilter.toLowerCase()));
    if (catSelected) data = data.filter(b => b.category?.toLowerCase() === catSelected.toLowerCase());
    if (textSearch.trim()) {
      const q = textSearch.toLowerCase();
      data = data.filter(b => b.name?.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q));
    }
    setListings(data);
  }, [allListings, cityFilter, catSelected, textSearch]);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-off-white)', paddingTop: 60 }}>
      <div style={{ background: 'var(--color-pure-white)', borderBottom: '1px solid rgba(31, 30, 29, 0.1)', padding: '12px 16px', position: 'sticky', top: 60, zIndex: 90 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: 'var(--color-off-white)', border: '1px solid rgba(31, 30, 29, 0.15)', borderRadius: 10, padding: '0 12px', height: 42 }}>
            <Search size={15} style={{ color: 'var(--color-light-gray)', flexShrink: 0 }} />
            <input value={textSearch} onChange={e => setTextSearch(e.target.value)} placeholder="Search businesses..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--color-deep-charcoal)' }} />
            {textSearch && (
              <button onClick={() => setTextSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <X size={14} style={{ color: 'var(--color-light-gray)' }} />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 42, background: showFilters ? 'var(--color-warm-terracotta)' : 'var(--color-off-white)', color: showFilters ? '#fff' : 'var(--color-deep-charcoal)', border: '1px solid rgba(31, 30, 29, 0.15)', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <SlidersHorizontal size={14} />
            <span className="hide-mobile">Filters</span>
            {(cityFilter || catSelected) && (
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: showFilters ? '#fff' : 'var(--color-warm-terracotta)', color: showFilters ? 'var(--color-warm-terracotta)' : '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(cityFilter ? 1 : 0) + (catSelected ? 1 : 0)}</span>
            )}
          </button>
          <div style={{ display: 'flex', background: 'var(--color-off-white)', borderRadius: 8, border: '1px solid rgba(31, 30, 29, 0.15)', padding: 2, flexShrink: 0 }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', borderRadius: 6, background: viewMode === 'grid' ? 'var(--color-warm-terracotta)' : 'transparent', color: viewMode === 'grid' ? '#fff' : 'var(--color-light-gray)', border: 'none', cursor: 'pointer' }} aria-label="Grid view">
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode('split')} style={{ padding: '8px 12px', borderRadius: 6, background: viewMode === 'split' ? 'var(--color-warm-terracotta)' : 'transparent', color: viewMode === 'split' ? '#fff' : 'var(--color-light-gray)', border: 'none', cursor: 'pointer' }} aria-label="Map view">
              <Map size={16} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div style={{ marginTop: 12, padding: '16px 0 4px', borderTop: '1px solid rgba(31, 30, 29, 0.08)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-light-gray)', marginBottom: 6, display: 'block' }}>City</label>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ width: '100%', maxWidth: 300, padding: '10px 12px', border: '1px solid rgba(31, 30, 29, 0.15)', borderRadius: 8, fontSize: 14, color: 'var(--color-deep-charcoal)', background: 'var(--color-pure-white)', cursor: 'pointer' }}>
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-light-gray)', marginBottom: 6, display: 'block' }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Restaurant', 'Electronics', 'Healthcare', 'Clothing', 'Home Services', 'Auto Services', 'Education', 'Real Estate'].map(cat => (
                  <button key={cat} onClick={() => setCatSelected(catSelected === cat ? '' : cat)} style={{ padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, border: '1px solid', borderColor: catSelected === cat ? 'var(--color-warm-terracotta)' : 'rgba(31, 30, 29, 0.15)', background: catSelected === cat ? 'rgba(217, 119, 87, 0.1)' : 'var(--color-pure-white)', color: catSelected === cat ? 'var(--color-warm-terracotta)' : 'var(--color-medium-gray)', cursor: 'pointer', transition: 'all 180ms ease' }}>{cat}</button>
                ))}
              </div>
            </div>
            {(cityFilter || catSelected || textSearch) && (
              <button onClick={() => { setCityFilter(''); setCatSelected(''); setTextSearch(''); }} style={{ alignSelf: 'flex-start', padding: '8px 16px', background: 'none', border: '1px solid rgba(31, 30, 29, 0.15)', borderRadius: 8, fontSize: 13, color: 'var(--color-light-gray)', cursor: 'pointer' }}>Clear All Filters</button>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', maxWidth: 1440, margin: '0 auto' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-deep-charcoal)' }}>{listings.length}</span> businesses found
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: viewMode === 'split' ? '0 0 100%' : '1', overflowY: 'auto', padding: '8px 16px 24px', background: 'var(--color-off-white)' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: '8px 0' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: 'var(--color-pure-white)', borderRadius: 12, padding: 16, border: '1px solid rgba(31, 30, 29, 0.1)' }}>
                  <div className="skeleton" style={{ width: 60, height: 60, borderRadius: 10, marginBottom: 12 }} />
                  <div className="skeleton" style={{ width: '80%', height: 16, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '60%', height: 12, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '50%', height: 12 }} />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No businesses found</h3>
              <p style={{ fontSize: 14, color: 'var(--color-light-gray)', marginBottom: 20 }}>Try adjusting your search or filters</p>
              <button onClick={() => { setCityFilter(''); setCatSelected(''); setTextSearch(''); }} style={{ padding: '10px 20px', background: 'var(--color-warm-terracotta)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'split' ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {listings.map(biz => (
                <Link key={biz.slug} href={`/business/${biz.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, background: 'var(--color-pure-white)', border: '1px solid rgba(31, 30, 29, 0.1)', borderRadius: 14, padding: 16, transition: 'all 180ms ease' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; el.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}>
                  <div style={{ width: 72, height: 72, borderRadius: 10, background: 'rgba(217, 119, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🏪</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-deep-charcoal)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{biz.name}</h3>
                    <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'rgba(217, 119, 87, 0.1)', color: 'var(--color-warm-terracotta)', marginBottom: 6 }}>{biz.category || 'Business'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-light-gray)' }}>
                      <MapPin size={11} />
                      {biz.area || 'Local area'}, {biz.city || 'India'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}