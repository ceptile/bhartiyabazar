'use client';
import { useEffect, useRef, useState } from 'react';
import { testimonials, type Testimonial } from '@/lib/data';

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: 'var(--surface-2)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            fontSize: 12, fontWeight: 600, color: '#f59e0b',
            letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 16,
          }}>Success Stories</span>
          <h2 style={{
            fontSize: 'clamp(1.6rem,4vw,2.8rem)',
            fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em',
          }}>Real Sellers, Real Results</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {testimonials.map((t: Testimonial, i: number) => (
            <div key={t.id} style={{
              padding: 28,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
            }}>
              {/* Stars */}
              <div style={{ color: '#F59E0B', marginBottom: 16, fontSize: 16 }}>
                {'★'.repeat(t.rating)}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8,
                marginBottom: 20, fontStyle: 'italic',
              }}>&ldquo;{t.text}&rdquo;</p>

              {/* Author row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--saffron), var(--saffron-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>{t.avatar}</div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                    {t.business} · {t.city}
                  </div>
                </div>

                {t.leads > 0 && (
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--saffron)' }}>
                      {t.leads}+
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>leads/month</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}