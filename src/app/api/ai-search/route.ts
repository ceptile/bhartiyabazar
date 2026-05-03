import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const { query, listings } = await req.json();

  if (!query?.trim()) {
    return NextResponse.json({ error: 'Empty query' }, { status: 400 });
  }

  const systemPrompt = `You are an intelligent business finder for BhartiyaBazar — an Indian local business directory.
Your job: given a user query and a JSON array of businesses, return the most relevant results with a helpful summary.

Rules:
- Understand queries in Hindi, Hinglish, or English
- Match on name, category, city, area, description
- Return at most 10 most relevant slug strings, ranked best-first
- Write a short 1–2 sentence "summary" in plain English/Hindi explaining what you found
- If nothing relevant is found, return empty slugs array and honest summary
- Do NOT invent businesses. Only use slugs from the provided data.
- Respond ONLY with valid JSON in this exact shape:
  { "summary": "...", "slugs": ["slug1", "slug2", ...] }`;

  const userMessage = `User query: "${query}"

Businesses data:
${JSON.stringify(
  // send only fields needed — keep payload lean
  (listings as Record<string, string>[]).map((b) => ({
    slug: b.slug,
    name: b.name,
    category: b.category,
    city: b.city,
    area: b.area ?? '',
    description: (b.description ?? '').slice(0, 120),
  })),
  null,
  0
)}`;

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
          temperature: 0.2,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('[ai-search] Gemini error:', err);
      return NextResponse.json({ error: 'Gemini API error' }, { status: 502 });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const parsed = JSON.parse(text);

    return NextResponse.json({
      summary: parsed.summary ?? '',
      slugs: Array.isArray(parsed.slugs) ? parsed.slugs : [],
    });
  } catch (e) {
    console.error('[ai-search] error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
