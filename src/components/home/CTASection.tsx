import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="section" style={{ background:'var(--bg)' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, #1a2040 50%, #0f1628 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(40px, 6vw, 72px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.15) 0%, transparent 60%)', pointerEvents:'none' }} />
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
            <h2 style={{ fontSize:'clamp(1.8rem,5vw,3.2rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', marginBottom:16 }}>
              List Your Business <span style={{ color:'var(--saffron)' }}>for FREE</span>
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
              Join 50,000+ businesses already on BhartiyaBazar. Get discovered by lakhs of customers. No commission. No hidden fees. Ever.
            </p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/register-business" className="btn-saffron" style={{ fontSize:15, padding:'14px 36px' }}>List Your Business — Free</Link>
              <Link href="/search" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:'var(--radius-full)', border:'1.5px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.8)', fontSize:15, fontWeight:500, textDecoration:'none', transition:'all 0.2s' }}>Explore Businesses</Link>
            </div>
            <p style={{ marginTop:20, fontSize:13, color:'rgba(255,255,255,0.35)' }}>✓ Free forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Setup in 2 minutes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
