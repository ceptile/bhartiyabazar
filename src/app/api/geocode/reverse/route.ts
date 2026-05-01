import { NextRequest, NextResponse } from 'next/server';

/**
 * Reverse geocode endpoint.
 *
 * Priority:
 *   1. Google Maps Geocoding API  (GOOGLE_MAPS_API_KEY env var — exact, structured)
 *   2. Nominatim / OpenStreetMap  (free fallback — city-level accuracy only)
 *
 * Response shape:
 *   { country, state, city, area, street, building, postcode }
 */

interface GeoResult {
  country: string;
  state: string;
  city: string;
  area: string;      // sublocality / neighbourhood
  street: string;    // road / colony
  building: string;  // building name / house number
  postcode: string;
}

// ── Google Maps ──────────────────────────────────────────────────────────────
async function geocodeWithGoogle(lat: string, lng: string): Promise<GeoResult | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;

  const url =
    `https://maps.googleapis.com/maps/api/geocode/json` +
    `?latlng=${lat},${lng}&key=${key}&language=en&result_type=street_address|sublocality|locality`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.length) return null;

  // Use the most precise result (first result is always most specific)
  const components: Array<{ long_name: string; types: string[] }> =
    data.results[0].address_components ?? [];

  const get = (...types: string[]) =>
    components.find(c => types.some(t => c.types.includes(t)))?.long_name ?? '';

  return {
    building:  get('premise', 'subpremise', 'street_number'),
    street:    get('route', 'sublocality_level_3', 'sublocality_level_4'),
    area:      get('sublocality_level_2', 'sublocality_level_1', 'sublocality', 'neighborhood', 'political'),
    city:      get('locality', 'administrative_area_level_3', 'administrative_area_level_2'),
    state:     get('administrative_area_level_1'),
    country:   get('country'),
    postcode:  get('postal_code'),
  };
}

// ── Nominatim fallback ───────────────────────────────────────────────────────
async function geocodeWithNominatim(lat: string, lng: string): Promise<GeoResult> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
    {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'BhartiyaBazar/1.0 (https://bhartiyabazar.vercel.app)',
      },
      next: { revalidate: 3600 },
    }
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
    // Try Google first (exact), fall back to Nominatim
    const result =
      (await geocodeWithGoogle(lat, lng)) ??
      (await geocodeWithNominatim(lat, lng));

    return NextResponse.json(result);
  } catch (e) {
    console.error('[geocode/reverse] error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
