'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import {
  Twitter, Facebook, Linkedin, Youtube,
  MapPin, Phone, Mail, Shield, ArrowUpRight, ChevronUp, ChevronDown
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

function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="footer-section" style={{ borderBottom: '1px solid rgba(31, 30, 29, 0.08)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}
        className="footer-section-toggle"
      >
        <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-warm-terracotta)', margin: 0 }}>
          {title}
        </h4>
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} className="footer-chevron" />
      </button>
      {open && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12 }}>
          {links.map(l => (
            <li key={l.label}>
              <Link href={l.href} className="footer-nav-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--color-off-white)', paddingTop: 48 }}>
      {/* Mobile Accordion Sections */}
      <div className="container footer-mobile-sections">
        <FooterSection title="Platform" links={COLS[0].links} />
        <FooterSection title="Company" links={COLS[1].links} />
        <FooterSection title="Legal & Support" links={COLS[2].links} />

        {/* Contact on mobile */}
        <div className="footer-section" style={{ borderBottom: '1px solid rgba(31, 30, 29, 0.08)', paddingBottom: 16 }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-warm-terracotta)', marginBottom: 12 }}>
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: <MapPin size={14} />, text: 'India' },
              { icon: <Phone size={14} />, text: '+91 Contact via website' },
              { icon: <Mail size={14} />, text: 'support@bhartiyabazar.in' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--color-medium-gray)' }}>
                <span style={{ color: 'var(--color-warm-terracotta)', flexShrink: 0 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Footer Grid */}
      <div className="container footer-desktop-grid" style={{ display: 'none', paddingBottom: 40 }}>
        {/* Brand column */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <Logo size="md" />
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-medium-gray)', lineHeight: 1.75, maxWidth: 260, marginBottom: 24 }}>
            India&apos;s trusted business discovery platform. Find, compare, and connect with verified businesses across the country.
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                {s.icon}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-light-gray)' }}>
            <Shield size={13} style={{ color: 'var(--color-success)' }} />
            <span>SSL Secured &amp; Verified</span>
          </div>
        </div>

        {/* Link columns */}
        {COLS.map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-warm-terracotta)', marginBottom: 16 }}>
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
      </div>

      <div className="container" style={{ paddingBottom: 24, paddingTop: 24, borderTop: '1px solid rgba(31, 30, 29, 0.1)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, color: 'var(--color-medium-gray)' }}>
            &copy; {year} BhartiyaBazar. Made with care in India.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
          font-size: 14px; color: var(--color-medium-gray);
          text-decoration: none; transition: color 180ms ease;
          font-family: var(--font-body);
          display: inline-flex; align-items: center; gap: 4px;
        }
        .footer-nav-link:hover { color: var(--color-warm-terracotta); }

        .footer-social-btn {
          width: 34px; height: 34px; border-radius: 8px;
          background: rgba(31, 30, 29, 0.04); border: 1px solid rgba(31, 30, 29, 0.12);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-medium-gray); text-decoration: none;
          transition: all 180ms ease;
        }
        .footer-social-btn:hover { border-color: var(--color-warm-terracotta); color: var(--color-warm-terracotta); background: rgba(217, 119, 87, 0.06); transform: translateY(-1px); }

        @media (min-width: 769px) {
          .footer-mobile-sections { display: none; }
          .footer-desktop-grid { display: grid !important; }
          .footer-section-toggle .footer-chevron { display: none; }
          .site-footer { padding-top: 64px; }
        }
      `}</style>
    </footer>
  );
}