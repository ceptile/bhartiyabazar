import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

// Simple suggestion engine — returns matching business names + categories
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  try {
    const snap = await getDocs(query(collection(db, 'businesses'), limit(200)));
    const results: { label: string; type: string; slug?: string; city?: string }[] = [];

    snap.forEach(d => {
      const data = d.data();
      const name = (data.name ?? '').toLowerCase();
      const cat  = (data.category ?? '').toLowerCase();
      const city = (data.city ?? '').toLowerCase();
      if (name.includes(q)) {
        results.push({ label: data.name, type: 'business', slug: d.id, city: data.city });
      } else if (cat.includes(q)) {
        results.push({ label: data.category, type: 'category', city: data.city });
      } else if (city.includes(q)) {
        results.push({ label: data.city, type: 'city' });
      }
    });

    // Deduplicate by label
    const seen = new Set<string>();
    const unique = results.filter(r => {
      const key = r.label + r.type;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ suggestions: unique.slice(0, 8) });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
