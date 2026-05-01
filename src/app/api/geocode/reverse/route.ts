import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'BhartiyaBazar/1.0 (https://bhartiyabazar.vercel.app)',
        },
        next: { revalidate: 3600 }, // cache geocode results for 1h
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Geocode upstream error', status: res.status }, { status: 502 });
    }

    const data = await res.json();
    const a = data.address || {};

    const city =
      a.city ||
      a.town ||
      a.city_district ||
      a.state_district ||
      a.village ||
      a.county ||
      '';

    return NextResponse.json({
      country: a.country || '',
      state: a.state || '',
      city,
      area: a.suburb || a.neighbourhood || a.quarter || '',
      street: [a.road, a.pedestrian, a.footway].filter(Boolean).join(', '),
      postcode: a.postcode || '',
    });
  } catch (e) {
    console.error('[geocode/reverse] error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
