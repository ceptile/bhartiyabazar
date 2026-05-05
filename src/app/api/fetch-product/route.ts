import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const systemPrompt = `You are an expert e-commerce product data extractor. 
Given a URL to a product on any e-commerce website (Amazon, Flipkart, etc.), 
your task is to extract the product details. Since you cannot browse the live web, 
you will simulate the extraction based on the URL structure and common knowledge 
of how these platforms display products. 

Return ONLY valid JSON in this format:
{
  "name": "Product Title",
  "price": 1299,
  "originalPrice": 1999,
  "image": "https://example.com/image.jpg",
  "description": "Short product description",
  "rating": 4.5
}`;

  const userMessage = `Extract details for this URL: ${url}`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userMessage }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    });

    if (!geminiRes.ok) {
      return NextResponse.json({ error: 'AI Error' }, { status: 502 });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const product = JSON.parse(text);

    return NextResponse.json(product);
  } catch (e) {
    console.error('[fetch-product] error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
