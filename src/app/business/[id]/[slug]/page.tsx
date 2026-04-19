'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { businesses } from '@/lib/data';
import { getBusinessReviews, markHelpful, Review } from '@/lib/reviews-store';
import ReviewModal from '@/components/reviews/ReviewModal';
import { useAuth } from '@/lib/auth-context';

function Stars({ r, size = 14 }: { r: number; size?: number }) {
  return <span>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r ? 'var(--gold)' : 'var(--border-strong)', fontSize: size }}>★</span>)}</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '22px 24px', marginBottom: 16 }}>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 18, color: 'var(--text-primary)', marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

export default function BusinessPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const business = businesses.find(b => b.slug === slug);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState('overview');
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (business) setReviews(getBusinessReviews(business.slug));
  }, [business]);

  const refreshReviews = () => {
    if (business) setReviews(getBusinessReviews(business.slug));
  };

  const handleHelpful = (id: string) => {
    markHelpful(id);
    refreshReviews();
  };

  if (!business) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, paddingTop: 64 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 24, color: 'var(--text-primary)' }}>Business Not Found</h2>
      <Link href="/search" style={{ padding: '8px 20px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontSize: 14, fontWeight: 600 }}>Browse Businesses</Link>
    </div>
  );

  const allReviews: Review[] = [
    ...(business.reviews || []).map(r => ({
      ...r,
      businessId: business.id,
      businessSlug: business.slug,
      userId: r.id,
      userName: r.author,
      userAvatar: r.avatar,
      title: '',
      helpful: r.helpful,
      verified: r.verified,
      ownerReply: undefined,
    })),
    ...reviews,
  ];
  const avgRating = allReviews.length ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : business.rating.toFixed(1);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link> /
          <Link href="/search" style={{ color: 'var(--text-muted)' }}>Search</Link> /
          <span style={{ color: 'var(--text-primary)' }}>{business.name}</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* Main content */}
          <div>
            {/* Header card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {business.images[0] && (
                  <img src={business.images[imgIdx] || business.images[0]} alt={business.name} width={120} height={120} loading="lazy"
                    style={{ width: 120, height: 120, borderRadius: 'var(--r-md)', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                    {business.verified && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600 }}>✓ Verified</span>}
                    {business.featured && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontWeight: 600 }}>Featured</span>}
                    {business.openNow ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600 }}>Open Now</span> : <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--error-bg)', color: 'var(--crimson)', fontWeight: 600 }}>Closed</span>}
                  </div>
                  <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: 'var(--text-primary)', marginBottom: 4 }}>{business.name}</h1>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{business.category} · {business.area}, {business.city}, {business.state}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <Stars r={Math.round(Number(avgRating))} size={16} />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>{avgRating}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({allReviews.length} reviews)</span>
                    <span style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 600 }}>Trust Score: {business.trustScore}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {business.tags.map(t => <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber-dark)' }}>{t}</span>)}
                  </div>
                </div>
              </div>

              {/* Images */}
              {business.images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {business.images.map((img, i) => (
                    <img key={i} src={img} alt="" width={64} height={64} loading="lazy" onClick={() => setImgIdx(i)}
                      style={{ width: 64, height: 64, borderRadius: 'var(--r-sm)', objectFit: 'cover', cursor: 'pointer', border: i === imgIdx ? '2px solid var(--amber)' : '2px solid transparent' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
              {['overview','products','reviews'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: 'var(--r-md) var(--r-md) 0 0', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid var(--amber)' : '2px solid transparent', color: tab === t ? 'var(--amber)' : 'var(--text-secondary)', fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
                  {t}{t === 'reviews' ? ` (${allReviews.length})` : ''}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <>
                <Section title="About">
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '100%' }}>{business.description}</p>
                </Section>
                {business.services.length > 0 && (
                  <Section title="Services">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                      {business.services.map(s => <div key={s} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>✓ {s}</div>)}
                    </div>
                  </Section>
                )}
              </>
            )}

            {tab === 'products' && (
              <Section title="Products & Services">
                {business.products.length === 0
                  ? <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No products listed yet.</p>
                  : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                      {business.products.map(p => (
                        <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg)' }}>
                          <img src={p.image} alt={p.name} width={200} height={120} loading="lazy" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                          <div style={{ padding: '10px 12px' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{p.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--amber)' }}>₹{p.price.toLocaleString('en-IN')}</span>
                              {p.originalPrice && <span style={{ fontSize: 12, color: 'var(--text-faint)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</span>}
                            </div>
                            {!p.inStock && <span style={{ fontSize: 11, color: 'var(--crimson)', marginTop: 4, display: 'block' }}>Out of Stock</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </Section>
            )}

            {tab === 'reviews' && (
              <div>
                {/* Rating summary */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'EB Garamond',serif", lineHeight: 1 }}>{avgRating}</div>
                    <Stars r={Math.round(Number(avgRating))} size={18} />
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{allReviews.length} reviews</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    {[5,4,3,2,1].map(s => {
                      const count = allReviews.filter(r => Math.round(r.rating) === s).length;
                      const pct = allReviews.length ? (count / allReviews.length) * 100 : 0;
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 8 }}>{s}</span>
                          <span style={{ fontSize: 12, color: 'var(--gold)' }}>★</span>
                          <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 3 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gold)', borderRadius: 3, transition: 'width 0.3s' }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 20 }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => user ? setShowModal(true) : window.location.href = '/login'}
                    style={{ padding: '10px 20px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                    Write Review
                  </button>
                </div>

                {/* Reviews list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {allReviews.map(r => (
                    <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.userAvatar}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.userName}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {r.verified && <span style={{ fontSize: 10, color: 'var(--success)', fontWeight: 600 }}>✓ Verified</span>}
                              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{typeof r.date === 'string' && r.date.includes('T') ? new Date(r.date).toLocaleDateString('en-IN') : r.date}</span>
                            </div>
                          </div>
                        </div>
                        <Stars r={r.rating} size={14} />
                      </div>
                      {r.title && <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{r.title}</div>}
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: '100%', lineHeight: 1.6 }}>{r.text}</p>
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => handleHelpful(r.id)} style={{ fontSize: 12, color: 'var(--text-muted)', padding: '3px 8px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>
                          👍 Helpful ({r.helpful})
                        </button>
                      </div>
                      {r.ownerReply && (
                        <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--amber-subtle)', borderLeft: '3px solid var(--amber)' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber)', marginBottom: 2 }}>Owner Reply</div>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: '100%' }}>{r.ownerReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: 16, color: 'var(--text-primary)', marginBottom: 14 }}>Contact</h3>
              {[
                { icon: '📞', label: 'Phone', val: business.phone, href: `tel:${business.phone}` },
                { icon: '💬', label: 'WhatsApp', val: 'Chat on WhatsApp', href: `https://wa.me/${business.whatsapp}` },
                { icon: '✉️', label: 'Email', val: business.email, href: `mailto:${business.email}` },
                ...(business.website ? [{ icon: '🌐', label: 'Website', val: 'Visit Website', href: business.website }] : []),
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                  <span>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)' }}>{c.val}</div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: 16, color: 'var(--text-primary)', marginBottom: 14 }}>Business Info</h3>
              {[
                ['Established', business.established.toString()],
                ['Team Size', business.employees],
                ['Response Time', business.responseTime],
                ['Pincode', business.pincode],
              ].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <button onClick={() => user ? setShowModal(true) : (window.location.href = '/login')}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              ★ Write a Review
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ReviewModal
          businessId={business.id}
          businessSlug={business.slug}
          onClose={() => setShowModal(false)}
          onAdded={refreshReviews}
        />
      )}
    </div>
  );
}
