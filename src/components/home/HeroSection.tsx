'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/data';

const ROTATING_WORDS = ['Electrician', 'Doctor', 'Restaurant', 'Tutor', 'Mechanic', 'Salon', 'Plumber', 'Gym'];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWordIdx(i => (i+1) % ROTATING_WORDS.length); setVisible(true); }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    router.push(`/search?${params.toString()}`);
  };

  const quickLinks = ['AC Repair', 'Doctor', 'Restaurant', 'Tutor', 'Salon'];

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--navy)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 64,
    }}>
      {/* Animated background */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize:'60px 60px' }} />
        {/* Glows */}
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60%', height:'60%', background:'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)', animation:'float 8s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'50%', height:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', animation:'float 10s ease-in-out infinite reverse' }} />
        <div style={{ position:'absolute', top:'30%', right:'20%', width:'30%', height:'30%', background:'radial-gradient(circle, rgba(0,168,107,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="container" style={{ position:'relative', zIndex:1, padding:'clamp(40px,8vw,80px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center' }}>
          {/* Trust pill */}
          <div className="animate-fadeUp" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:'var(--radius-full)', background:'rgba(255,107,0,0.1)', border:'1px solid rgba(255,107,0,0.2)', marginBottom:32 }}>
            <span style={{ fontSize:12 }}>🇮🇳</span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:500 }}>Trusted by 2,80,000+ Indians</span>
            <span style={{ fontSize:11, background:'var(--saffron)', color:'#fff', padding:'2px 8px', borderRadius:99, fontWeight:700 }}>FREE</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fadeUp delay-100" style={{ fontSize:'clamp(2.2rem,6vw,4.5rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:20 }}>
            Find the Best
            <span style={{ display:'block', position:'relative' }}>
              <span
                style={{
                  color: 'var(--saffron)',
                  display:'inline-block',
                  transition:'opacity 0.3s ease, transform 0.3s ease',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(-8px)',
                }}
              >{ROTATING_WORDS[wordIdx]}</span>
              <span style={{ color:'rgba(255,255,255,0.4)' }}> Near You</span>
            </span>
          </h1>

          <p className="animate-fadeUp delay-200" style={{ fontSize:'clamp(1rem,2vw,1.2rem)', color:'rgba(255,255,255,0.6)', maxWidth:540, margin:'0 auto 40px', lineHeight:1.7 }}>
            Search 50,000+ verified businesses. Compare prices. Contact directly. <strong style={{ color:'rgba(255,255,255,0.85)' }}>No middlemen, no spam.</strong>
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="animate-fadeUp delay-300">
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--radius-xl)',
              padding: 8,
              display: 'flex',
              gap: 8,
              maxWidth: 660,
              margin: '0 auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}>
              {/* Search input */}
              <div style={{ flex:1, display:'flex', alignItems:'center', gap:12, padding:'8px 16px', borderRadius:'var(--radius-lg)', background:'rgba(255,255,255,0.06)' }}>
                <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search businesses, products, services..."
                  style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:15 }}
                />
              </div>
              {/* City input */}
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:'var(--radius-lg)', background:'rgba(255,255,255,0.06)', minWidth:130 }}>
                <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  style={{ width:80, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:14 }}
                />
              </div>
              <button type="submit" className="btn-saffron" style={{ padding:'12px 24px', fontSize:14, borderRadius:'var(--radius-lg)', whiteSpace:'nowrap' }}>
                Search
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="animate-fadeUp delay-400" style={{ marginTop:24, display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)', alignSelf:'center' }}>Popular:</span>
            {quickLinks.map(q => (
              <a key={q} href={`/search?q=${encodeURIComponent(q)}`}
                style={{ padding:'6px 16px', borderRadius:'var(--radius-full)', border:'1px solid rgba(255,255,255,0.12)', fontSize:13, color:'rgba(255,255,255,0.7)', transition:'all 0.2s', cursor:'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--saffron)'; (e.currentTarget as HTMLElement).style.color='var(--saffron)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.7)'; }}
              >{q}</a>
            ))}
          </div>

          {/* Category chips */}
          <div className="animate-fadeUp delay-500" style={{ marginTop:40, display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
            {categories.slice(0,8).map(cat => (
              <a key={cat.id} href={`/search?category=${cat.slug}`}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:'var(--radius-full)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', fontSize:13, color:'rgba(255,255,255,0.7)', transition:'all 0.25s', cursor:'pointer' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,107,0,0.12)'; el.style.borderColor='rgba(255,107,0,0.3)'; el.style.color='#fff'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.05)'; el.style.borderColor='rgba(255,255,255,0.08)'; el.style.color='rgba(255,255,255,0.7)'; }}
              >
                <span>{cat.icon}</span>
                {cat.name.split(' ')[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, animation:'float 2s ease-in-out infinite' }}>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Scroll</span>
        <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </section>
  );
}
