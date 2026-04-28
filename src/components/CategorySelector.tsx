'use client';
import { useState, useRef, useEffect } from 'react';
import { ALL_CATEGORIES, CATEGORY_GROUPS, searchCategories } from '@/lib/categories';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CategorySelector({ value, onChange, placeholder = 'Search or browse categories…', required }: Props) {
  const [query, setQuery]         = useState(value);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchCategories>>([]);
  const [open, setOpen]           = useState(false);
  const [activeGroup, setActiveGroup] = useState(CATEGORY_GROUPS[0]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleInput = (v: string) => {
    setQuery(v);
    onChange('');
    if (v.length >= 1) {
      setSuggestions(searchCategories(v, 12));
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(true);
    }
  };

  const pick = (name: string) => {
    onChange(name);
    setQuery(name);
    setSuggestions([]);
    setOpen(false);
  };

  const groupCats = ALL_CATEGORIES.filter(c => c.group === activeGroup);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--r-md)', border: `1px solid ${open ? 'var(--amber)' : 'var(--border-hover)'}`, background: 'var(--bg)', cursor: 'text' }}
        onClick={() => setOpen(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: 'var(--text-faint)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit' }}
        />
        {value && (
          <button type="button" onClick={e => { e.stopPropagation(); pick(''); setQuery(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 400, overflow: 'hidden', maxHeight: 420 }}>

          {/* Search suggestions */}
          {suggestions.length > 0 ? (
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggestions</div>
              {suggestions.map(cat => (
                <button key={cat.id} type="button" onClick={() => pick(cat.name)}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)', alignSelf: 'center' }}>{cat.group}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Browse by group */
            <div style={{ display: 'flex', height: 360 }}>
              {/* Group sidebar */}
              <div style={{ width: 140, borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
                {CATEGORY_GROUPS.map(g => (
                  <button key={g} type="button" onClick={() => setActiveGroup(g)}
                    style={{ display: 'block', width: '100%', padding: '9px 12px', background: activeGroup === g ? 'var(--amber-subtle)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12, fontWeight: activeGroup === g ? 700 : 500, color: activeGroup === g ? 'var(--amber)' : 'var(--text-secondary)', borderLeft: activeGroup === g ? '3px solid var(--amber)' : '3px solid transparent' }}>
                    {g}
                  </button>
                ))}
              </div>
              {/* Categories in group */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {groupCats.map(cat => (
                    <button key={cat.id} type="button" onClick={() => pick(cat.name)}
                      style={{ padding: '6px 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 500, border: `1px solid ${value === cat.name ? 'var(--amber)' : 'var(--border)'}`, background: value === cat.name ? 'var(--amber-subtle)' : 'var(--bg)', color: value === cat.name ? 'var(--amber)' : 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { if (value !== cat.name) { e.currentTarget.style.borderColor = 'var(--amber-glow)'; e.currentTarget.style.background = 'var(--surface-2)'; }}}
                      onMouseLeave={e => { if (value !== cat.name) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
