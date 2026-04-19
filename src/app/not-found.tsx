import Link from 'next/link';

function Icon({ d, size = 18, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export default function NotFound() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', paddingTop: 80 }}>
      <div style={{ maxWidth: 520, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,20vw,10rem)', fontWeight: 900, color: 'var(--amber)', lineHeight: 1, marginBottom: 8, opacity: 0.15, userSelect: 'none' }}>
          404
        </div>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-32px auto 24px', position: 'relative', zIndex: 1, color: 'var(--text-muted)' }}>
          <Icon d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={28} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
          Page not found
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32, maxWidth: '100%' }}>
          The page you are looking for does not exist, may have been moved, or the link may be broken.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" size={15} />
            Back to Home
          </Link>
          <Link href="/search" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={15} />
            Search Businesses
          </Link>
        </div>
      </div>
    </div>
  );
}