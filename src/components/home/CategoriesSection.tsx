'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { categories, type Category } from '@/lib/data';

export default function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: 'var(--color-off-white)', padding: '48px 16px' }}>
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="section-label">Browse by Category</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', marginBottom: 6 }}>16 Categories,<br />Every Business Type</h2>
          <p className="section-sub" style={{ margin: '0 auto', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}>
            Explore every service vertical with verified listings across India
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 10,
        }}>
          {categories.map((cat: Category, i: number) => (
            <Link
              key={cat.id}
              href={`/listings?category=${cat.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '28px 14px 22px',
                background: 'var(--color-pure-white)',
                border: '1px solid var(--color-muted-border)',
                borderRadius: 'var(--radius-very-rounded)',
                textDecoration: 'none',
                transition: 'all var(--transition)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${Math.min(i * 35, 400)}ms`,
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-5px)';
                el.style.boxShadow = 'var(--shadow-medium)';
                el.style.borderColor = cat.color;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = visible ? 'translateY(0)' : 'translateY(20px)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--color-muted-border)';
              }}
            >
              <div style={{
                width: 52, height: 52,
                borderRadius: 'var(--radius-very-rounded)',
                background: cat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                border: `1px solid ${cat.color}28`,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke={cat.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={cat.iconPath} />
                </svg>
              </div>

              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-deep-charcoal)', textAlign: 'center', lineHeight: 1.35, fontFamily: 'var(--font-body)' }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
