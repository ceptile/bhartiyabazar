import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label:'Search Businesses', href:'/search' },
      { label:'All Categories', href:'/categories' },
      { label:'List Your Business', href:'/register-business' },
      { label:'Seller Dashboard', href:'/dashboard' },
    ],
    Cities: [
      { label:'Bhiwadi', href:'/search?city=bhiwadi' },
      { label:'Jaipur', href:'/search?city=jaipur' },
      { label:'Delhi', href:'/search?city=delhi' },
      { label:'Mumbai', href:'/search?city=mumbai' },
      { label:'Bangalore', href:'/search?city=bangalore' },
    ],
    Company: [
      { label:'About Us', href:'/about' },
      { label:'Privacy Policy', href:'/privacy' },
      { label:'Terms of Service', href:'/terms' },
      { label:'Contact Us', href:'/contact' },
    ],
  };

  return (
    <footer style={{ background:'var(--navy)', color:'rgba(255,255,255,0.7)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="container" style={{ padding:'48px clamp(16px,4vw,40px) 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:40, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg, #FF6B00, #FF8C38)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                  <path d="M8 11h6M11 8v6" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'#fff' }}>Bhartiya<span style={{ color:'#FF6B00' }}>Bazar</span></span>
            </div>
            <p style={{ fontSize:13, lineHeight:1.7, marginBottom:20, color:'rgba(255,255,255,0.5)' }}>India&apos;s most trusted business search platform. Find verified businesses, compare prices, connect directly.</p>
            <div style={{ display:'flex', gap:10 }}>
              {['📱','💬','📧'].map((icon,i) => (
                <a key={i} href="#" style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, transition:'all 0.2s' }}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 style={{ color:'#fff', fontWeight:600, fontSize:14, marginBottom:16, letterSpacing:'0.02em' }}>{title}</h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                {items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} style={{ fontSize:13, color:'rgba(255,255,255,0.5)', transition:'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color='#FF6B00')}
                      onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.5)')}
                    >{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>© {year} BhartiyaBazar. Made with ❤️ in India 🇮🇳</p>
          <div style={{ display:'flex', gap:16 }}>
            {[{ label:'Privacy', href:'/privacy' },{ label:'Terms', href:'/terms' }].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize:12, color:'rgba(255,255,255,0.35)', transition:'color 0.2s' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
