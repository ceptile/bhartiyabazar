'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePageContent } from '@/hooks/usePageContent';

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

const PLAN_KEYS = ['free', 'pro', 'business'] as const;

export default function PricingPage() {
  const { get } = usePageContent('pricing');
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = PLAN_KEYS.map(key => {
    const capKey = key.charAt(0).toUpperCase() + key.slice(1);
    const featuresRaw = get(`Plan — ${capKey} Features (one per line)`, '');
    const features = featuresRaw
      ? featuresRaw.split('\n').filter(Boolean).map(f => ({ text: f, included: true }))
      : [];
    return {
      key,
      name: get(`Plan — ${capKey} Name`, capKey),
      tagline: get(`Plan — ${capKey} Tagline`, ''),
      monthly: parseInt(get(`Plan — ${capKey} Monthly Price`, '0'), 10) || 0,
      annual: parseInt(get(`Plan — ${capKey} Annual Price`, '0'), 10) || 0,
      badge: key === 'pro' ? 'Most Popular' : null,
      primary: key === 'pro',
      features,
    };
  });

  const faqKeys = [1, 2, 3, 4];
  const faqs = faqKeys
    .map(n => ({
      q: get(`FAQ ${n} — Question`, ''),
      a: get(`FAQ ${n} — Answer`, ''),
    }))
    .filter(f => f.q);

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
            {get('Hero Headline', 'Simple, transparent pricing')}
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem,1.5vw,1.1rem)', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32, maxWidth: '100%' }}>
            {get('Hero Subtext', 'Start free. Upgrade when you are ready to grow. No hidden charges, no lock-ins.')}
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
            {plans.map(plan => (
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
                <Link href="/register"
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

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: 'clamp(56px,9vw,96px) 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: 720 }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10 }}>
                Frequently Asked Questions
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid var(--border)' : 'none' }}>
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
      )}

      {/* CTA */}
      <section style={{ padding: 'clamp(56px,9vw,96px) 0' }}>
        <div className="container" style={{ maxWidth: 620, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.1rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
            {get('CTA Heading', 'Still have questions?')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.75, maxWidth: '100%' }}>
            {get('CTA Subtext', 'Our team is happy to walk you through the right plan for your business. Reach out any time.')}
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
