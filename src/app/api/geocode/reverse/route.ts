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

// Known Indian city name aliases — strip suffixes that BDC / Nominatim append
const CITY_STRIP_SUFFIXES = [
  ' district', ' tehsil', ' taluka', ' taluk', ' mandal',
  ' municipal corporation', ' nagar nigam', ' municipality',
  ' urban', ' rural', ' block',
];

function cleanCityName(raw: string): string {
  if (!raw) return '';
  let s = raw.trim().toLowerCase();
  for (const suffix of CITY_STRIP_SUFFIXES) {
    if (s.endsWith(suffix)) { s = s.slice(0, s.length - suffix.length).trim(); break; }
  }
  // Title-case
  return s.replace(/\b\w/g, c => c.toUpperCase());
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
  const infos: Array<{ description?: string; name?: string }> =
    d.localityInfo?.informational ?? [];

  const byLevel = (level: number) =>
    admins.find(a => a.adminLevel === level)?.name ?? '';

  // ── City resolution for India ──
  // BDC adminLevels for India:
  //   4 = State (e.g. Haryana)
  //   5 = District (e.g. Faridabad District) ← often wrong for city name
  //   6 = Sub-district / Tehsil
  //   7/8 = Town/Village/Locality
  //
  // Best strategy: prefer d.locality (usually the actual city/town name),
  // then d.city, then admins, stripping district/tehsil suffixes at each step.

  const candidates = [
    d.locality,           // Usually the town name — most accurate
    d.city,               // Sometimes "Faridabad District" — needs cleaning
    byLevel(6),           // Sub-district
    byLevel(7),           // Town level
    byLevel(8),           // Village level
    byLevel(5),           // District level — last resort
  ].filter(Boolean).map(cleanCityName);

  // Pick first candidate that doesn't look like a district/state
  const city = candidates.find(c =>
    c && !c.toLowerCase().includes('district') && c.length > 0
  ) || candidates[0] || '';

  const area =
    infos.find(
      i =>
        i.description?.toLowerCase().includes('sublocality') ||
        i.description?.toLowerCase().includes('neighbourhood') ||
        i.description?.toLowerCase().includes('ward'),
    )?.name ??
    infos.find(i => i.description?.toLowerCase().includes('quarter'))?.name ??
    d.locality ?? '';

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
    street:   '',
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

  // Nominatim for India: prefer city > town > city_district > suburb > county
  const cityRaw =
    a.city || a.town || a.municipality || a.city_district ||
    a.suburb || a.state_district || a.village || a.county || '';

  const city = cleanCityName(cityRaw);

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
