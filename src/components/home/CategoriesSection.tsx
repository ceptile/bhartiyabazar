'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { categories, type Category } from '@/lib/data';

export default function CategoriesSection() {
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
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255,107,0,0.08)',
            border: '1px solid rgba(255,107,0,0.15)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--saffron)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>All Categories</span>
          <h2 style={{
            fontSize: 'clamp(1.6rem,4vw,2.8rem)',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.03em',
            marginBottom: 12,
          }}>Browse by Category</h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
            Explore 16+ categories with thousands of verified businesses across India
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
          gap: 16,
        }}>
          {categories.map((cat: Category, i: number) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '28px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 40}ms`,
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow = 'var(--shadow-md)';
                el.style.borderColor = cat.color;
                el.style.background = cat.bg;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = visible ? 'translateY(0)' : 'translateY(24px)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--border)';
                el.style.background = 'var(--surface)';
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                background: cat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                marginBottom: 12,
                border: `1px solid ${cat.color}33`,
              }}>
                {cat.icon}
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                textAlign: 'center',
                marginBottom: 4,
                lineHeight: 1.3,
              }}>{cat.name}</span>
              <span style={{
                fontSize: 11,
                color: 'var(--text-faint)',
                fontWeight: 500,
              }}>{cat.count.toLocaleString()} listings</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
