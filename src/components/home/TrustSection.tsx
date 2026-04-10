const FEATURES = [
  { icon: '🛡️', title: 'Verified Business Data',    desc: 'Every business is checked for accurate phone, address, and hours. \'Last updated\' shown on every listing.' },
  { icon: '🏆', title: 'Trust Score System',         desc: 'Each business earns a score based on verification, review authenticity, and response speed.' },
  { icon: '📊', title: 'Free Seller Analytics',      desc: 'See profile views, clicks, and leads. Know exactly how customers find you — completely free.' },
  { icon: '🧠', title: 'Smart Search Engine',        desc: 'Understands intent, not just keywords. Type \'AC not cooling\' and we find repair shops near you.' },
  { icon: '🚫', title: 'Anti-Spam Protection',       desc: 'Controlled communication filters fake leads. No forced calls. No spam inquiries guaranteed.' },
  { icon: '🔄', title: 'Auto-Update Prompts',        desc: 'Regular verification prompts keep data fresh. Outdated listings are flagged automatically.' },
]

export default function TrustSection() {
  return (
    <section style={{ background: 'var(--surface)', padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="site-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 8 }}>Why Choose Us</p>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', maxWidth: 480, margin: '0 auto' }}>
            Built on Trust, Powered by Community
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', maxWidth: 520, margin: '12px auto 0', lineHeight: 1.6 }}>
            We solve every problem that plagues JustDial and IndiaMART — fake data, spam calls, poor UI.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                display: 'flex', gap: 16,
                padding: '20px 20px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                alignItems: 'flex-start',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{icon}</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
