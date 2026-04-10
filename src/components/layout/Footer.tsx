import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const LINKS = {
  Platform: [
    { l: 'Browse Businesses', h: '/search' },
    { l: 'List Your Business', h: '/register' },
    { l: 'Categories', h: '/categories' },
    { l: 'Cities', h: '/cities' },
  ],
  Company: [
    { l: 'About Us', h: '/about' },
    { l: 'Careers', h: '/careers' },
    { l: 'Press', h: '/press' },
    { l: 'Blog', h: '/blog' },
  ],
  Support: [
    { l: 'Help Center', h: '/help' },
    { l: 'Contact Us', h: '/contact' },
    { l: 'Report Issue', h: '/report' },
    { l: 'Advertise', h: '/advertise' },
  ],
  Legal: [
    { l: 'Privacy Policy', h: '/privacy' },
    { l: 'Terms of Service', h: '/terms' },
    { l: 'Cookie Policy', h: '/cookies' },
    { l: 'Refund Policy', h: '/refund' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div className="site-container" style={{ padding: 'clamp(40px,5vw,72px) clamp(1rem,4vw,2.5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32 }}>
          {/* Brand col */}
          <div style={{ gridColumn: 'span 2' }} className="footer-brand">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#f97316,#fbbf24)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#fff', fontFamily: 'Georgia,serif' }}>bB</div>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)' }}>BhartiyaBazar</span>
            </Link>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.7, maxWidth: 220, marginBottom: 16 }}>
              India&apos;s most trusted business search platform. Find, compare, and connect with verified businesses.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label={`Social ${i}`} style={{
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-3)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-1)', marginBottom: 14 }}>{section}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {links.map(({ l, h }) => (
                  <li key={l}>
                    <Link href={h} style={{ fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'}
                    >{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 40, paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>© {new Date().getFullYear()} BhartiyaBazar · Made with 🧡 in India</p>
          <span style={{ fontSize: '12px', background: 'var(--accent-subtle)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>🇮🇳 Proudly Indian</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-brand { grid-column: 1 / -1 !important; }
        }
      `}</style>
    </footer>
  )
}
