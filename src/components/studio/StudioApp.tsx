'use client';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  collection, doc, getDoc, setDoc, getDocs, addDoc,
  deleteDoc, updateDoc, serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';

const ADMIN_EMAIL = 'ceptile.com@gmail.com';

// ─── Icon ────────────────────────────────────────────────────────────────────
function Icon({ d, size = 16 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',      label: 'Overview',         icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'users',         label: 'Users',             icon: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'] },
  { id: 'businesses',    label: 'Businesses',        icon: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'] },
  { id: 'contacts',      label: 'Contacts',          icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.59 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z' },
  { id: 'announcements', label: 'Announcements',     icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
  { id: 'media',         label: 'Media & Slider',    icon: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'] },
  { id: 'pricing',       label: 'Pricing & Coupons', icon: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'] },
  { id: 'content',       label: 'Content',           icon: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'] },
  { id: 'seo',           label: 'SEO & Meta',        icon: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' },
  { id: 'appearance',    label: 'Appearance',        icon: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'] },
  { id: 'settings',      label: 'Site Settings',     icon: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'] },
];

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 24px', flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: accent ? 'var(--amber)' : 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function FieldInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input {...props} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...props.style }} />
    </div>
  );
}

function FieldTextarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <textarea {...props} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', minHeight: 100, resize: 'vertical', boxSizing: 'border-box', ...props.style }} />
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', small, style: s }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: 'primary' | 'danger' | 'ghost'; small?: boolean;
  style?: React.CSSProperties;
}) {
  const styles: React.CSSProperties = {
    padding: small ? '6px 14px' : '9px 18px',
    borderRadius: 'var(--r-md)',
    fontSize: small ? 12 : 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: variant === 'primary' ? 'var(--amber)' : variant === 'danger' ? 'var(--crimson)' : 'var(--surface)',
    color: variant === 'ghost' ? 'var(--text-secondary)' : '#fff',
    outline: variant === 'ghost' ? '1px solid var(--border)' : 'none',
    ...s,
  };
  return <button onClick={onClick} style={styles}>{children}</button>;
}

function Card({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 24, ...s }}>
      {children}
    </div>
  );
}

function TableWrap({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudioApp() {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [active,   setActive]   = useState('overview');
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setAuthed(!!(u && u.email === ADMIN_EMAIL));
      setChecking(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setLoginErr('Access denied. Admin only.');
      }
    } catch {
      setLoginErr('Invalid email or password.');
    }
  };

  // Loading
  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading Studio…</div>
    </div>
  );

  // Login screen
  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <form onSubmit={handleLogin} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 40, width: 360, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>
              BB <span style={{ color: 'var(--amber)' }}>Studio</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Admin access only</p>
        </div>
        {loginErr && (
          <div style={{ background: 'var(--crimson-subtle, rgba(180,30,45,0.08))', color: 'var(--crimson)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16, border: '1px solid var(--crimson-glow, rgba(180,30,45,0.2))' }}>
            {loginErr}
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
          Enter Studio
        </button>
      </form>
    </div>
  );

  const renderSection = () => {
    switch (active) {
      case 'overview':      return <OverviewSection />;
      case 'users':         return <UsersSection />;
      case 'businesses':    return <BusinessesSection />;
      case 'contacts':      return <ContactsSection />;
      case 'announcements': return <AnnouncementsSection />;
      case 'media':         return <MediaSection />;
      case 'pricing':       return <PricingSection />;
      case 'content':       return <ContentSection />;
      case 'seo':           return <SeoSection />;
      case 'appearance':    return <AppearanceSection />;
      case 'settings':      return <SettingsSection />;
      default:              return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: 'var(--font-body, sans-serif)' }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: sideOpen ? 232 : 56, flexShrink: 0,
        background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease', overflow: 'hidden',
      }}>
        {/* Logo row */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={() => setSideOpen(o => !o)}
            style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Icon d="M4 6h16M4 12h16M4 18h16" />
          </button>
          {sideOpen && (
            <span style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              BB <span style={{ color: 'var(--amber)' }}>Studio</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer',
              marginBottom: 2, textAlign: 'left', whiteSpace: 'nowrap', fontSize: 13, fontWeight: active === n.id ? 600 : 400,
              background: active === n.id ? 'var(--amber-subtle)' : 'transparent',
              color: active === n.id ? 'var(--amber)' : 'var(--text-secondary)',
              outline: active === n.id ? '1px solid var(--amber-glow)' : 'none',
            }}>
              <span style={{ flexShrink: 0 }}><Icon d={n.icon} size={15} /></span>
              {sideOpen && n.label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={() => signOut(auth)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 'var(--r-md)', border: 'none',
            cursor: 'pointer', background: 'transparent', color: 'var(--crimson)',
            fontSize: 13, whiteSpace: 'nowrap',
          }}>
            <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={15} />
            {sideOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
        {renderSection()}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function OverviewSection() {
  const [stats, setStats] = useState({ users: 0, businesses: 0, contacts: 0, announcements: 0 });
  useEffect(() => {
    (async () => {
      const [u, b, c, a] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'businesses')),
        getDocs(collection(db, 'contacts')),
        getDocs(collection(db, 'announcements')),
      ]);
      setStats({ users: u.size, businesses: b.size, contacts: c.size, announcements: a.size });
    })();
  }, []);

  return (
    <div>
      <SectionHeader title="Overview" sub="Real-time snapshot of your platform" />
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total Users"        value={stats.users}         sub="Registered accounts"  accent />
        <StatCard label="Businesses"         value={stats.businesses}    sub="Listed on platform" />
        <StatCard label="Contact Messages"   value={stats.contacts}      sub="Received inquiries" />
        <StatCard label="Announcements"      value={stats.announcements} sub="Active circulars" />
      </div>
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['📣 New Announcement', '🖼️ Upload Media', '💰 Add Coupon', '✍️ Edit Content'].map(label => (
            <div key={label} style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', fontSize: 13, color: 'var(--amber)', fontWeight: 500 }}>{label}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function UsersSection() {
  const [users, setUsers]     = useState<{ id: string; name: string; email: string; role: string; joinedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    getDocs(query(collection(db, 'users'), orderBy('joinedAt', 'desc'), limit(200)))
      .then(snap => { setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Users" sub="All registered users on the platform" />
      <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', marginBottom: 20, width: 280 }} />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <TableWrap headers={['Name', 'Email', 'Role', 'Joined']}>
          {filtered.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '11px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{u.name || '—'}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{u.email}</td>
              <td style={{ padding: '11px 16px' }}>
                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: u.role === 'business' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                  color: u.role === 'business' ? '#10b981' : '#6366f1' }}>
                  {u.role || 'user'}
                </span>
              </td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)', fontSize: 12 }}>
                {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </TableWrap>
      )}
    </div>
  );
}

function BusinessesSection() {
  const [businesses, setBusinesses] = useState<{ id: string; name: string; category: string; city: string; verified: boolean; ownerEmail: string }[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    getDocs(query(collection(db, 'businesses'), orderBy('createdAt', 'desc'), limit(200)))
      .then(snap => { setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); });
  }, []);

  const filtered = businesses.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleVerified = async (id: string, cur: boolean) => {
    await updateDoc(doc(db, 'businesses', id), { verified: !cur });
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, verified: !cur } : b));
  };

  return (
    <div>
      <SectionHeader title="Businesses" sub="All listed businesses on the platform" />
      <input placeholder="Search by name or city…" value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', marginBottom: 20, width: 280 }} />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <TableWrap headers={['Name', 'Category', 'City', 'Verified', 'Actions']}>
          {filtered.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '11px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{b.name}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{b.category || '—'}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{b.city || '—'}</td>
              <td style={{ padding: '11px 16px' }}>
                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: b.verified ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: b.verified ? '#10b981' : '#ef4444' }}>
                  {b.verified ? 'Verified' : 'Unverified'}
                </span>
              </td>
              <td style={{ padding: '11px 16px' }}>
                <Btn small variant={b.verified ? 'danger' : 'primary'} onClick={() => toggleVerified(b.id, b.verified)}>
                  {b.verified ? 'Unverify' : 'Verify'}
                </Btn>
              </td>
            </tr>
          ))}
        </TableWrap>
      )}
    </div>
  );
}

