'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AboutPageClient() {
  const [sections, setSections] = useState<{ heading: string; body: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'pages', 'about')).then(snap => {
      if (snap.exists()) {
        setSections(snap.data().sections ?? []);
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <div className="section-container">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 'var(--space-16)' }}>
          <span className="section-label">Our Story</span>
          <h1 className="text-h2" style={{ marginBottom: 12 }}>About BhartiyaBazar</h1>
          <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-medium-gray)', lineHeight: 1.7 }}>
            Empowering Indian businesses with a free digital presence since 2024.
          </p>
        </div>

        {sections.length > 0 ? (
          sections.map((s, i) => (
            <div key={i} className="card" style={{ marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-h4)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-deep-charcoal)' }}>{s.heading}</h2>
              <p style={{ lineHeight: 1.7, color: 'var(--color-medium-gray)' }}>{s.body}</p>
            </div>
          ))
        ) : (
          <div className="card">
            <p style={{ lineHeight: 1.7, color: 'var(--color-medium-gray)', marginBottom: 24 }}>
              BhartiyaBazar is a free business directory connecting local businesses across India with customers who need them.
            </p>
            <p style={{ lineHeight: 1.7, color: 'var(--color-medium-gray)' }}>
              Our mission is to empower Indian businesses — big and small — with a digital presence, completely free of charge.
            </p>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-10)', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', marginBottom: 12 }}>Our Values</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
            {[
              { title: 'Free Forever', desc: 'No commission, no hidden fees. Every feature is free.' },
              { title: 'Verified Listings', desc: 'We verify every business to ensure trust and reliability.' },
              { title: 'Pan-India Coverage', desc: 'From Kashmir to Kanyakumari, we cover all of India.' },
              { title: 'Customer First', desc: '24/7 support for both businesses and customers.' },
            ].map((v) => (
              <div key={v.title} className="card">
                <h4 style={{ fontSize: 'var(--text-subheading)', fontWeight: 600, marginBottom: 8, color: 'var(--color-deep-charcoal)' }}>{v.title}</h4>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-light-gray)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
