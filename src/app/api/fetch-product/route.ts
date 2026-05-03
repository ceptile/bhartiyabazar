import { NextRequest, NextResponse } from 'next/server';

const RATE_MAP = new Map<string, number>();

export async function POST(req: NextRequest) {
  // Rate-limit: max 10 req/min per IP
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const last = RATE_MAP.get(ip) ?? 0;
  if (now - last < 6000) {
    return NextResponse.json({ error: 'Rate limited. Wait a moment.' }, { status: 429 });
  }
  RATE_MAP.set(ip, now);

  let url: string;
  try {
    const body = await req.json();
    url = body.url;
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BhartiyaBazarBot/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    const getMeta = (prop: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i'));
      return m?.[1]?.trim() ?? '';
    };
    const getMetaName = (name: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'));
      return m?.[1]?.trim() ?? '';
    };
    const getTitle = () => {
      const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return t?.[1]?.trim() ?? '';
    };

    const title       = getMeta('og:title')       || getTitle();
    const description = getMeta('og:description') || getMetaName('description');
    const imageUrl    = getMeta('og:image')        || '';
    const siteName    = getMeta('og:site_name')    || '';

    // Extract price — look for common patterns
    const priceMatch =
      html.match(/["']price["']\s*:\s*["']?([\d,\.]+)/i) ??
      html.match(/₹\s?([\d,]+)/)?? 
      html.match(/Rs\.?\s?([\d,]+)/i);
    const price = priceMatch ? `₹${priceMatch[1]}` : '';

    return NextResponse.json({ title, description, imageUrl, price, siteName });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product data. Try entering details manually.' }, { status: 502 });
  }
}
