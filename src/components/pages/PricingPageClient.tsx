'use client';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for getting started',
    features: ['Basic business listing', 'Contact info display', 'Basic search visibility', 'Email support'],
    cta: 'Get Started',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/month',
    desc: 'For growing businesses',
    features: ['Featured listing', 'Priority search ranking', 'Analytics dashboard', 'WhatsApp integration', 'Photo gallery', 'Priority support'],
    cta: 'Start Pro Trial',
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '₹2,999',
    period: '/month',
    desc: 'For large operations',
    features: ['Everything in Pro', 'Multi-location support', 'Custom branding', 'API access', 'Dedicated account manager', 'SLA guarantee'],
    cta: 'Contact Sales',
    href: '/contact',
    highlight: false,
  },
];

export default function PricingPageClient() {
  return (
    <div className="section-container">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vw,80px)' }}>
          <span className="section-label">Simple Pricing</span>
          <h1 className="text-h2" style={{ marginBottom: 12 }}>Choose Your Plan</h1>
          <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-medium-gray)', maxWidth: 520, margin: '0 auto' }}>
            Start free, scale as you grow. All plans include our core directory features.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {plans.map((plan) => (
            <div key={plan.name} className={plan.highlight ? 'card-pricing featured' : 'card-pricing'}>
              {plan.highlight && (
                <div style={{ display: 'inline-block', marginBottom: 12 }}>
                  <span className="badge badge-accent">Most Popular</span>
                </div>
              )}
              <h3 style={{ fontSize: 'var(--text-subheading)', fontWeight: 600, color: 'var(--color-deep-charcoal)', marginBottom: 4 }}>{plan.name}</h3>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-light-gray)', marginBottom: 16 }}>{plan.desc}</p>

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--color-deep-charcoal)', fontFamily: 'var(--font-display)' }}>{plan.price}</span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-light-gray)' }}>{plan.period}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-caption)', color: 'var(--color-medium-gray)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className={plan.highlight ? 'btn btn-accent' : 'btn btn-primary'} style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-light-gray)' }}>
            All prices are in INR. No hidden fees. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
