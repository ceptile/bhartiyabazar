import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="section" style={{ background: 'var(--color-off-white)' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, var(--color-deep-charcoal) 0%, #2a2927 50%, #1a1917 100%)',
          borderRadius: 'var(--radius-very-rounded)',
          padding: 'clamp(40px, 6vw, 72px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(217,119,87,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ marginBottom: 16 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-warm-terracotta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 16 }}>
              List Your Business <span style={{ color: 'var(--color-warm-terracotta)' }}>for FREE</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Join 50,000+ businesses already on BhartiyaBazar. Get discovered by lakhs of customers. No commission. No hidden fees. Ever.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/list-business" className="btn btn-accent btn-lg">List Your Business — Free</Link>
              <Link href="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 'var(--radius-full)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 500, textDecoration: 'none', transition: 'all var(--transition)', background: 'transparent' }}>Explore Businesses</Link>
            </div>
            <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>✓ Free forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Setup in 2 minutes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
