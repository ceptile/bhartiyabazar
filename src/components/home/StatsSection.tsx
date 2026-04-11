'use client';
import { useEffect, useRef, useState } from 'react';
import { stats } from '@/lib/data';

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold:0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'32px 0' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:0 }}>
          {stats.map((s,i) => (
            <div key={i} style={{
              textAlign:'center', padding:'20px 16px',
              borderRight: i < stats.length-1 ? '1px solid var(--border)' : 'none',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i*100}ms`,
            }}>
              <div style={{ fontSize:28, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, color:'var(--text)', fontFamily:'var(--font-display)', letterSpacing:'-0.03em' }}>{s.value}</div>
              <div style={{ fontSize:13, color:'var(--text-faint)', fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
