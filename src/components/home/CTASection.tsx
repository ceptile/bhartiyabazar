import Link from 'next/link'
import { ArrowRight, PlusCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="site-container">
        <div style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ea6a0a 50%, #dc6200 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'clamp(40px,6vw,72px) clamp(24px,6vw,80px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(249,115,22,0.3)',
        }}>
          {/* Decorative circles */}
          <div aria-hidden style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div aria-hidden style={{ position: 'absolute', bottom: -60, left: -30, width: 240, height: 240, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '4px 14px', fontSize: '12px', fontWeight: 700, marginBottom: 16, letterSpacing: '0.05em' }}>🇮🇳 PROUDLY INDIAN</span>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2 }}>
              List Your Business for Free Today
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Join 50,000+ businesses already on BhartiyaBazar. Get discovered by lakhs of customers searching every day.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/register"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px',
                  background: '#fff', color: 'var(--accent)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 700, fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                <PlusCircle size={18} /> List Your Business — Free
              </Link>
              <Link
                href="/search"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px',
                  background: 'transparent', color: '#fff',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600, fontSize: '15px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                Browse Businesses <ArrowRight size={16} />
              </Link>
            </div>

            <p style={{ marginTop: 20, fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
              ✓ No credit card required &nbsp;·&nbsp; ✓ Setup in 2 minutes &nbsp;·&nbsp; ✓ Always free
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
