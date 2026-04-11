import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)', padding: 'clamp(48px,8vw,80px) 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width:36,height:36,borderRadius:'var(--radius-md)',background:'linear-gradient(135deg,var(--saffron),var(--gold))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🏪</div>
              <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:18,color:'#fff' }}>Bhartiya<span style={{color:'var(--saffron)'}}>Bazar</span></div>
            </div>
            <p style={{ fontSize:14,color:'var(--text-muted)',lineHeight:1.7,maxWidth:260,marginBottom:20 }}>
              India's most trusted business search platform. Find verified businesses, compare prices, connect directly.
            </p>
            <div style={{ display:'flex',gap:10 }}>
              {[{icon:'𝕏',label:'Twitter'},{icon:'f',label:'Facebook'},{icon:'in',label:'LinkedIn'},{icon:'▶',label:'YouTube'}].map(s => (
                <a key={s.label} href="#" aria-label={s.label} style={{ width:34,height:34,borderRadius:'var(--radius-md)',background:'var(--surface-2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--text-secondary)',textDecoration:'none',transition:'all var(--transition)' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--saffron)';(e.currentTarget as HTMLElement).style.color='var(--saffron)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border)';(e.currentTarget as HTMLElement).style.color='var(--text-secondary)';}}
                >{s.icon}</a>
              ))}
            </div>
          </div>
          {/* Links */}
          {[
            { title:'Platform', links:[{label:'Find Businesses',href:'/search'},{label:'List Your Business',href:'/register'},{label:'Pricing Plans',href:'/pricing'},{label:'Dashboard',href:'/dashboard'}] },
            { title:'Company', links:[{label:'About Us',href:'/about'},{label:'Contact Us',href:'/contact'},{label:'Blog',href:'/blog'},{label:'Careers',href:'/careers'}] },
            { title:'Support', links:[{label:'Help Center',href:'/help'},{label:'Privacy Policy',href:'/privacy'},{label:'Terms of Service',href:'/terms'},{label:'Report Issue',href:'/contact'}] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:13,fontWeight:700,color:'var(--text-primary)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:16 }}>{col.title}</h4>
              <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:10 }}>
                {col.links.map(l => (
                  <li key={l.label}><Link href={l.href} style={{ fontSize:14,color:'var(--text-muted)',textDecoration:'none',transition:'color var(--transition)' }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--text-primary)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--text-muted)'}
                  >{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App badges */}
        <div style={{ padding:'24px 0',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',marginBottom:24,display:'flex',flexWrap:'wrap',gap:16,alignItems:'center',justifyContent:'space-between' }}>
          <p style={{ fontSize:14,color:'var(--text-muted)' }}>📱 Download the app <span style={{color:'var(--text-secondary)'}}>— Coming soon on Android & iOS</span></p>
          <div style={{ display:'flex',gap:10 }}>
            {['Google Play','App Store'].map(s => (
              <div key={s} style={{ padding:'8px 16px',background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:13,color:'var(--text-secondary)',cursor:'pointer' }}>{s} — Coming Soon</div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex',flexWrap:'wrap',gap:16,alignItems:'center',justifyContent:'space-between' }}>
          <p style={{ fontSize:13,color:'var(--text-muted)' }}>© {year} BhartiyaBazar. Made with ❤️ in India 🇮🇳</p>
          <div style={{ display:'flex',gap:20 }}>
            {['Privacy','Terms','Sitemap'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontSize:13,color:'var(--text-muted)',textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
