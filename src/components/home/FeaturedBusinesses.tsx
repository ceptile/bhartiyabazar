'use client';
import { useEffect, useRef, useState } from 'react';
import BusinessCard from '@/components/shared/BusinessCard';
import { businesses } from '@/lib/data';
import Link from 'next/link';

export default function FeaturedBusinesses() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold:0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background:'var(--surface-2)' }}>
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:16 }}>
          <div>
            <span style={{ display:'inline-block', padding:'6px 16px', borderRadius:'var(--radius-full)', background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.15)', fontSize:12, fontWeight:600, color:'var(--saffron)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:12 }}>⚡ Featured</span>
            <h2 style={{ fontSize:'clamp(1.6rem,4vw,2.8rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.03em', marginBottom:8 }}>Top Rated Businesses</h2>
            <p style={{ fontSize:15, color:'var(--text-muted)' }}>Hand-picked, verified, and trusted by thousands of customers</p>
          </div>
          <Link href="/search" style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:'var(--radius-full)', border:'1.5px solid var(--border-strong)', color:'var(--text)', fontSize:13, fontWeight:600, textDecoration:'none', transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor='var(--saffron)'; el.style.color='var(--saffron)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor='var(--border-strong)'; el.style.color='var(--text)'; }}
          >
            View All
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
          {businesses.map((biz,i) => (
            <div key={biz.id} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i*80}ms` }}>
              <BusinessCard biz={biz} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
