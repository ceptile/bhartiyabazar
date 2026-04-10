import Link from 'next/link'
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Browse Businesses', href: '/search' },
    { label: 'List Your Business', href: '/register' },
    { label: 'Categories', href: '/categories' },
    { label: 'Cities', href: '/cities' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Report Issue', href: '/report' },
    { label: 'Advertise', href: '/advertise' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refund' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="container-site py-16">
        {/* Top: Logo + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="font-garamond text-3xl font-bold"
                style={{ color: 'var(--accent)' }}
              >bB</span>
              <span
                className="font-garamond text-xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >BhartiyaBazar</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              India&apos;s most trusted business search platform.
              Find, compare, and connect with verified businesses.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg transition-all hover:opacity-80"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3
                className="text-sm font-semibold mb-4 font-rajdhani tracking-wide uppercase"
                style={{ color: 'var(--text-primary)' }}
              >
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors hover:text-orange-500"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} BhartiyaBazar. All rights reserved. Made with 🧡 in India.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
              🇮🇳 Proudly Indian
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
