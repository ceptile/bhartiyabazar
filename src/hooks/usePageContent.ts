import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function usePageContent(pageId: string) {
  const [sections, setSections] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'pages', pageId)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        const map: Record<string, string> = {};
        (data.sections || []).forEach((s: { heading: string; body: string }) => {
          map[s.heading] = s.body;
        });
        setSections(map);
      }
      setLoaded(true);
    });
  }, [pageId]);

  const get = (heading: string, fallback = '') =>
    loaded ? (sections[heading] ?? fallback) : fallback;

  return { get, loaded };
}
