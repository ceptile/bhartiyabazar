'use client';
import { useEffect, useRef, useState } from 'react';

const features = [
  { icon:'🛡️', title:'Trust Score System', desc:'Every business gets a composite score based on verification, reviews, and response speed.', color:'#8b5cf6' },
  { icon:'✅', title:'Verified Listings Only', desc:'We manually verify phone numbers, addresses, and business existence before verification badge.', color:'#10b981' },
  { icon:'🚫', title:'Anti-Spam Protection', desc:'No forced calls. Controlled communication system prevents spam leads.', color:'#ef4444' },
  { icon:'📅', title:'Always Up-to-Date', desc:'Regular prompts to businesses to keep info current. "Last updated" visible on every listing.', color:'#3b82f6' },
  { icon:'🏆', title:'Fair Ranking', desc:'Rankings based on trust, quality, and ratings — not just who paid more.', color:'#f59e0b' },
  { icon:'📊', title:'Free Analytics', desc:'Every seller gets free insights on views, leads, and customer engagement.', color:'#FF6B00' },
];

export default function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold:0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background:'var(--navy)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,107,0,0.05) 1px, transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />
      <div className="container" style={{ position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <span style={{ display:'inline-block', padding:'6px 16px', borderRadius:'var(--radius-full)', background:'rgba(255,107,0,0.1)', border:'1px solid rgba(255,107,0,0.2)', fontSize:12, fontWeight:600, color:'var(--saffron)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:16 }}>Why BhartiyaBazar</span>
          <h2 style={{ fontSize:'clamp(1.6rem,4vw,2.8rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', marginBottom:12 }}>Built on Trust & Transparency</h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', maxWidth:480, margin:'0 auto' }}>We solve every problem that plagues current business directories</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {features.map((f,i) => (
            <div key={i} style={{
              padding:'28px',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:'var(--radius-xl)',
              transition:'all 0.3s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: `${i*80}ms`,
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background=`${f.color}10`; el.style.borderColor=`${f.color}30`; el.style.transform='translateY(-4px)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.04)'; el.style.borderColor='rgba(255,255,255,0.07)'; el.style.transform='translateY(0)'; }}
            >
              <div style={{ fontSize:32, marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
