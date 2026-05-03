import { NextRequest, NextResponse } from 'next/server';

/**
 * Reverse geocode endpoint — zero cost, no API key required.
 *
 * Priority:
 *   1. BigDataCloud  — free, no key, returns locality/sublocality/postcode for India
 *   2. Nominatim     — free fallback (city-level accuracy only)
 *
 * Response shape:
 *   { country, state, city, area, street, building, postcode }
 */

interface GeoResult {
  country:  string;
  state:    string;
  city:     string;
  area:     string;
  street:   string;
  building: string;
  postcode: string;
}

// ── 1. BigDataCloud (completely free, no key needed) ─────────────────────────
async function geocodeWithBigDataCloud(
  lat: string,
  lng: string,
): Promise<GeoResult | null> {
  const url =
    `https://api.bigdatacloud.net/data/reverse-geocode-client` +
    `?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const d = await res.json();
  if (!d || d.status === 'error') return null;

  const admins: Array<{ adminLevel: number; name: string }> =
    d.localityInfo?.administrative ?? [];

  const byLevel = (level: number) =>
    admins.find(a => a.adminLevel === level)?.name ?? '';

  const infos: Array<{ description?: string; name?: string }> =
    d.localityInfo?.informational ?? [];

  // For Indian GPS coordinates BigDataCloud often returns district-level names
  // in d.city (e.g. "Faridabad District"). adminLevel 5 maps to the actual city.
  // Priority: adminLevel 5 (city) → adminLevel 6 → d.city → d.locality → higher levels
  const city =
    byLevel(5) ||
    byLevel(6) ||
    d.city ||
    d.locality ||
    byLevel(8) ||
    byLevel(7) ||
    '';

  const area =
    infos.find(
      i =>
        i.description?.toLowerCase().includes('sublocality') ||
        i.description?.toLowerCase().includes('neighbourhood') ||
        i.description?.toLowerCase().includes('ward'),
    )?.name ??
    infos.find(i => i.description?.toLowerCase().includes('quarter'))?.name ??
    '';

  const postcode =
    d.postcode ||
    (infos.find(
      i =>
        i.description?.toLowerCase().includes('postal') ||
        /^\d{6}$/.test(i.name ?? ''),
    )?.name ?? '');

  const state = byLevel(4) || d.principalSubdivision || '';

  return {
    building: '',
    street:   d.locality ?? '',
    area,
    city,
    state,
    country:  d.countryName || '',
    postcode,
  };
}

// ── 2. Nominatim fallback ────────────────────────────────────────────────────
async function geocodeWithNominatim(lat: string, lng: string): Promise<GeoResult> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
    {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'BhartiyaBazar/1.0 (https://bhartiyabazar.vercel.app)',
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) throw new Error('Nominatim error');

  const data = await res.json();
  const a = data.address || {};

  const city =
    a.city || a.town || a.city_district || a.state_district || a.village || a.county || '';

  return {
    building: a.house_number || '',
    street:   [a.road, a.pedestrian, a.footway].filter(Boolean).join(', '),
    area:     a.suburb || a.neighbourhood || a.quarter || '',
    city,
    state:    a.state || '',
    country:  a.country || '',
    postcode: a.postcode || '',
  };
}

// ── Handler ──────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  try {
    const result =
      (await geocodeWithBigDataCloud(lat, lng)) ??
      (await geocodeWithNominatim(lat, lng));

    return NextResponse.json(result);
  } catch (e) {
    console.error('[geocode/reverse] error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
