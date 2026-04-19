'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import {
  Twitter, Facebook, Linkedin, Youtube,
  MapPin, Phone, Mail, Shield, ArrowUpRight
} from 'lucide-react';

const SOCIAL = [
  { icon: <Twitter size={15} />, label: 'Twitter',  href: '#' },
  { icon: <Facebook size={15} />, label: 'Facebook', href: '#' },
  { icon: <Linkedin size={15} />, label: 'LinkedIn', href: '#' },
  { icon: <Youtube size={15} />,  label: 'YouTube',  href: '#' },
];

const COLS = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Businesses', href: '/search' },
      { label: 'List Your Business', href: '/register' },
      { label: 'Pricing Plans', href: '/pricing' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal & Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Report Issue', href: '/contact' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)', padding: 'clamp(56px,8vw,96px) 0 32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48, marginBottom: 56 }}>

          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Logo size="md" variant="full" />
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 260, marginBottom: 24 }}>
              India&apos;s trusted business discovery platform. Find, compare, and connect with verified businesses across the country.
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <Shield size={13} style={{ color: 'var(--success)' }} />
              <span>SSL Secured &amp; Verified</span>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-nav-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: <MapPin size={14} />, text: 'India' },
                { icon: <Phone size={14} />, text: '+91 Contact via website' },
                { icon: <Mail  size={14} />, text: 'support@bhartiyabazar.in' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--amber)', flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            &copy; {year} BhartiyaBazar. Made with care in India.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['Privacy', 'Terms', 'Sitemap'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="footer-nav-link" style={{ fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {l} <ArrowUpRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-nav-link {
          font-size: 14px; color: var(--text-muted);
          text-decoration: none; transition: color var(--t);
          font-family: var(--font-body);
          display: inline-flex; align-items: center; gap: 4px;
        }
        .footer-nav-link:hover { color: var(--amber); }

        .footer-social-btn {
          width: 34px; height: 34px; border-radius: var(--r-md);
          background: var(--surface-2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); text-decoration: none;
          transition: all var(--t);
        }
        .footer-social-btn:hover { border-color: var(--amber); color: var(--amber); background: var(--amber-subtle); transform: translateY(-1px); }
      `}</style>
    </footer>
  );
}