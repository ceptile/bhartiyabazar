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
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', color: 'var(--text-primary)' }}>
      <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: '2rem', fontWeight: 700, marginBottom: 32 }}>
        About BhartiyaBazar
      </h1>
      {sections.length > 0 ? (
        sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>{s.heading}</h2>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>{s.body}</p>
          </div>
        ))
      ) : (
        <div>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 24 }}>
            BhartiyaBazar is a free business directory connecting local businesses across India with customers who need them.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Our mission is to empower Indian businesses — big and small — with a digital presence, completely free of charge.
          </p>
        </div>
      )}
    </div>
  );
}
