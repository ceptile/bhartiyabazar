'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { businesses } from '@/lib/data';
import { getBusinessReviews, markHelpful, Review } from '@/lib/reviews-store';
import ReviewModal from '@/components/reviews/ReviewModal';
import { useAuth } from '@/lib/auth-context';

// --- THEMES ---
const THEMES: Record<string, any> = {
  modern: {
    font: 'inherit',
    headerBg: 'var(--surface)',
    accent: 'var(--amber)',
    radius: 'var(--r-lg)',
    shadow: 'var(--shadow-md)',
  },
  professional: {
    font: "'Inter', sans-serif",
    headerBg: '#0f172a',
    headerText: '#fff',
    accent: '#3b82f6',
    radius: '4px',
    shadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  creative: {
    font: "'EB Garamond', serif",
    headerBg: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    headerText: '#fff',
    accent: '#a855f7',
    radius: '24px',
    shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  }
};

function Stars({ r, size = 14, color = 'var(--gold)' }: { r: number; size?: number; color?: string }) {
  return <span>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r ? color : 'var(--border-strong)', fontSize: size }}>★</span>)}</span>;
}

function Section({ title, children, theme }: { title: string; children: React.ReactNode; theme: any }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: theme.radius, padding: '24px', marginBottom: 16, boxShadow: theme.shadow }}>
      <h2 style={{ fontFamily: theme.font, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 4, height: 18, background: theme.accent, borderRadius: 2 }} />
        {title}
      </h2>
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
  
  // Simulation of business-specific theme (would come from Firestore)
  const [themeId, setThemeId] = useState('modern');
  const theme = THEMES[themeId] || THEMES.modern;

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
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64, fontFamily: theme.font }}>
      
      {/* Theme Switcher (Owner Preview Only) */}
      {user?.role === 'business' && user.businessSlug === slug && (
        <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000, background: 'var(--surface)', padding: '12px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Theme Preview</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.keys(THEMES).map(t => (
              <button key={t} onClick={() => setThemeId(t)} style={{ padding: '4px 10px', borderRadius: 'var(--r-sm)', fontSize: 11, background: themeId === t ? 'var(--amber)' : 'var(--surface-2)', color: themeId === t ? '#fff' : 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div style={{ background: theme.headerBg, color: theme.headerText || 'var(--text-primary)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            {business.images[0] && (
              <img src={business.images[imgIdx] || business.images[0]} alt={business.name} 
                style={{ width: 160, height: 160, borderRadius: theme.radius, objectFit: 'cover', border: '4px solid rgba(255,255,255,0.2)', boxShadow: 'var(--shadow-lg)' }} />
            )}
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {business.verified && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }}>✓ VERIFIED</span>}
                {business.openNow ? <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }}>OPEN NOW</span> : <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 700 }}>CLOSED</span>}
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'rgba(212, 160, 23, 0.2)', color: 'var(--amber)', fontWeight: 700 }}>{business.category.toUpperCase()}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 12, lineHeight: 1 }}>{business.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', opacity: 0.9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Stars r={Math.round(Number(avgRating))} size={18} color={theme.headerText ? '#fff' : 'var(--gold)'} />
                  <span style={{ fontWeight: 700, fontSize: 18 }}>{avgRating}</span>
                  <span style={{ fontSize: 14 }}>({allReviews.length} reviews)</span>
                </div>
                <div style={{ width: 1, height: 20, background: 'currentColor', opacity: 0.3 }} />
                <div style={{ fontSize: 15 }}>{business.area}, {business.city}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

          {/* Main Content */}
          <div>
            {/* Nav Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              {['overview', 'gallery', 'products', 'reviews'].map(t => (
                <button key={t} onClick={() => setTab(t)} 
                  style={{ 
                    padding: '10px 20px', borderRadius: theme.radius, background: tab === t ? theme.accent : 'transparent', 
                    color: tab === t ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, textTransform: 'capitalize',
                    transition: 'all 0.2s'
                  }}>
                  {t}{t === 'reviews' ? ` (${allReviews.length})` : ''}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Section title="About Us" theme={theme}>
                  <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{business.description}</p>
                </Section>
                
                {business.services.length > 0 && (
                  <Section title="Our Services" theme={theme}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                      {business.services.map(s => (
                        <div key={s} style={{ fontSize: 14, color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ color: theme.accent, fontWeight: 800 }}>✓</span> {s}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                <Section title="Location" theme={theme}>
                  <div style={{ height: 300, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 40 }}>📍</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{business.area}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{business.city}, {business.state} {business.pincode}</div>
                    </div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + business.area + ' ' + business.city)}`} 
                      target="_blank" rel="noopener" style={{ padding: '8px 20px', background: theme.accent, color: '#fff', borderRadius: 'var(--r-md)', textDecoration: 'none', fontSize: 13, fontWeight: 700, marginTop: 10 }}>
                      Open in Google Maps
                    </a>
                  </div>
                </Section>
              </div>
            )}

            {tab === 'gallery' && (
              <Section title="Photo Gallery" theme={theme}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {business.images.map((img, i) => (
                    <div key={i} style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', height: 200, cursor: 'pointer', border: '1px solid var(--border)' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} 
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {tab === 'products' && (
              <Section title="Products & Services" theme={theme}>
                {business.products.length === 0
                  ? <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No products listed yet.</p>
                  : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                      {business.products.map(p => (
                        <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s' }}>
                          <img src={p.image} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                          <div style={{ padding: '16px' }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{p.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                              <span style={{ fontSize: 18, fontWeight: 800, color: theme.accent }}>₹{p.price.toLocaleString('en-IN')}</span>
                              {p.originalPrice && <span style={{ fontSize: 13, color: 'var(--text-faint)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</span>}
                            </div>
                            <button style={{ width: '100%', padding: '8px', borderRadius: 'var(--r-sm)', background: 'transparent', border: `1px solid ${theme.accent}`, color: theme.accent, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Enquire Now</button>
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </Section>
            )}

            {tab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Section title="Reviews" theme={theme}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 32, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{avgRating}</div>
                      <Stars r={Math.round(Number(avgRating))} size={20} />
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>{allReviews.length} verified reviews</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      {[5,4,3,2,1].map(s => {
                        const count = allReviews.filter(r => Math.round(r.rating) === s).length;
                        const pct = allReviews.length ? (count / allReviews.length) * 100 : 0;
                        return (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 10 }}>{s}</span>
                            <div style={{ flex: 1, height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: theme.accent, borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 24 }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button onClick={() => user ? setShowModal(true) : window.location.href = '/login'}
                    style={{ width: '100%', padding: '14px', borderRadius: theme.radius, background: theme.accent, color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    Write a Review
                  </button>
                </Section>

                {allReviews.map(r => (
                  <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: theme.radius, padding: '20px', boxShadow: theme.shadow }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: theme.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{r.userAvatar}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{r.userName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{typeof r.date === 'string' && r.date.includes('T') ? new Date(r.date).toLocaleDateString('en-IN') : r.date}</div>
                        </div>
                      </div>
                      <Stars r={r.rating} />
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.text}</p>
                    {r.ownerReply && (
                      <div style={{ marginTop: 16, padding: '16px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', borderLeft: `4px solid ${theme.accent}` }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: theme.accent, marginBottom: 4, textTransform: 'uppercase' }}>Response from Owner</div>
                        <p style={{ fontSize: 14, color: 'var(--text-primary)' }}>{r.ownerReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: theme.radius, padding: '24px', boxShadow: theme.shadow }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '📞', label: 'Call Us', val: business.phone, href: `tel:${business.phone}` },
                  { icon: '💬', label: 'WhatsApp', val: 'Chat Now', href: `https://wa.me/${business.whatsapp}`, color: '#25d366' },
                  { icon: '✉️', label: 'Email', val: business.email, href: `mailto:${business.email}` },
                  ...(business.website ? [{ icon: '🌐', label: 'Website', val: 'Visit Site', href: business.website }] : []),
                ].map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'var(--text-primary)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c.color || theme.accent }}>{c.val}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: theme.radius, padding: '24px', boxShadow: theme.shadow }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Business Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Established', business.established],
                  ['Employee Count', business.employees],
                  ['Response Time', business.responseTime],
                  ['Locality', business.area],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: theme.radius, padding: '24px', boxShadow: theme.shadow }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Share</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Facebook', 'Twitter', 'LinkedIn'].map(s => (
                  <button key={s} style={{ flex: 1, padding: '8px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 12 }}>{s}</button>
                ))}
              </div>
            </div>
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
