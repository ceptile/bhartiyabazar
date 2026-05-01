// Country → State → City data + reverse-geocode helpers

export interface GeoOption { label: string; value: string; }

export async function reverseGeocode(lat: number, lng: number): Promise<{
  country: string; state: string; city: string;
  area: string; street: string; postcode: string;
}> {
  try {
    // Call our own API route — avoids CORS and Nominatim browser-blocking
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error(`Geocode API error ${res.status}`);
    return await res.json();
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
