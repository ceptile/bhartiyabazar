import Link from 'next/link';

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 9h1M14 9h1M9 14h1M14 14h1M9 19v-5h6v5"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1M12 20v1M3 12h1M20 12h1M5.64 5.64l.71.71M17.66 17.66l.71.71M5.64 18.36l.71-.71M17.66 6.34l.71-.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    </svg>
  );
}

export default function RecentlyAdded() {
  return (
    <section className="section-sm" style={{ background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', border: '1px solid rgba(45,122,58,0.15)', marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Growing Every Day</span>
            </div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>New on BhartiyaBazar</h2>
            <p className="section-sub">Be among the first businesses to get discovered</p>
          </div>
          <Link href="/search" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Explore All <ArrowRightIcon />
          </Link>
        </div>

        {/* Empty state — real listings will appear here */}
        <div style={{
          border: '1px dashed var(--border-hover)',
          borderRadius: 'var(--r-xl)',
          padding: 'clamp(48px,8vw,80px) 24px',
          textAlign: 'center',
          background: 'var(--surface)',
        }}>
          <div style={{ color: 'var(--text-faint)', marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
            <BuildingIcon />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, fontFamily: 'var(--font-display)' }}>
            Be the first business here
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.7 }}>
            BhartiyaBazar is building India&apos;s most trusted business directory. List your business today — completely free.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register-business" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <SparkleIcon />
              List Your Business Free
            </Link>
            <Link href="/search" className="btn btn-outline">
              Browse Directory
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}