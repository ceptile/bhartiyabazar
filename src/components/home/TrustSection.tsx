'use client';
import { useEffect, useRef, useState } from 'react';

const features = [
  { title:'Trust Score System', desc:'Every business gets a composite score based on verification, reviews, and response speed.', color:'var(--color-deep-purple)' },
  { title:'Verified Listings Only', desc:'We manually verify phone numbers, addresses, and business existence before verification badge.', color:'var(--color-success)' },
  { title:'Anti-Spam Protection', desc:'No forced calls. Controlled communication system prevents spam leads.', color:'var(--color-error)' },
  { title:'Always Up-to-Date', desc:'Regular prompts to businesses to keep info current. "Last updated" visible on every listing.', color:'var(--color-google-blue)' },
  { title:'Fair Ranking', desc:'Rankings based on trust, quality, and ratings — not just who paid more.', color:'var(--color-warning-amber)' },
  { title:'Free Analytics', desc:'Every seller gets free insights on views, leads, and customer engagement.', color:'var(--color-warm-terracotta)' },
];

const icons = [
  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
  'M12 2v4M12 18v4M4.93 4.93l2.83 2.83m12.48 12.48l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83m12.48-12.49l2.83-2.83',
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
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
    <section ref={ref} className="section" style={{ background:'var(--color-deep-charcoal)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(217,119,87,0.05) 1px, transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />
      <div className="container" style={{ position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <span style={{ display:'inline-block', padding:'6px 16px', borderRadius:'var(--radius-full)', background:'rgba(217,119,87,0.1)', border:'1px solid rgba(217,119,87,0.2)', fontSize:12, fontWeight:600, color:'var(--color-warm-terracotta)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:16 }}>Why BhartiyaBazar</span>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.6rem,4vw,2.8rem)', fontWeight:400, color:'#fff', letterSpacing:'-0.03em', marginBottom:12 }}>Built on Trust & Transparency</h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', maxWidth:480, margin:'0 auto' }}>We solve every problem that plagues current business directories</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {features.map((f,i) => (
            <div key={i} style={{
              padding:'28px',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:'var(--radius-very-rounded)',
              transition:'all var(--transition)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: `${i*80}ms`,
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background=`${f.color}10`; el.style.borderColor=`${f.color}30`; el.style.transform='translateY(-4px)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.04)'; el.style.borderColor='rgba(255,255,255,0.07)'; el.style.transform='translateY(0)'; }}
            >
              <div style={{ width:48, height:48, borderRadius:'var(--radius-very-rounded)', background:`${f.color}15`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icons[i]} />
                </svg>
              </div>
              <h3 style={{ fontSize:16, fontWeight:600, color:'#fff', marginBottom:8, fontFamily:'var(--font-body)' }}>{f.title}</h3>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
