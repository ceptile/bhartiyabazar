const STEPS = [
  { n: '01', icon: '🔍', title: 'Search',           desc: 'Type what you need — a business, product, or service. Our smart search understands your intent.' },
  { n: '02', icon: '⚖️', title: 'Discover & Compare', desc: 'Browse verified listings, compare prices, ratings, and trust scores side by side.' },
  { n: '03', icon: '💬', title: 'Contact Directly',  desc: 'Call, WhatsApp, or email the business directly — no middlemen, no hidden fees.' },
  { n: '04', icon: '⭐', title: 'Review & Trust',    desc: 'Share your experience. Your review helps build India\'s most trusted business database.' },
]

export default function HowItWorks() {
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="site-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 8 }}>Simple Process</p>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>How BhartiyaBazar Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {STEPS.map(({ n, icon, title, desc }) => (
            <div
              key={n}
              style={{
                padding: '28px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Step number watermark */}
              <div style={{
                position: 'absolute', top: -10, right: 12,
                fontSize: '72px', fontWeight: 900,
                color: 'var(--accent)',
                opacity: 0.06,
                lineHeight: 1,
                userSelect: 'none',
                fontVariantNumeric: 'tabular-nums',
              }}>{n}</div>

              <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
              <div style={{
                display: 'inline-block',
                background: 'var(--accent-subtle)',
                color: 'var(--accent)',
                borderRadius: 'var(--radius-full)',
                padding: '2px 10px',
                fontSize: '11px', fontWeight: 700,
                marginBottom: 10,
                letterSpacing: '0.04em',
              }}>STEP {n}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
