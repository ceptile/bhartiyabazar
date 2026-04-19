'use client';
import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: '01',
    icon: '🔍',
    title: 'Search',
    desc: 'Type what you need — a service, product, or business name. Filter by location, rating, and category.',
    color: '#3b82f6',
  },
  {
    num: '02',
    icon: '📊',
    title: 'Compare',
    desc: 'View trust scores, ratings, prices, and reviews. Compare multiple businesses side by side.',
    color: '#8b5cf6',
  },
  {
    num: '03',
    icon: '📞',
    title: 'Connect',
    desc: 'Call, WhatsApp, or email the business directly. No middlemen, no fake leads, no spam.',
    color: '#FF6B00',
  },
  {
    num: '04',
    icon: '⭐',
    title: 'Review',
    desc: 'Share your experience to help others. Your review builds the community trust score.',
    color: '#f59e0b',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.15)',
            fontSize: 12, fontWeight: 600, color: '#3b82f6',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16,
          }}>Simple Process</span>
          <h2 style={{
            fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.03em',
          }}>How BhartiyaBazar Works</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 32, position: 'relative',
        }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center', padding: '32px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(32px)',
                transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
              }}
            >
              {/* Step number badge */}
              <div style={{
                position: 'absolute', top: -16, left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--surface)',
                border: `2px solid ${step.color}`,
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: 11, fontWeight: 800,
                color: step.color, letterSpacing: '0.05em',
              }}>{step.num}</div>

              {/* Icon */}
              <div style={{
                width: 72, height: 72,
                borderRadius: 'var(--radius-xl)',
                background: `${step.color}14`,
                border: `2px solid ${step.color}22`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 32,
                margin: '16px auto 20px',
              }}>{step.icon}</div>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}