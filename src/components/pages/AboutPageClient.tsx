'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AboutPage from '@/components/home/AboutPage'; // your existing About UI

export default function AboutPageClient() {
  const [data, setData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    getDoc(doc(db, 'pages', 'about')).then(snap => {
      if (snap.exists()) {
        const sections: Record<string, string> = {};
        (snap.data().sections ?? []).forEach((s: { heading: string; body: string }) => {
          sections[s.heading] = s.body;
        });
        setData(sections);
      } else {
        setData({}); // use component defaults
      }
    });
  }, []);

  if (data === null) return null; // or a skeleton
  return <AboutPage content={data} />;
}