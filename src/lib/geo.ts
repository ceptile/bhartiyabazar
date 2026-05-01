// Country → State → City data + reverse-geocode helpers

export interface GeoOption { label: string; value: string; }

export async function reverseGeocode(lat: number, lng: number): Promise<{
  country: string; state: string; city: string;
  area: string; street: string; postcode: string;
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          // Nominatim policy requires a descriptive User-Agent
          'User-Agent': 'BhartiyaBazar/1.0 (https://bhartiyabazar.vercel.app)',
        },
      }
    );
    const data = await res.json();
    const a = data.address || {};
    // Broadened fallback chain — Indian addresses often use city_district or state_district
    const city =
      a.city ||
      a.town ||
      a.city_district ||
      a.state_district ||
      a.village ||
      a.county ||
      '';
    return {
      country: a.country || '',
      state: a.state || '',
      city,
      area: a.suburb || a.neighbourhood || a.quarter || '',
      street: [a.road, a.pedestrian, a.footway].filter(Boolean).join(', '),
      postcode: a.postcode || '',
    };
  } catch {
    return { country: '', state: '', city: '', area: '', street: '', postcode: '' };
  }
}

export async function forwardGeocode(query: string): Promise<Array<{
  display_name: string; lat: string; lon: string;
  address: Record<string, string>;
}>> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'BhartiyaBazar/1.0 (https://bhartiyabazar.vercel.app)',
        },
      }
    );
    return await res.json();
  } catch {
    return [];
  }
}

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('Geolocation not supported')); return; }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
  });
}
