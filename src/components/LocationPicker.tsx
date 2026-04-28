'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { reverseGeocode, getUserLocation, forwardGeocode } from '@/lib/geo';

export interface LocationValue {
  country: string;
  state: string;
  city: string;
  area: string;
  street: string;
  building: string;
  postcode: string;
}

const EMPTY: LocationValue = { country: '', state: '', city: '', area: '', street: '', building: '', postcode: '' };

interface Props {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  required?: boolean;
  showBuilding?: boolean;
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
  border: '1px solid var(--border-hover)', background: 'var(--bg)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
};

const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--amber)');
const blurStyle  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--border-hover)');

export default function LocationPicker({ value, onChange, required, showBuilding = true }: Props) {
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError]     = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; address: Record<string, string> }>>([]);
  const [cityQuery, setCityQuery]     = useState(value.city);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sugRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setCityQuery(value.city); }, [value.city]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (sugRef.current && !sugRef.current.contains(e.target as Node)) setSuggestions([]);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const fetchLiveLocation = useCallback(async () => {
    setLocLoading(true); setLocError('');
    try {
      const pos = await getUserLocation();
      const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      onChange({
        country: geo.country,
        state: geo.state,
        city: geo.city,
        area: geo.area,
        street: geo.street,
        building: value.building,
        postcode: geo.postcode,
      });
      setCityQuery(geo.city);
    } catch {
      setLocError('Location access denied. Please enter manually.');
    }
    setLocLoading(false);
  }, [value.building, onChange]);

  const handleCityInput = (v: string) => {
    setCityQuery(v);
    onChange({ ...value, city: v });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      const results = await forwardGeocode(v + ' ' + (value.state || value.country || 'India'));
      setSuggestions(results.slice(0, 5));
    }, 400);
  };

  const pickSuggestion = (s: { display_name: string; address: Record<string, string> }) => {
    const a = s.address;
    const city = a.city || a.town || a.village || a.county || '';
    onChange({
      ...value,
      country: a.country || value.country,
      state: a.state || value.state,
      city,
      area: a.suburb || a.neighbourhood || value.area,
      postcode: a.postcode || value.postcode,
    });
    setCityQuery(city);
    setSuggestions([]);
  };

  const set = (k: keyof LocationValue) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Live location button */}
      <button type="button" onClick={fetchLiveLocation} disabled={locLoading}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--amber-glow)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontWeight: 600, fontSize: 13, cursor: locLoading ? 'wait' : 'pointer', width: 'fit-content' }}>
        {locLoading
          ? <><div style={{ width: 14, height: 14, border: '2px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Detecting…</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8" strokeDasharray="2 2"/></svg> Use My Live Location</>
        }
      </button>
      {locError && <p style={{ fontSize: 12, color: 'var(--error, #c0392b)' }}>{locError}</p>}

      {/* Country + State */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country {required && '*'}</label>
          <input style={inp} placeholder="India" value={value.country} onChange={set('country')} onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>State {required && '*'}</label>
          <input style={inp} placeholder="Uttar Pradesh" value={value.state} onChange={set('state')} onFocus={focusStyle} onBlur={blurStyle} />
        </div>
      </div>

      {/* City with autocomplete */}
      <div ref={sugRef} style={{ position: 'relative' }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>City / District {required && '*'}</label>
        <input style={inp} placeholder="Agra, Lucknow, Delhi…" value={cityQuery}
          onChange={e => handleCityInput(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
        {suggestions.length > 0 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 300, overflow: 'hidden' }}>
            {suggestions.map((s, i) => (
              <button key={i} type="button" onClick={() => pickSuggestion(s)}
                style={{ display: 'block', width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Area / Locality */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Area / Suburb / Locality</label>
        <input style={inp} placeholder="Karol Bagh, Sector 18, Civil Lines…" value={value.area} onChange={set('area')} onFocus={focusStyle} onBlur={blurStyle} />
      </div>

      {/* Street */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Street / Colony / Road</label>
        <input style={inp} placeholder="MG Road, Station Street, Nehru Marg…" value={value.street} onChange={set('street')} onFocus={focusStyle} onBlur={blurStyle} />
      </div>

      {/* Building + Postcode */}
      {showBuilding && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Building / House / Flat No.</label>
            <input style={inp} placeholder="Shop 4, Plot 12B, Flat 302…" value={value.building} onChange={set('building')} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pincode</label>
            <input style={inp} placeholder="282001" value={value.postcode} onChange={set('postcode')} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
