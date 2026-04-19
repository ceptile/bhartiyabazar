'use client';
import { useState } from 'react';
import Link from 'next/link';

function Icon({ d, size = 18, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    tagline: 'For individuals getting started',
    monthly: 0,
    annual: 0,
    badge: null,
    primary: false,
    features: [
      { text: '1 business listing', included: true },
      { text: 'Basic business profile', included: true },
      { text: 'Customer reviews', included: true },
      { text: 'Google Maps integration', included: true },
      { text: 'Contact details displayed', included: true },
      { text: 'Priority search placement', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Unlimited photos', included: false },
      { text: 'Featured badge', included: false },
      { text: 'Direct message inbox', included: false },
      { text: 'Custom business URL', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    tagline: 'For growing local businesses',
    monthly: 499,
    annual: 399,
    badge: 'Most Popular',
    primary: true,
    features: [
      { text: '1 business listing', included: true },
      { text: 'Full business profile', included: true },
      { text: 'Customer reviews', included: true },
      { text: 'Google Maps integration', included: true },
      { text: 'Contact details displayed', included: true },
      { text: 'Priority search placement', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Unlimited photos', included: true },
      { text: 'Featured badge', included: true },
      { text: 'Direct message inbox', included: false },
      { text: 'Custom business URL', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    key: 'business',
    name: 'Business',
    tagline: 'For established brands scaling up',
    monthly: 1199,
    annual: 999,
    badge: null,
    primary: false,
    features: [
      { text: 'Up to 5 business listings', included: true },
      { text: 'Full business profile', included: true },
      { text: 'Customer reviews', included: true },
      { text: 'Google Maps integration', included: true },
      { text: 'Contact details displayed', included: true },
      { text: 'Priority search placement', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Unlimited photos', included: true },
      { text: 'Featured badge', included: true },
      { text: 'Direct message inbox', included: true },
      { text: 'Custom business URL', included: true },
      { text: 'Priority support', included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Can I list my business for free?',
    a: 'Yes. The Free plan lets you create one business listing with all essential information. No credit card required. Upgrade any time to unlock premium features.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major UPI apps (PhonePe, GPay, Paytm), net banking, debit and credit cards (Visa, Mastercard, RuPay), and EMI options for annual plans.',
  },
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes, you can cancel at any time from your dashboard. Your plan remains active until the end of the billing period. We do not charge cancellation fees.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'We offer a full refund within 7 days of purchase if you are not satisfied. Annual plan refunds are prorated after the 7-day window.',
  },
  {
    q: 'What is the difference between monthly and annual billing?',
    a: 'Annual billing gives you approximately 20% off compared to monthly billing. The amount is charged once per year. Monthly billing is charged each month and can be cancelled at any time.',
  },
  {
    q: 'Do you offer plans for chains or franchises with many locations?',
    a: 'Yes. The Business plan supports up to 5 listings. For chains with more locations, contact our sales team at sales@bhartiyabazar.in for a custom enterprise quote.',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--bg)', paddingTop: 64 }}>

      {/* Hero */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(56px,10vw,96px) 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-hover)', background: 'var(--surface-2)', fontSize: 12, fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>
            <Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={13} />
            Pricing
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 16 }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem,1.5vw,1.1rem)', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32, maxWidth: '100%' }}>
            Start free. Upgrade when you are ready to grow. No hidden charges, no lock-ins.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '6px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <button onClick={() => setAnnual(false)}
              style={{ padding: '7px 20px', borderRadius: 'var(--r-full)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: !annual ? 'var(--surface)' : 'transparent', color: !annual ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: !annual ? 'var(--shadow-sm)' : 'none', transition: 'all var(--t)' }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              style={{ padding: '7px 20px', borderRadius: 'var(--r-full)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: annual ? 'var(--surface)' : 'transparent', color: annual ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: annual ? 'var(--shadow-sm)' : 'none', transition: 'all var(--t)', display: 'flex', alignItems: 'center', gap: 7 }}>
              Annual
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(45,122,58,0.15)' }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map(plan => (
              <div key={plan.key}
                style={{
                  borderRadius: 'var(--r-xl)',
                  border: plan.primary ? '2px solid var(--amber)' : '1px solid var(--border)',
                  background: plan.primary ? 'var(--surface)' : 'var(--bg)',
                  padding: 28,
                  position: 'relative',
                  boxShadow: plan.primary ? 'var(--shadow-md)' : 'none',
                }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '3px 14px', borderRadius: 'var(--r-full)', background: 'var(--amber)', color: '#fff', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>{plan.tagline}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                      {plan.monthly === 0 ? '' : '₹'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                      {plan.monthly === 0 ? 'Free' : annual ? plan.annual.toLocaleString('en-IN') : plan.monthly.toLocaleString('en-IN')}
                    </span>
                    {plan.monthly > 0 && (
                      <span style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 8 }}>/mo</span>
                    )}
                  </div>
                  {plan.monthly > 0 && annual && (
                    <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
                      Billed as ₹{(plan.annual * 12).toLocaleString('en-IN')}/year
                    </div>
                  )}
                </div>

                <Link href={plan.monthly === 0 ? '/register' : '/register'}
                  className={plan.primary ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 24, width: '100%', boxSizing: 'border-box' }}>
                  {plan.monthly === 0 ? 'Get Started Free' : `Get ${plan.name}`}
                  <Icon d="M5 12h14 M12 5l7 7-7 7" size={14} />
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: f.included ? 'var(--success)' : 'var(--border-strong)', flexShrink: 0 }}>
                        {f.included ? <CheckIcon /> : <XIcon />}
                      </span>
                      <span style={{ fontSize: 13, color: f.included ? 'var(--text-secondary)' : 'var(--text-faint)' }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison note */}
      <section style={{ padding: 'clamp(48px,7vw,72px) 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="container" style={{ maxWidth: 820, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
            All plans include
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 36, maxWidth: '100%' }}>
            Every listing on BhartiyaBazar — free or paid — gets these features by default.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
            {[
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Manual verification' },
              { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6', label: 'Business profile page' },
              { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', label: 'Google Maps display' },
              { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', label: 'Customer reviews' },
              { icon: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z', label: 'Searchable listing' },
              { icon: 'M12 18h.01 M8 21h8a2 2 0 0 0 2-2v-1a6 6 0 0 0-12 0v1a2 2 0 0 0 2 2z M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Owner dashboard access' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <span style={{ color: 'var(--amber)', flexShrink: 0 }}><Icon d={item.icon} size={16} /></span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(56px,9vw,96px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10 }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Everything you need to know about our pricing and plans.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{faq.q}</span>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform var(--t)' }}>
                    <Icon d="M6 9l6 6 6-6" size={16} sw={2} />
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', background: 'var(--surface)' }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '100%' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px,9vw,96px) 0' }}>
        <div className="container" style={{ maxWidth: 620, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.1rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
            Still have questions?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.75, maxWidth: '100%' }}>
            Our team is happy to walk you through the right plan for your business. Reach out any time.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" size={16} />
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
}