function ContactsSection() {
  const [contacts, setContacts] = useState<{ id: string; name: string; email: string; message: string; createdAt: string }[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(100)))
      .then(snap => { setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); });
  }, []);

  const del = async (id: string) => {
    await deleteDoc(doc(db, 'contacts', id));
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <SectionHeader title="Contacts" sub="Messages submitted via the contact form" />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {contacts.map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{c.email} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{c.message}</p>
                </div>
                <Btn small variant="danger" onClick={() => del(c.id)}>Delete</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementsSection() {
  const [list, setList]     = useState<{ id: string; title: string; body: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const snap = await getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(50)));
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await addDoc(collection(db, 'announcements'), { title, body, createdAt: new Date().toISOString() });
    setTitle(''); setBody('');
    await load();
    setSaving(false);
  };

  const del = async (id: string) => {
    await deleteDoc(doc(db, 'announcements', id));
    setList(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div>
      <SectionHeader title="Announcements" sub="Publish platform-wide notices" />
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>New Announcement</h3>
        <FieldInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" />
        <FieldTextarea label="Body" value={body} onChange={e => setBody(e.target.value)} placeholder="Announcement content…" />
        <Btn onClick={add}>{saving ? 'Saving…' : 'Publish'}</Btn>
      </Card>
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(a => (
            <Card key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{a.body}</p>
                </div>
                <Btn small variant="danger" onClick={() => del(a.id)}>Delete</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MediaSection() {
  const [slides, setSlides]   = useState<{ id: string; imageUrl: string; caption: string; order: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl]         = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    const snap = await getDocs(query(collection(db, 'slides'), orderBy('order', 'asc')));
    setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!url.trim()) return;
    setSaving(true);
    await addDoc(collection(db, 'slides'), { imageUrl: url, caption, order: slides.length });
    setUrl(''); setCaption('');
    await load();
    setSaving(false);
  };

  const del = async (id: string) => {
    await deleteDoc(doc(db, 'slides', id));
    setSlides(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div>
      <SectionHeader title="Media & Slider" sub="Manage homepage slider images" />
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Slide</h3>
        <FieldInput label="Image URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" />
        <FieldInput label="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption text" />
        <Btn onClick={add}>{saving ? 'Saving…' : 'Add Slide'}</Btn>
      </Card>
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {slides.map(s => (
            <Card key={s.id} style={{ padding: 0, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt={s.caption} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.caption || 'No caption'}</span>
                <Btn small variant="danger" onClick={() => del(s.id)}>✕</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PricingSection() {
  const [plans, setPlans]     = useState<{ id: string; name: string; price: number; features: string; popular: boolean }[]>([]);
  const [coupons, setCoupons] = useState<{ id: string; code: string; discount: number; type: string; expiry: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [pName, setPName]     = useState('');
  const [pPrice, setPPrice]   = useState('');
  const [pFeats, setPFeats]   = useState('');
  const [pPop, setPPop]       = useState(false);
  const [cCode, setCCode]     = useState('');
  const [cDisc, setCDisc]     = useState('');
  const [cType, setCType]     = useState('percent');
  const [cExp, setCExp]       = useState('');

  const load = async () => {
    const [ps, cs] = await Promise.all([
      getDocs(query(collection(db, 'plans'), orderBy('price', 'asc'))),
      getDocs(query(collection(db, 'coupons'), orderBy('createdAt', 'desc'))),
    ]);
    setPlans(ps.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    setCoupons(cs.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addPlan = async () => {
    if (!pName.trim()) return;
    await addDoc(collection(db, 'plans'), { name: pName, price: parseFloat(pPrice) || 0, features: pFeats, popular: pPop, createdAt: serverTimestamp() });
    setPName(''); setPPrice(''); setPFeats(''); setPPop(false);
    await load();
  };

  const delPlan = async (id: string) => { await deleteDoc(doc(db, 'plans', id)); setPlans(p => p.filter(x => x.id !== id)); };

  const addCoupon = async () => {
    if (!cCode.trim()) return;
    await addDoc(collection(db, 'coupons'), { code: cCode.toUpperCase(), discount: parseFloat(cDisc) || 0, type: cType, expiry: cExp, createdAt: serverTimestamp() });
    setCCode(''); setCDisc(''); setCExp('');
    await load();
  };

  const delCoupon = async (id: string) => { await deleteDoc(doc(db, 'coupons', id)); setCoupons(p => p.filter(x => x.id !== id)); };

  return (
    <div>
      <SectionHeader title="Pricing & Coupons" sub="Manage subscription plans and discount codes" />
      {/* Plans */}
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FieldInput label="Name" value={pName} onChange={e => setPName(e.target.value)} placeholder="e.g. Pro" />
          <FieldInput label="Price (₹/mo)" value={pPrice} onChange={e => setPPrice(e.target.value)} type="number" placeholder="999" />
        </div>
        <FieldTextarea label="Features (one per line)" value={pFeats} onChange={e => setPFeats(e.target.value)} placeholder="Feature 1&#10;Feature 2" style={{ minHeight: 80 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={pPop} onChange={e => setPPop(e.target.checked)} /> Mark as Popular
          </label>
        </div>
        <Btn onClick={addPlan}>Add Plan</Btn>
      </Card>
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {plans.map(p => (
            <Card key={p.id} style={{ position: 'relative' }}>
              {p.popular && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, color: 'var(--amber)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', padding: '2px 8px', borderRadius: 999 }}>POPULAR</span>}
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--amber)', marginBottom: 10 }}>₹{p.price}<span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>{p.features}</div>
              <Btn small variant="danger" onClick={() => delPlan(p.id)}>Delete</Btn>
            </Card>
          ))}
        </div>
      )}

      {/* Coupons */}
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Coupon</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <FieldInput label="Code" value={cCode} onChange={e => setCCode(e.target.value)} placeholder="SAVE20" />
          <FieldInput label="Discount" value={cDisc} onChange={e => setCDisc(e.target.value)} type="number" placeholder="20" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
            <select value={cType} onChange={e => setCType(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}>
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
        </div>
        <FieldInput label="Expiry Date" value={cExp} onChange={e => setCExp(e.target.value)} type="date" />
        <Btn onClick={addCoupon}>Add Coupon</Btn>
      </Card>
      {!loading && (
        <TableWrap headers={['Code', 'Discount', 'Type', 'Expiry', '']}>
          {coupons.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '11px 16px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'monospace', fontSize: 13 }}>{c.code}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-primary)' }}>{c.discount}{c.type === 'percent' ? '%' : '₹'}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{c.type}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{c.expiry || '—'}</td>
              <td style={{ padding: '11px 16px' }}><Btn small variant="danger" onClick={() => delCoupon(c.id)}>Delete</Btn></td>
            </tr>
          ))}
        </TableWrap>
      )}
    </div>
  );
}

function ContentSection() {
  const [pages, setPages]     = useState<{ id: string; slug: string; title: string; body: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug]       = useState('');
  const [title, setTitle]     = useState('');
  const [body, setBody]       = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    const snap = await getDocs(collection(db, 'content'));
    setPages(snap.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!slug.trim() || !title.trim()) return;
    setSaving(true);
    if (editing) {
      await updateDoc(doc(db, 'content', editing), { slug, title, body, updatedAt: serverTimestamp() });
    } else {
      await setDoc(doc(db, 'content', slug), { slug, title, body, createdAt: serverTimestamp() });
    }
    setSlug(''); setTitle(''); setBody(''); setEditing(null);
    await load();
    setSaving(false);
  };

  const edit = (p: { id: string; slug: string; title: string; body: string }) => {
    setEditing(p.id); setSlug(p.slug); setTitle(p.title); setBody(p.body);
  };

  const del = async (id: string) => {
    await deleteDoc(doc(db, 'content', id));
    setPages(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <SectionHeader title="Content" sub="Manage static page content" />
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{editing ? 'Edit Page' : 'New Page'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FieldInput label="Slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="about-us" />
          <FieldInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="About Us" />
        </div>
        <FieldTextarea label="Body (HTML/Markdown)" value={body} onChange={e => setBody(e.target.value)} style={{ minHeight: 160 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={save}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Btn>
          {editing && <Btn variant="ghost" onClick={() => { setEditing(null); setSlug(''); setTitle(''); setBody(''); }}>Cancel</Btn>}
        </div>
      </Card>
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <TableWrap headers={['Slug', 'Title', 'Actions']}>
          {pages.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>/{p.slug}</td>
              <td style={{ padding: '11px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{p.title}</td>
              <td style={{ padding: '11px 16px', display: 'flex', gap: 8 }}>
                <Btn small variant="ghost" onClick={() => edit(p)}>Edit</Btn>
                <Btn small variant="danger" onClick={() => del(p.id)}>Delete</Btn>
              </td>
            </tr>
          ))}
        </TableWrap>
      )}
    </div>
  );
}

function SeoSection() {
  const [data, setData]     = useState({ siteTitle: '', siteDescription: '', keywords: '', ogImage: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'seo')).then(d => {
      if (d.exists()) setData(d.data() as typeof data);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, 'settings', 'seo'), { ...data, updatedAt: serverTimestamp() });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="SEO & Meta" sub="Site-wide metadata for search engines and social sharing" />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <Card>
          <FieldInput label="Site Title" value={data.siteTitle} onChange={e => setData(d => ({ ...d, siteTitle: e.target.value }))} placeholder="BhartiyaBazar — India's Business Hub" />
          <FieldTextarea label="Meta Description" value={data.siteDescription} onChange={e => setData(d => ({ ...d, siteDescription: e.target.value }))} style={{ minHeight: 80 }} />
          <FieldInput label="Keywords (comma-separated)" value={data.keywords} onChange={e => setData(d => ({ ...d, keywords: e.target.value }))} />
          <FieldInput label="OG Image URL" value={data.ogImage} onChange={e => setData(d => ({ ...d, ogImage: e.target.value }))} placeholder="https://…" />
          <Btn onClick={save}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}</Btn>
        </Card>
      )}
    </div>
  );
}

function AppearanceSection() {
  const [data, setData] = useState({ primaryColor: '#b45309', fontFamily: 'EB Garamond', logoText: 'BhartiyaBazar', tagline: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'appearance')).then(d => {
      if (d.exists()) setData(d.data() as typeof data);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, 'settings', 'appearance'), { ...data, updatedAt: serverTimestamp() });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="Appearance" sub="Visual customisation for the site" />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <Card>
          <FieldInput label="Logo Text" value={data.logoText} onChange={e => setData(d => ({ ...d, logoText: e.target.value }))} />
          <FieldInput label="Tagline" value={data.tagline} onChange={e => setData(d => ({ ...d, tagline: e.target.value }))} placeholder="India's Business Hub" />
          <FieldInput label="Font Family" value={data.fontFamily} onChange={e => setData(d => ({ ...d, fontFamily: e.target.value }))} placeholder="EB Garamond" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Colour</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="color" value={data.primaryColor} onChange={e => setData(d => ({ ...d, primaryColor: e.target.value }))} style={{ width: 44, height: 36, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{data.primaryColor}</span>
            </div>
          </div>
          <Btn onClick={save}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}</Btn>
        </Card>
      )}
    </div>
  );
}

function SettingsSection() {
  const [data, setData] = useState({ siteName: '', contactEmail: '', phone: '', address: '', maintenanceMode: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'general')).then(d => {
      if (d.exists()) setData(d.data() as typeof data);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, 'settings', 'general'), { ...data, updatedAt: serverTimestamp() });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="Site Settings" sub="General configuration for the platform" />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <Card>
          <FieldInput label="Site Name" value={data.siteName} onChange={e => setData(d => ({ ...d, siteName: e.target.value }))} placeholder="BhartiyaBazar" />
          <FieldInput label="Contact Email" value={data.contactEmail} onChange={e => setData(d => ({ ...d, contactEmail: e.target.value }))} type="email" placeholder="hello@bhartiyabazar.in" />
          <FieldInput label="Phone" value={data.phone} onChange={e => setData(d => ({ ...d, phone: e.target.value }))} placeholder="+91 …" />
          <FieldTextarea label="Address" value={data.address} onChange={e => setData(d => ({ ...d, address: e.target.value }))} style={{ minHeight: 80 }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: 20 }}>
            <input type="checkbox" checked={data.maintenanceMode} onChange={e => setData(d => ({ ...d, maintenanceMode: e.target.checked }))} />
            Enable Maintenance Mode
          </label>
          <Btn onClick={save}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}</Btn>
        </Card>
      )}
    </div>
  );
}