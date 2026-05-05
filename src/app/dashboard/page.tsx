'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getUserReviews, getBusinessReviews, Review } from '@/lib/reviews-store';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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

// ── Inline Field Editor ───────────────────────────────────────────────
function EditableField({
  label, value, name, type = 'text', placeholder, onSave,
}: {
  label: string; value: string; name: string; type?: string;
  placeholder?: string; onSave: (name: string, val: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(value);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  // Keep local val in sync if parent value changes (e.g. after bizDoc loads)
  useEffect(() => { setVal(value); }, [value]);

  const save = async () => {
    setSaving(true);
    await onSave(name, val);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
      <div style={{ minWidth: 120 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
        {editing ? (
          type === 'textarea' ? (
            <textarea
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder={placeholder}
              style={{ width: '100%', minWidth: 220, padding: '6px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--amber)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', resize: 'vertical', minHeight: 72 }}
            />
          ) : (
            <input
              type={type}
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder={placeholder}
              style={{ padding: '6px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--amber)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', minWidth: 200 }}
            />
          )
        ) : (
          <div style={{ fontSize: 14, color: val ? 'var(--text-primary)' : 'var(--text-faint)', fontWeight: val ? 500 : 400 }}>
            {val || placeholder || 'Not set'}
            {saved && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--success)' }}>✓ Saved</span>}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, paddingTop: 18, flexShrink: 0 }}>
        {editing ? (
          <>
            <button onClick={save} disabled={saving}
              style={{ padding: '4px 12px', borderRadius: 'var(--r-sm)', background: 'var(--amber)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => { setVal(value); setEditing(false); }}
              style={{ padding: '4px 10px', borderRadius: 'var(--r-sm)', background: 'none', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: 12, cursor: 'pointer' }}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}
            style={{ padding: '4px 10px', borderRadius: 'var(--r-sm)', background: 'none', color: 'var(--amber)', border: '1px solid var(--amber-glow)', fontSize: 12, cursor: 'pointer' }}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

// ── Hours editor ─────────────────────────────────────────────────────
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function HoursEditor({ hours, onSave }: { hours: Record<string,string>; onSave: (h: Record<string,string>) => Promise<void> }) {
  const [vals, setVals]   = useState<Record<string,string>>(hours);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  // Sync if parent hours change after bizDoc loads
  useEffect(() => { setVals(hours); }, [JSON.stringify(hours)]);

  return (
    <div style={{ marginTop: 8 }}>
      {DAYS.map(d => (
        <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ width: 90, fontSize: 13, color: 'var(--text-muted)' }}>{d}</span>
          <input
            value={vals[d] ?? ''}
            onChange={e => setVals(v => ({ ...v, [d]: e.target.value }))}
            placeholder="e.g. 9:00 AM – 6:00 PM or Closed"
            style={{ flex: 1, padding: '5px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
          />
        </div>
      ))}
      <button
        onClick={async () => { setSaving(true); await onSave(vals); setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000); }}
        disabled={saving}
        style={{ marginTop: 8, padding: '6px 18px', borderRadius: 'var(--r-sm)', background: 'var(--amber)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Hours'}
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState<'overview' | 'reviews' | 'biz' | 'settings'>('overview');

  // Settings state
  const [pwOld,      setPwOld]      = useState('');
  const [pwNew,      setPwNew]      = useState('');
  const [pwConf,     setPwConf]     = useState('');
  const [pwMsg,      setPwMsg]      = useState('');
  const [pwSaving,   setPwSaving]   = useState(false);

  // Business doc state (for edit) — loaded from Firestore
  const [bizDoc, setBizDoc] = useState<Record<string, string>>({});

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

  // Load business Firestore doc so edit fields are pre-filled
  useEffect(() => {
    if (!user?.businessSlug) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'businesses', user.businessSlug!));
        if (snap.exists()) setBizDoc(snap.data() as Record<string, string>);
      } catch (e) {
        console.error('[dashboard] bizDoc load error', e);
      }
    })();
  }, [user?.businessSlug]);

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

  // Save a field to the user's Firestore profile doc
  const saveUserField = async (field: string, val: string) => {
    try {
      await updateDoc(doc(db, 'users', user.id), { [field]: val });
    } catch (e) { console.error(e); }
  };

  // Save a field to the business Firestore doc
  const saveBizField = async (field: string, val: string) => {
    if (!user.businessSlug) return;
    try {
      await updateDoc(doc(db, 'businesses', user.businessSlug), { [field]: val });
      setBizDoc(prev => ({ ...prev, [field]: val }));
    } catch (e) { console.error(e); }
  };

  // Save business hours
  const saveBizHours = async (hours: Record<string,string>) => {
    if (!user.businessSlug) return;
    try {
      await updateDoc(doc(db, 'businesses', user.businessSlug), { hours });
      setBizDoc(prev => ({ ...prev, hours: JSON.stringify(hours) }));
    } catch (e) { console.error(e); }
  };

  // Change password
  const changePassword = async () => {
    if (!pwNew || pwNew !== pwConf) { setPwMsg('Passwords do not match.'); return; }
    if (pwNew.length < 6) { setPwMsg('Password must be at least 6 characters.'); return; }
    setPwSaving(true); setPwMsg('');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) throw new Error('Not logged in');
      const cred = EmailAuthProvider.credential(currentUser.email, pwOld);
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, pwNew);
      setPwMsg('✓ Password updated successfully.');
      setPwOld(''); setPwNew(''); setPwConf('');
    } catch (e: unknown) {
      const msg = (e as {message?:string}).message || 'Failed to update password.';
      setPwMsg(msg.includes('wrong-password') || msg.includes('invalid-credential') ? 'Current password is incorrect.' : msg);
    }
    setPwSaving(false);
  };

  const TABS = [
    { key: 'overview',  label: 'Overview',   icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
    { key: 'reviews',   label: isBiz ? 'Reviews' : 'My Reviews', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    ...(isBiz ? [{ key: 'biz', label: 'Business Profile', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' }] : []),
    { key: 'settings',  label: 'Settings',   icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
  ];

  // Parse hours safely from bizDoc
  const parsedHours = (() => {
    try {
      const h = (bizDoc as Record<string, unknown>).hours;
      if (!h) return {};
      if (typeof h === 'object') return h as Record<string, string>;
      return JSON.parse(h as string) as Record<string, string>;
    } catch { return {}; }
  })();

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
            {isBiz && (
              <button onClick={() => setTab('biz')} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" size={14} />
                Edit Business
              </button>
            )}
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
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 28, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
                fontSize: 14, fontWeight: 500, border: 'none', borderRadius: 'var(--r-md) var(--r-md) 0 0',
                cursor: 'pointer', background: 'transparent', whiteSpace: 'nowrap',
                color: tab === t.key ? 'var(--amber)' : 'var(--text-muted)',
                borderBottom: tab === t.key ? '2px solid var(--amber)' : '2px solid transparent',
                transition: 'all var(--t)',
              }}>
              <Icon d={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ─────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>Command Center</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Real-time performance metrics and account status.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
              {isBiz ? <>
                <StatCard icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" label="Profile Views" value="1,284" sub="+12% from last month" />
                <StatCard icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" label="Total Reviews" value={reviews.length} sub="Verified customer reviews" color="var(--gold)" />
                <StatCard icon="M22 11.08V12a10 10 0 1 1-5.93-9.14" label="Avg Rating" value={avgRating} sub={reviews.length > 0 ? `Based on ${reviews.length} reviews` : 'No reviews yet'} color="var(--success)" />
                <StatCard icon="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z" label="Pending Replies" value={reviews.filter(r => !r.ownerReply).length} sub="Customer reviews awaiting reply" color="var(--crimson)" />
              </> : <>
                <StatCard icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" label="Reviews Written" value={reviews.length} sub="Your honest feedback" color="var(--gold)" />
                <StatCard icon="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" label="Helpful Votes" value={reviews.reduce((a, r) => a + r.helpful, 0)} sub="Times your reviews helped others" color="var(--crimson)" />
                <StatCard icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8" label="Profile Views" value="42" sub="Users viewed your profile" />
              </>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, marginBottom: 28 }}>
              {[
                { href: '/search',   icon: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z', label: 'Search Businesses' },
                ...(isBiz ? [{ href: '#', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', label: 'Edit Business Profile', onClick: () => setTab('biz') }] : [{ href: '/register-business', icon: 'M12 5v14 M5 12h14', label: 'List a Business' }]),
                { href: '#', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', label: 'Account Settings', onClick: () => setTab('settings') },
                { href: '/contact',  icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z', label: 'Contact Support' },
              ].map(a => (
                a.onClick ? (
                  <button key={a.label} onClick={a.onClick}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all var(--t)', textAlign: 'left' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    <Icon d={a.icon} size={15} />{a.label}
                  </button>
                ) : (
                  <Link key={a.label} href={a.href}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', transition: 'all var(--t)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    <Icon d={a.icon} size={15} />{a.label}
                  </Link>
                )
              ))}
            </div>

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

        {/* ── REVIEWS ──────────────────────────────── */}
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

        {/* ── BUSINESS PROFILE EDIT ─────────────────── */}
        {tab === 'biz' && isBiz && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Business Profile</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Changes are saved to Firestore instantly. Your public listing updates immediately.</p>
              </div>
              {user.businessSlug && (
                <Link href={`/business/${user.businessSlug}`} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon d="M15 3h6v6 M10 14L21 3" size={13} /> View Public Listing
                </Link>
              )}
            </div>

            <div className="card-flat" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Basic Info</h3>
              <EditableField label="Business Name"  name="name"        value={bizDoc.name        || user.businessName || ''} placeholder="Your business name"     onSave={saveBizField} />
              <EditableField label="Category"       name="category"    value={bizDoc.category    || ''}                       placeholder="e.g. Restaurant, Tailor" onSave={saveBizField} />
              <EditableField label="Phone Number"   name="phone"       value={bizDoc.phone       || ''}                       placeholder="+91 XXXXX XXXXX"        onSave={saveBizField} />
              <EditableField label="Website"        name="website"     value={bizDoc.website     || ''}                       placeholder="https://yoursite.com"   onSave={saveBizField} />
              <EditableField label="WhatsApp"       name="whatsapp"    value={bizDoc.whatsapp    || ''}                       placeholder="+91 XXXXX XXXXX"        onSave={saveBizField} />
            </div>

            <div className="card-flat" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Description & Location</h3>
              <EditableField label="Short Description" name="description" value={bizDoc.description || ''} placeholder="Describe your business"     type="textarea" onSave={saveBizField} />
              <EditableField label="Address / Area"    name="area"        value={bizDoc.area        || ''} placeholder="Sector 15, Faridabad"                    onSave={saveBizField} />
              <EditableField label="City"              name="city"        value={bizDoc.city        || user.city || ''} placeholder="Faridabad"           onSave={saveBizField} />
              <EditableField label="Pincode"           name="pincode"     value={bizDoc.pincode     || ''} placeholder="121007"                               onSave={saveBizField} />
            </div>

            <div className="card-flat" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Business Hours</h3>
              <p style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 12 }}>Enter hours for each day, or type &quot;Closed&quot; for days you are not open.</p>
              <HoursEditor hours={parsedHours} onSave={saveBizHours} />
            </div>

            <div className="card-flat">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Social Media</h3>
              <EditableField label="Facebook"    name="facebook"   value={bizDoc.facebook    || ''} placeholder="https://facebook.com/yourpage"    onSave={saveBizField} />
              <EditableField label="Instagram"   name="instagram"  value={bizDoc.instagram   || ''} placeholder="https://instagram.com/yourhandle" onSave={saveBizField} />
              <EditableField label="Google Maps" name="googleMaps" value={bizDoc.googleMaps  || ''} placeholder="Paste Google Maps embed link"    onSave={saveBizField} />
            </div>
          </div>
        )}

        {/* ── SETTINGS ─────────────────────────────── */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 600 }}>
            {/* Account Info */}
            <div className="card-flat" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>Personal Information</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Click Edit on any field to update your profile.</p>
              <EditableField label="Full Name" name="name"  value={user.name}       placeholder="Your full name"   onSave={saveUserField} />
              <EditableField label="Phone"     name="phone" value={user.phone || ''} placeholder="+91 XXXXX XXXXX" onSave={saveUserField} />
              <EditableField label="City"      name="city"  value={user.city  || ''} placeholder="e.g. Faridabad" onSave={saveUserField} />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Email</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.email} <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>(contact support to change)</span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Member Since</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Change Password */}
            <div className="card-flat" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>Change Password</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Use a strong password with letters, numbers and symbols.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {([
                  { label: 'Current Password', val: pwOld, set: setPwOld },
                  { label: 'New Password',     val: pwNew, set: setPwNew },
                  { label: 'Confirm New',      val: pwConf,set: setPwConf },
                ] as {label:string;val:string;set:(v:string)=>void}[]).map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input
                      type="password"
                      value={f.val}
                      onChange={e => f.set(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                ))}
                {pwMsg && (
                  <div style={{ fontSize: 13, color: pwMsg.startsWith('✓') ? 'var(--success)' : 'var(--crimson)' }}>{pwMsg}</div>
                )}
                <button onClick={changePassword} disabled={pwSaving}
                  className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                  {pwSaving ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="card-flat">
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Account</h3>
              {[
                { label: 'Account Type', value: isBiz ? 'Business Owner' : 'Regular User' },
                { label: 'Status',       value: 'Active' },
                { label: 'Role',         value: user.role },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              {!isBiz && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Want to list your business on BhartiyaBazar?</p>
                  <Link href="/register-business" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon d="M12 5v14 M5 12h14" size={14} /> List Your Business Free
                  </Link>
                </div>
              )}
            </div>
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
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '100%' }}>{r.text}</p>
        </div>
      </div>
      {r.ownerReply && (
        <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', borderLeft: '3px solid var(--amber)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', marginBottom: 4 }}>Owner Reply</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.ownerReply}</p>
        </div>
      )}
      {isBizOwner && !r.ownerReply && (
        <div style={{ marginTop: 10 }}>
          {replyOpen ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply to this review…"
                style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', resize: 'vertical', minHeight: 80 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { if (replyText.trim()) { onReply(r.id, replyText.trim()); setReplyOpen(false); } }}
                  style={{ padding: '6px 16px', borderRadius: 'var(--r-sm)', background: 'var(--amber)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Submit Reply
                </button>
                <button onClick={() => setReplyOpen(false)}
                  style={{ padding: '6px 12px', borderRadius: 'var(--r-sm)', background: 'none', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setReplyOpen(true)}
              style={{ padding: '5px 14px', borderRadius: 'var(--r-sm)', background: 'none', color: 'var(--amber)', border: '1px solid var(--amber-glow)', fontSize: 12, cursor: 'pointer' }}>
              Reply to Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
