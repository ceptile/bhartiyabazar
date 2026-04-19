import Link from 'next/link';

function Icon({ d, size = 20, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const STATS = [
  { value: '50,000+', label: 'Businesses Listed' },
  { value: '12 Lakh+', label: 'Monthly Users' },
  { value: '500+', label: 'Cities Covered' },
  { value: '4.7', label: 'Average Rating' },
];

const VALUES = [
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Trust & Verification',
    desc: 'Every business listing undergoes a manual verification process before going live. We ensure accuracy, authenticity, and accountability at every step.',
  },
  {
    icon: 'M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    title: 'Community First',
    desc: 'We exist to serve India\'s local business ecosystem — from a kirana store in Bhiwadi to a tech company in Bangalore. Every voice matters on our platform.',
  },
  {
    icon: ['M13 10V3L4 14h7v7l9-11h-7z'],
    title: 'Speed & Simplicity',
    desc: 'Finding or listing a business should take minutes, not days. Our platform is built for speed, clarity, and ease of use across all devices.',
  },
  {
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 0 0 6.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 0 0 6.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    title: 'Fair & Open',
    desc: 'No paid placements in organic results. Rankings are driven by ratings, reviews, and relevance — not advertising spend. Fairness is built into the algorithm.',
  },
];

const TEAM = [
  { name: 'Arjun Mehta', role: 'Co-Founder & CEO', location: 'Delhi', initials: 'AM' },
  { name: 'Priya Sharma', role: 'Co-Founder & CTO', location: 'Bangalore', initials: 'PS' },
  { name: 'Rahul Gupta', role: 'Head of Growth', location: 'Mumbai', initials: 'RG' },
  { name: 'Sneha Verma', role: 'Head of Trust & Safety', location: 'Hyderabad', initials: 'SV' },
  { name: 'Karan Joshi', role: 'Lead Engineer', location: 'Pune', initials: 'KJ' },
  { name: 'Anita Patel', role: 'Head of Customer Success', location: 'Ahmedabad', initials: 'AP' },
];

const MILESTONES = [
  { year: '2018', event: 'BhartiyaBazar founded in Delhi with 50 pilot businesses.' },
  { year: '2019', event: 'Expanded to 10 cities. Reached 1,000 verified listings.' },
  { year: '2020', event: 'Launched mobile-first platform. 50,000 monthly users.' },
  { year: '2021', event: 'Crossed 10,000 business listings. Introduced review verification.' },
  { year: '2022', event: 'Series A funding. Expanded to 200+ cities across India.' },
  { year: '2023', event: 'Launched business dashboard and analytics tools.' },
  { year: '2024', event: '50,000+ businesses. 12 lakh monthly active users.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', paddingTop: 64 }}>

      {/* Hero */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(56px,10vw,100px) 0' }}>
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-hover)', background: 'var(--surface-2)', fontSize: 12, fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>
            <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={13} />
            About BhartiyaBazar
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 20 }}>
            Connecting India&rsquo;s businesses<br />with the people who need them
          </h1>
          <p style={{ fontSize: 'clamp(1rem,1.5vw,1.15rem)', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 620, margin: '0 auto 32px' }}>
            BhartiyaBazar is India&rsquo;s most trusted local business discovery platform. We help millions of Indians find verified businesses nearby — and help local businesses build their digital presence.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={15} />
              Explore Businesses
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" size={15} />
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 1, background: 'var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', padding: 'clamp(24px,4vw,40px) 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: 'var(--amber)', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: 'clamp(56px,9vw,96px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 14 }}>Our Mission</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 20 }}>
              Making local commerce<br />accessible to everyone
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 16, maxWidth: '100%' }}>
              India has over 63 million small and medium businesses, yet most of them remain invisible online. BhartiyaBazar bridges this gap by giving every local business — regardless of size or technical know-how — a professional, discoverable presence on the internet.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '100%' }}>
              At the same time, we empower consumers with verified reviews, accurate information, and direct contact options so they can make confident decisions about where to spend their money locally.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {VALUES.map((v, i) => (
              <div key={i} className="card-flat" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--r-lg)', background: 'var(--amber-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', flexShrink: 0 }}>
                  <Icon d={v.icon} size={18} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{v.title}</div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '100%' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: 'clamp(56px,9vw,96px) 0', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>Our Journey</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Six years of building for India
            </h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 60, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 0, alignItems: 'flex-start', position: 'relative', paddingBottom: 28 }}>
                  <div style={{ width: 60, flexShrink: 0, paddingTop: 2, textAlign: 'right', paddingRight: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>{m.year}</span>
                  </div>
                  <div style={{ position: 'absolute', left: 57, top: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', border: '2px solid var(--surface)' }} />
                  <div style={{ paddingLeft: 24, flex: 1 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '100%', paddingTop: 1 }}>{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: 'clamp(56px,9vw,96px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>The Team</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Built by people who care about local commerce
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {TEAM.map((t, i) => (
              <div key={i} className="card-flat" style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', margin: '0 auto 12px' }}>
                  {t.initials}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, marginBottom: 4 }}>{t.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12, color: 'var(--text-faint)' }}>
                  <Icon d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" size={12} />
                  {t.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px,9vw,96px) 0' }}>
        <div className="container" style={{ maxWidth: 680, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 16 }}>
            Ready to grow your business?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32, maxWidth: '100%' }}>
            Join 50,000+ businesses already listed on BhartiyaBazar. Get discovered, collect reviews, and connect with customers in your city.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon d="M12 5v14 M5 12h14" size={16} />
              List Your Business Free
            </Link>
            <Link href="/pricing" className="btn btn-outline btn-lg">View Pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}