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
  lat?: number;
  lng?: number;
}

const CITIES = [
  'Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune',
  'Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida',
  'Faridabad','Firozabad','Agra','Mathura','Aligarh','Meerut',
];

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

export default function ListingsPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [listings,    setListings]    = useState<Listing[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [viewMode,    setViewMode]    = useState<'grid' | 'split'>('grid');

  const [cityFilter,  setCityFilter]  = useState('');
  const [textSearch,  setTextSearch]  = useState('');
  const [catSelected, setCatSelected] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'businesses'));
        const data: Listing[] = snap.docs.map(d => ({ 
          slug: d.id, 
          ...d.data(),
          // Mocking lat/lng for visualization
          lat: (d.data() as any).lat || (28.6139 + (Math.random() - 0.5) * 0.1),
          lng: (d.data() as any).lng || (77.2090 + (Math.random() - 0.5) * 0.1)
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
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64, display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Filter Bar */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 24px', position: 'sticky', top: 64, zIndex: 100 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)' }}>
            <SearchIcon size={14} />
            <input value={textSearch} onChange={e => setTextSearch(e.target.value)} placeholder="Search businesses..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: 2 }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '6px 12px', borderRadius: 'var(--r-sm)', background: viewMode === 'grid' ? 'var(--amber)' : 'transparent', color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Grid</button>
            <button onClick={() => setViewMode('split')} style={{ padding: '6px 12px', borderRadius: 'var(--r-sm)', background: viewMode === 'split' ? 'var(--amber)' : 'transparent', color: viewMode === 'split' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Split Map</button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Results Sidebar/Grid */}
        <div style={{ 
          flex: viewMode === 'split' ? '0 0 450px' : '1', 
          overflowY: 'auto', 
          padding: '24px', 
          background: 'var(--bg)',
          borderRight: viewMode === 'split' ? '1px solid var(--border)' : 'none'
        }}>
          <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            {listings.length} results found
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'split' ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {listings.map(biz => (
              <Link key={biz.slug} href={`/business/${biz.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 16, transition: 'all 0.2s' }}>
                <div style={{ width: 80, height: 80, borderRadius: 'var(--r-md)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🏪</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{biz.name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, marginBottom: 4 }}>{biz.category}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <MapPin /> {biz.area}, {biz.city}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'split' && (
          <div style={{ flex: 1, background: '#e5e7eb', position: 'relative' }}>
            {/* Placeholder for real Map integration (e.g. Google Maps or Leaflet) */}
            <div style={{ position: 'absolute', inset: 0, background: 'url(https://st4.depositphotos.com/2627021/30954/v/450/depositphotos_309549320-stock-illustration-map-city-vector-top-view.jpg)', backgroundSize: 'cover', opacity: 0.5 }} />
            
            {listings.slice(0, 10).map((biz, i) => (
              <div key={biz.slug} style={{ 
                position: 'absolute', 
                top: `${40 + (Math.random() - 0.5) * 40}%`, 
                left: `${40 + (Math.random() - 0.5) * 40}%`,
                background: 'var(--amber)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
                fontSize: 12,
                fontWeight: 700,
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                ₹ {biz.name.slice(0, 10)}...
              </div>
            ))}

            <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'var(--surface)', padding: '12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', maxWidth: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Map Legend</div>
              <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>Interactive map powered by BhartiyaBazar Engine. Click markers to view details.</div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--border-strong); borderRadius: 10px; }
      `}</style>
    </div>
  );
}
