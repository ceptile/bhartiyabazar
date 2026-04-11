'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Business } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="stars" style={{ fontSize: 13 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  );
}

export default function BusinessCard({ biz, compact = false }: { biz: Business; compact?: boolean }) {
  const router = useRouter();

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `https://wa.me/91${biz.whatsapp}?text=Hi, I found you on BhartiyaBazar. I am interested in your services.`,
      '_blank'
    );
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${biz.phone}`;
  };

  const handleCardClick = () => {
    router.push(`/business/${biz.slug}`);
  };

  return (
    // ✅ div instead of Link — no nested <a> issue
    <div
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className="card-hover"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Image / Color header */}
      <div style={{
        height: compact ? 100 : 120,
        background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          background: `radial-gradient(circle at 30% 50%, ${
            biz.featured ? 'rgba(255,107,0,0.3)' : 'rgba(100,100,255,0.2)'
          } 0%, transparent 60%)`,
        }} />
        <div style={{
          width: 56, height: 56, borderRadius: 'var(--radius-lg)',
          background: biz.featured
            ? 'linear-gradient(135deg, #FF6B00, #FF8C38)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          position: 'relative', zIndex: 1,
        }}>
          {biz.category === 'Electronics & Repair' ? '📱' :
           biz.category === 'Restaurants & Food' ? '🍽️' :
           biz.category === 'Health & Doctors' ? '🏥' :
           biz.category === 'Education & Tutors' ? '📚' :
           biz.category === 'Clothing & Fashion' ? '👗' :
           biz.category === 'Home Services' ? '🔧' :
           biz.category === 'Salons & Beauty' ? '💇' :
           biz.category === 'Auto & Vehicles' ? '🚗' : '🏢'}
        </div>
        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          {biz.featured  && <span className="badge badge-featured">⚡ Featured</span>}
          {biz.verified  && <span className="badge badge-verified">✓ Verified</span>}
          {biz.badge     && <span className="badge badge-new">{biz.badge}</span>}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>
            {biz.name}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 500 }}>{biz.category}</p>
        </div>

        {!compact && (
          <p style={{
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {biz.shortDesc}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StarRating rating={biz.rating} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{biz.rating}</span>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>({biz.reviewCount})</span>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {biz.area}, {biz.city}
        </div>

        {/* Trust score */}
        <div style={{ marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500 }}>Trust Score</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: biz.trustScore >= 90 ? 'var(--green)' : biz.trustScore >= 70 ? '#f59e0b' : '#ef4444',
            }}>
              {biz.trustScore}%
            </span>
          </div>
          <div style={{ height: 3, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${biz.trustScore}%`,
              background: biz.trustScore >= 90 ? 'var(--green)' : '#f59e0b',
              borderRadius: 99, transition: 'width 1s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Action buttons — ✅ all are <button> or <Link> directly, NOT inside another <Link> */}
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
        <button
          onClick={handleCall}
          style={{
            flex: 1, padding: '9px', borderRadius: 'var(--radius-md)',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            fontSize: 12, fontWeight: 600, color: 'var(--text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s',
          }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Call
        </button>

        <button
          onClick={handleWhatsApp}
          style={{
            flex: 1, padding: '9px', borderRadius: 'var(--radius-md)',
            background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
            fontSize: 12, fontWeight: 600, color: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </button>

        {/* ✅ This is now a direct <Link>, NOT nested inside another <Link> */}
        <Link
          href={`/business/${biz.slug}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1, padding: '9px', borderRadius: 'var(--radius-md)',
            background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
            fontSize: 12, fontWeight: 600, color: 'var(--saffron)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s', textDecoration: 'none',
          }}
        >
          View
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
