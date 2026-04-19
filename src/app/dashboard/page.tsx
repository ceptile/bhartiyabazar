'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getUserReviews, getBusinessReviews, Review } from '@/lib/reviews-store';

function Icon({ d, size = 18, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

function Stars({ r, size = 14 }: { r: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= r ? 'var(--gold)' : 'none'}
          stroke={s <= r ? 'var(--gold)' : 'var(--border-strong)'}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = 'var(--amber)' }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="card-flat" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 44, height: 44, borderRadius: 'var(--r-lg)', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        <Icon d={icon} size={20} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState<'overview' | 'reviews' | 'settings'>('overview');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'business' && user.businessSlug) {
      setReviews(getBusinessReviews(user.businessSlug));
    } else {
      setReviews(getUserReviews(user.id));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  const isBiz = user.role === 'business';
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '—';
  const initials = user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const TABS = [
    { key: 'overview', label: 'Overview', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
    { key: 'reviews', label: isBiz ? 'Reviews Received' : 'My Reviews', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { key: 'settings', label: 'Account', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 'clamp(1.2rem,2vw,1.5rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Welcome, {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {isBiz ? `Business Account — ${user.businessName || 'Your Business'}` : 'Personal Account'} &nbsp;·&nbsp; {user.city || 'India'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/profile" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" size={14} />
              Edit Profile
            </Link>
            {isBiz && (
              <Link href="/search" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon d="M15 3h6v6 M10 14L21 3 M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" size={14} />
                View Listing
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
                fontSize: 14, fontWeight: 500, border: 'none', borderRadius: 'var(--r-md) var(--r-md) 0 0',
                cursor: 'pointer', background: 'transparent',
                color: tab === t.key ? 'var(--amber)' : 'var(--text-muted)',
                borderBottom: tab === t.key ? '2px solid var(--amber)' : '2px solid transparent',
                transition: 'all var(--t)',
              }}>
              <Icon d={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
              {isBiz ? <>
                <StatCard icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" label="Profile Views" value="—" sub="Analytics coming soon" />
                <StatCard icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" label="Total Reviews" value={reviews.length} sub="Verified customer reviews" color="var(--gold)" />
                <StatCard icon="M22 11.08V12a10 10 0 1 1-5.93-9.14" label="Avg Rating" value={avgRating} sub={reviews.length > 0 ? `Based on ${reviews.length} reviews` : 'No reviews yet'} color="var(--success)" />
                <StatCard icon="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z" label="Pending Replies" value={reviews.filter(r => !r.ownerReply).length} sub="Customer reviews awaiting reply" color="var(--crimson)" />
              </> : <>
                <StatCard icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" label="Reviews Written" value={reviews.length} sub="Your honest feedback" color="var(--gold)" />
                <StatCard icon="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" label="Helpful Votes" value={reviews.reduce((a, r) => a + r.helpful, 0)} sub="Times your reviews helped others" color="var(--crimson)" />
                <StatCard icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8" label="Account Type" value="User" sub="Upgrade to list a business" />
              </>}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, marginBottom: 28 }}>
              {[
                { href: '/search',   icon: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z', label: 'Search Businesses' },
                { href: '/profile',  icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Edit Profile' },
                ...(isBiz ? [{ href: '/dashboard', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 2 2z', label: 'Reply to Reviews' }] : [{ href: '/register-business', icon: 'M12 5v14 M5 12h14', label: 'List a Business' }]),
                { href: '/contact',  icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z', label: 'Contact Support' },
              ].map(a => (
                <Link key={a.href + a.label} href={a.href}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', transition: 'all var(--t)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  <Icon d={a.icon} size={15} />
                  {a.label}
                </Link>
              ))}
            </div>

            {/* Recent reviews */}
            {reviews.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Recent Reviews</h2>
                  <button onClick={() => setTab('reviews')} style={{ fontSize: 13, color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {reviews.slice(0, 3).map(r => (
                    <div key={r.id} className="card-flat" style={{ display: 'flex', gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {r.userName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0,2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.userName}</span>
                          <Stars r={r.rating} />
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '100%' }}>{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={48} /></div>
                <h3>No reviews yet</h3>
                <p>{isBiz ? 'Reviews from customers will appear here.' : 'Start exploring businesses and share your experience.'}</p>
                <Link href="/search" className="btn btn-primary">Find Businesses</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map(r => (
                  <ReviewCard key={r.id} review={r} isBizOwner={isBiz} onReply={(id, text) => {
                    const { addOwnerReply } = require('@/lib/reviews-store');
                    addOwnerReply(id, text);
                    if (user.businessSlug) setReviews(getBusinessReviews(user.businessSlug));
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 600 }}>
            <div className="card-flat" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, fontFamily: 'var(--font-display)' }}>Account Information</h3>
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || 'Not set' },
                { label: 'City', value: user.city || 'Not set' },
                { label: 'Role', value: isBiz ? 'Business Owner' : 'Regular User' },
                { label: 'Member Since', value: new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ...(isBiz ? [{ label: 'Business Name', value: user.businessName || 'Not set' }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <Link href="/profile" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={15} />
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review: r, isBizOwner, onReply }: { review: Review; isBizOwner: boolean; onReply: (id: string, text: string) => void }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="card-flat">
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {r.userName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0,2)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.userName}</span>
              {r.verified && <span className="badge badge-success" style={{ marginLeft: 8 }}>Verified</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stars r={r.rating} />
              <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{new Date(r.date).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
          {r.title && <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{r.title}</div>}
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '100%' }}>{r.text}</p>
        </div>
      </div>

      {r.ownerReply && (
        <div style={{ marginLeft: 50, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', borderLeft: '3px solid var(--amber)', marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)', marginBottom: 4 }}>Owner Reply</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '100%' }}>{r.ownerReply}</p>
        </div>
      )}

      {isBizOwner && !r.ownerReply && (
        <div style={{ marginLeft: 50, marginTop: 10 }}>
          {!replyOpen ? (
            <button onClick={() => setReplyOpen(true)} style={{ fontSize: 13, color: 'var(--amber)', background: 'none', border: '1px solid var(--amber-glow)', borderRadius: 'var(--r-sm)', padding: '5px 12px', cursor: 'pointer' }}>Reply to Review</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                placeholder="Write a professional reply..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, resize: 'vertical', minHeight: 80, outline: 'none' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { if (replyText.trim()) { onReply(r.id, replyText.trim()); setReplyOpen(false); } }}
                  className="btn btn-primary btn-sm">Post Reply</button>
                <button onClick={() => { setReplyOpen(false); setReplyText(''); }} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}