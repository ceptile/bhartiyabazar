'use client';
import { useState, useEffect, useRef } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  collection, doc, getDoc, setDoc, getDocs, addDoc,
  deleteDoc, updateDoc, serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';

const ADMIN_EMAIL = 'ceptile.com@gmail.com';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',    label: 'Overview',        icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'users',       label: 'Users',            icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { id: 'businesses',  label: 'Businesses',       icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
  { id: 'contacts',    label: 'Contacts',         icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.59 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z' },
  { id: 'announcements', label: 'Announcements', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
  { id: 'media',       label: 'Media & Slider',   icon: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7' },
  { id: 'pricing',     label: 'Pricing & Coupons',icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01' },
  { id: 'content',     label: 'Content',          icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
  { id: 'seo',         label: 'SEO & Meta',       icon: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' },
  { id: 'appearance',  label: 'Appearance',       icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
  { id: 'settings',    label: 'Site Settings',    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = '#f59e0b' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', flex: 1, minWidth: 180 }}>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>
      <input {...props} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', ...props.style }} />
    </div>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>
      <textarea {...props} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', minHeight: 100, resize: 'vertical', ...props.style }} />
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', style: s }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'danger' | 'ghost'; style?: React.CSSProperties }) {
  const bg = variant === 'primary' ? '#f59e0b' : variant === 'danger' ? '#ef4444' : 'transparent';
  const color = variant === 'ghost' ? 'var(--text-secondary)' : '#fff';
  const border = variant === 'ghost' ? '1px solid var(--border)' : 'none';
  return (
    <button onClick={onClick} style={{ padding: '9px 18px', borderRadius: 8, background: bg, color, border, fontSize: 14, fontWeight: 600, cursor: 'pointer', ...s }}>
      {children}
    </button>
  );
}

// ─── Main Studio App ──────────────────────────────────────────────────────────
export default function StudioApp() {
  const [authed, setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [active, setActive]   = useState('overview');
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

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0e0d' }}>
      <div style={{ color: '#f59e0b', fontSize: 18 }}>Loading Studio…</div>
    </div>
  );

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0e0d' }}>
      <form onSubmit={handleLogin} style={{ background: '#1c1b19', border: '1px solid #2a2927', borderRadius: 16, padding: 40, width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>🏪 Studio</div>
          <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>BhartiyaBazar Admin</div>
        </div>
        {loginErr && <div style={{ background: '#3f1515', color: '#f87171', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{loginErr}</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 6 }}>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 8, background: '#f59e0b', color: '#000', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
          Enter Studio
        </button>
      </form>
    </div>
  );

  const Section = () => {
    switch (active) {
      case 'overview':     return <OverviewSection />;
      case 'users':        return <UsersSection />;
      case 'businesses':   return <BusinessesSection />;
      case 'contacts':     return <ContactsSection />;
      case 'announcements':return <AnnouncementsSection />;
      case 'media':        return <MediaSection />;
      case 'pricing':      return <PricingSection />;
      case 'content':      return <ContentSection />;
      case 'seo':          return <SeoSection />;
      case 'appearance':   return <AppearanceSection />;
      case 'settings':     return <SettingsSection />;
      default:             return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body, sans-serif)' }}>
      {/* Sidebar */}
      <aside style={{ width: sideOpen ? 240 : 64, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'width 0.2s', flexShrink: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSideOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, padding: 0 }}>
            <Icon d="M4 6h16M4 12h16M4 18h16" />
          </button>
          {sideOpen && <span style={{ fontWeight: 800, fontSize: 16, color: '#f59e0b', whiteSpace: 'nowrap' }}>BB Studio</span>}
        </div>
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, textAlign: 'left',
              background: active === n.id ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: active === n.id ? '#f59e0b' : 'var(--text-secondary)',
              fontWeight: active === n.id ? 600 : 400, fontSize: 14, whiteSpace: 'nowrap',
            }}>
              <span style={{ flexShrink: 0 }}><Icon d={n.icon} size={16} /></span>
              {sideOpen && n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => signOut(auth)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent',
            color: '#ef4444', fontSize: 14, whiteSpace: 'nowrap',
          }}>
            <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={16} />
            {sideOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', maxHeight: '100vh' }}>
        <Section />
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
    const fetch = async () => {
      const [u, b, c, a] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'businesses')),
        getDocs(collection(db, 'contacts')),
        getDocs(collection(db, 'announcements')),
      ]);
      setStats({ users: u.size, businesses: b.size, contacts: c.size, announcements: a.size });
    };
    fetch();
  }, []);

  return (
    <div>
      <SectionHeader title="📊 Overview" sub="Real-time snapshot of your platform" />
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total Users" value={stats.users} sub="Registered accounts" color="#f59e0b" />
        <StatCard label="Businesses" value={stats.businesses} sub="Listed on platform" color="#10b981" />
        <StatCard label="Contact Messages" value={stats.contacts} sub="Received inquiries" color="#6366f1" />
        <StatCard label="Announcements" value={stats.announcements} sub="Active circulars" color="#f43f5e" />
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            ['📣 New Announcement', 'announcements'],
            ['🖼️ Upload Media', 'media'],
            ['💰 Add Coupon', 'pricing'],
            ['✍️ Edit Content', 'content'],
          ].map(([label]) => (
            <div key={label} style={{ padding: '10px 16px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 13, color: '#f59e0b', fontWeight: 500 }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState<{id:string;name:string;email:string;role:string;joinedAt:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getDocs(query(collection(db, 'users'), orderBy('joinedAt', 'desc'), limit(200)))
      .then(snap => { setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); });
  }, []);

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionHeader title="👥 Users" sub="All registered users on the platform" />
      <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', marginBottom: 20, width: 300 }} />
      {loading ? <p>Loading…</p> : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-offset)' }}>
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{u.name || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: u.role === 'business' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', color: u.role === 'business' ? '#10b981' : '#6366f1' }}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13 }}>{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>No users found.</p>}
        </div>
      )}
    </div>
  );
}

function BusinessesSection() {
  const [items, setItems] = useState<{id:string;businessName:string;email:string;businessCategory:string;city:string;verified:boolean}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'businesses'), limit(200)))
      .then(snap => { setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); });
  }, []);

  const toggleVerify = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'businesses', id), { verified: !current });
    setItems(prev => prev.map(i => i.id === id ? { ...i, verified: !current } : i));
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this business?')) return;
    await deleteDoc(doc(db, 'businesses', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      <SectionHeader title="🏪 Businesses" sub="Manage all listed businesses" />
      {loading ? <p>Loading…</p> : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-offset)' }}>
                {['Business', 'Category', 'City', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{b.businessName || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{b.businessCategory || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{b.city || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: b.verified ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: b.verified ? '#10b981' : '#f59e0b' }}>
                      {b.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                    <Btn variant="ghost" onClick={() => toggleVerify(b.id, b.verified)} style={{ fontSize: 12, padding: '5px 10px' }}>{b.verified ? 'Unverify' : 'Verify'}</Btn>
                    <Btn variant="danger" onClick={() => remove(b.id)} style={{ fontSize: 12, padding: '5px 10px' }}>Delete</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>No businesses found.</p>}
        </div>
      )}
    </div>
  );
}

function ContactsSection() {
  const [items, setItems] = useState<{id:string;name:string;email:string;message:string;createdAt:{seconds:number}}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(100)))
      .then(snap => { setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'contacts', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      <SectionHeader title="📬 Contact Messages" sub="All messages from the contact form" />
      {loading ? <p>Loading…</p> : items.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No messages yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(c => (
            <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleString() : ''}</span>
                  <Btn variant="danger" onClick={() => remove(c.id)} style={{ fontSize: 12, padding: '4px 10px' }}>Delete</Btn>
                </div>
              </div>
              <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementsSection() {
  const [items, setItems] = useState<{id:string;title:string;body:string;type:string;active:boolean}[]>([]);
  const [form, setForm] = useState({ title: '', body: '', type: 'info' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'announcements'))
      .then(snap => { setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); });
  }, []);

  const add = async () => {
    if (!form.title || !form.body) return alert('Fill title and body');
    const ref = await addDoc(collection(db, 'announcements'), { ...form, active: true, createdAt: serverTimestamp() });
    setItems(prev => [...prev, { id: ref.id, ...form, active: true }]);
    setForm({ title: '', body: '', type: 'info' });
  };

  const toggle = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'announcements', id), { active: !current });
    setItems(prev => prev.map(i => i.id === id ? { ...i, active: !current } : i));
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'announcements', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      <SectionHeader title="📣 Announcements" sub="Show circulars/popups to users when they open the site" />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>New Announcement</h3>
        <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. New Feature Launch!" />
        <Textarea label="Message" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write the announcement…" />
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14 }}>
            <option value="info">ℹ️ Info</option>
            <option value="success">✅ Success</option>
            <option value="warning">⚠️ Warning</option>
            <option value="promo">🎉 Promo</option>
          </select>
        </div>
        <Btn onClick={add}>Publish Announcement</Btn>
      </div>
      {loading ? <p>Loading…</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(a => (
            <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{a.body}</div>
                <span style={{ fontSize: 12, marginTop: 6, display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>{a.type}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Btn variant="ghost" onClick={() => toggle(a.id, a.active)} style={{ fontSize: 12, padding: '5px 10px', color: a.active ? '#10b981' : 'var(--text-muted)' }}>{a.active ? '● Active' : '○ Inactive'}</Btn>
                <Btn variant="danger" onClick={() => remove(a.id)} style={{ fontSize: 12, padding: '5px 10px' }}>Delete</Btn>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No announcements yet.</p>}
        </div>
      )}
    </div>
  );
}

function MediaSection() {
  const [items, setItems] = useState<{id:string;url:string;caption:string;type:string;order:number}[]>([]);
  const [form, setForm] = useState({ url: '', caption: '', type: 'image', order: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'media'), orderBy('order', 'asc')))
      .then(snap => { setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const add = async () => {
    if (!form.url) return alert('URL is required');
    const ref = await addDoc(collection(db, 'media'), { ...form, createdAt: serverTimestamp() });
    setItems(prev => [...prev, { id: ref.id, ...form }]);
    setForm({ url: '', caption: '', type: 'image', order: 0 });
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'media', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      <SectionHeader title="🖼️ Media & Slider" sub="Upload images and videos for homepage slider" />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>Add Media</h3>
        <Input label="URL (image or video link)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
        <Input label="Caption" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Optional caption" />
        <Input label="Order (display position)" type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14 }}>
            <option value="image">🖼️ Image</option>
            <option value="video">🎥 Video</option>
          </select>
        </div>
        <Btn onClick={add}>Add to Slider</Btn>
      </div>
      {loading ? <p>Loading…</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {items.map(m => (
            <div key={m.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {m.type === 'image' ? <img src={m.url} alt={m.caption} style={{ width: '100%', height: 140, objectFit: 'cover' }} /> : <video src={m.url} style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{m.caption || 'No caption'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>Order: {m.order}</div>
                <Btn variant="danger" onClick={() => remove(m.id)} style={{ marginTop: 10, fontSize: 12, padding: '4px 10px' }}>Remove</Btn>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No media added yet.</p>}
        </div>
      )}
    </div>
  );
}

function PricingSection() {
  const [plans, setPlans] = useState<{id:string;name:string;price:number;period:string;features:string;highlighted:boolean}[]>([]);
  const [coupons, setCoupons] = useState<{id:string;code:string;discount:number;type:string;expires:string;active:boolean}[]>([]);
  const [planForm, setPlanForm] = useState({ name: '', price: 0, period: 'month', features: '', highlighted: false });
  const [couponForm, setCouponForm] = useState({ code: '', discount: 10, type: 'percent', expires: '', active: true });
  const [tab, setTab] = useState<'plans'|'coupons'>('plans');

  useEffect(() => {
    getDocs(collection(db, 'plans')).then(s => setPlans(s.docs.map(d => ({ id: d.id, ...d.data() } as never))));
    getDocs(collection(db, 'coupons')).then(s => setCoupons(s.docs.map(d => ({ id: d.id, ...d.data() } as never))));
  }, []);

  const addPlan = async () => {
    if (!planForm.name) return;
    const ref = await addDoc(collection(db, 'plans'), planForm);
    setPlans(prev => [...prev, { id: ref.id, ...planForm }]);
    setPlanForm({ name: '', price: 0, period: 'month', features: '', highlighted: false });
  };

  const deletePlan = async (id: string) => {
    await deleteDoc(doc(db, 'plans', id));
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const addCoupon = async () => {
    if (!couponForm.code) return;
    const ref = await addDoc(collection(db, 'coupons'), couponForm);
    setCoupons(prev => [...prev, { id: ref.id, ...couponForm }]);
    setCouponForm({ code: '', discount: 10, type: 'percent', expires: '', active: true });
  };

  const deleteCoupon = async (id: string) => {
    await deleteDoc(doc(db, 'coupons', id));
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <SectionHeader title="💰 Pricing & Coupons" sub="Manage plans and discount coupons" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['plans', 'coupons'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: tab === t ? '#f59e0b' : 'transparent', color: tab === t ? '#000' : 'var(--text-secondary)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab === 'plans' && (
        <>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>New Plan</h3>
            <Input label="Plan Name" value={planForm.name} onChange={e => setPlanForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Pro" />
            <Input label="Price (₹)" type="number" value={planForm.price} onChange={e => setPlanForm(f => ({ ...f, price: +e.target.value }))} />
            <Textarea label="Features (one per line)" value={planForm.features} onChange={e => setPlanForm(f => ({ ...f, features: e.target.value }))} placeholder="Feature 1&#10;Feature 2" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', marginBottom: 16 }}>
              <input type="checkbox" checked={planForm.highlighted} onChange={e => setPlanForm(f => ({ ...f, highlighted: e.target.checked }))} /> Highlight this plan
            </label>
            <Btn onClick={addPlan}>Add Plan</Btn>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {plans.map(p => (
              <div key={p.id} style={{ background: 'var(--surface)', border: `2px solid ${p.highlighted ? '#f59e0b' : 'var(--border)'}`, borderRadius: 12, padding: 20, minWidth: 200 }}>
                {p.highlighted && <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 8, textTransform: 'uppercase' }}>★ Featured</div>}
                <div style={{ fontWeight: 700, fontSize: 18 }}>{p.name}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b', margin: '8px 0' }}>₹{p.price}<span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>/{p.period}</span></div>
                <Btn variant="danger" onClick={() => deletePlan(p.id)} style={{ fontSize: 12, padding: '4px 10px', marginTop: 12 }}>Delete</Btn>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'coupons' && (
        <>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>New Coupon</h3>
            <Input label="Coupon Code" value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" />
            <Input label="Discount Value" type="number" value={couponForm.discount} onChange={e => setCouponForm(f => ({ ...f, discount: +e.target.value }))} />
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Type</label>
              <select value={couponForm.type} onChange={e => setCouponForm(f => ({ ...f, type: e.target.value }))}
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14 }}>
                <option value="percent">% Percentage</option>
                <option value="flat">₹ Flat Amount</option>
              </select>
            </div>
            <Input label="Expiry Date" type="date" value={couponForm.expires} onChange={e => setCouponForm(f => ({ ...f, expires: e.target.value }))} />
            <Btn onClick={addCoupon}>Create Coupon</Btn>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-offset)' }}>
                  {['Code', 'Discount', 'Type', 'Expires', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#f59e0b' }}>{c.code}</td>
                    <td style={{ padding: '12px 16px' }}>{c.discount}{c.type === 'percent' ? '%' : '₹'} off</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{c.type}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{c.expires || '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Btn variant="danger" onClick={() => deleteCoupon(c.id)} style={{ fontSize: 12, padding: '4px 10px' }}>Delete</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {coupons.length === 0 && <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>No coupons yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}

function ContentSection() {
  const pages = ['about', 'terms', 'privacy', 'blog'];
  const [selected, setSelected] = useState('about');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'content', selected)).then(snap => setContent(snap.exists() ? snap.data().body || '' : ''));
  }, [selected]);

  const save = async () => {
    await setDoc(doc(db, 'content', selected), { body: content, updatedAt: serverTimestamp() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="✍️ Content Manager" sub="Edit About, Terms, Privacy, Blog and more" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {pages.map(p => (
          <button key={p} onClick={() => setSelected(p)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: selected === p ? '#f59e0b' : 'transparent', color: selected === p ? '#000' : 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>{p}</button>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <Textarea label={`Content for /${selected}`} value={content} onChange={e => setContent(e.target.value)} style={{ minHeight: 320, fontFamily: 'monospace', fontSize: 13 }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Btn onClick={save}>Save Content</Btn>
          {saved && <span style={{ color: '#10b981', fontSize: 14, fontWeight: 600 }}>✓ Saved!</span>}
        </div>
      </div>
    </div>
  );
}

function SeoSection() {
  const [data, setData] = useState({ title: '', description: '', keywords: '', ogImage: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'seo')).then(snap => { if (snap.exists()) setData(snap.data() as never); });
  }, []);

  const save = async () => {
    await setDoc(doc(db, 'settings', 'seo'), { ...data, updatedAt: serverTimestamp() });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="🔍 SEO & Meta" sub="Control site title, description, keywords and OG image" />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <Input label="Site Title" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} placeholder="BhartiyaBazar – Find Local Businesses" />
        <Textarea label="Meta Description" value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} placeholder="BhartiyaBazar helps you find local businesses..." style={{ minHeight: 80 }} />
        <Input label="Keywords (comma separated)" value={data.keywords} onChange={e => setData(d => ({ ...d, keywords: e.target.value }))} placeholder="local business, India, directory" />
        <Input label="OG Image URL" value={data.ogImage} onChange={e => setData(d => ({ ...d, ogImage: e.target.value }))} placeholder="https://..." />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Btn onClick={save}>Save SEO Settings</Btn>
          {saved && <span style={{ color: '#10b981', fontSize: 14 }}>✓ Saved!</span>}
        </div>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const [data, setData] = useState({ logoUrl: '', primaryColor: '#f59e0b', siteName: 'BhartiyaBazar', tagline: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'appearance')).then(snap => { if (snap.exists()) setData(snap.data() as never); });
  }, []);

  const save = async () => {
    await setDoc(doc(db, 'settings', 'appearance'), { ...data, updatedAt: serverTimestamp() });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="🎨 Appearance" sub="Logo, colors, site name and tagline" />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <Input label="Site Name" value={data.siteName} onChange={e => setData(d => ({ ...d, siteName: e.target.value }))} />
        <Input label="Tagline" value={data.tagline} onChange={e => setData(d => ({ ...d, tagline: e.target.value }))} placeholder="Find the best local businesses" />
        <Input label="Logo URL" value={data.logoUrl} onChange={e => setData(d => ({ ...d, logoUrl: e.target.value }))} placeholder="https://..." />
        {data.logoUrl && <img src={data.logoUrl} alt="Logo preview" style={{ height: 48, marginBottom: 16, borderRadius: 8, border: '1px solid var(--border)' }} />}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Primary Accent Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="color" value={data.primaryColor} onChange={e => setData(d => ({ ...d, primaryColor: e.target.value }))} style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }} />
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{data.primaryColor}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Btn onClick={save}>Save Appearance</Btn>
          {saved && <span style={{ color: '#10b981', fontSize: 14 }}>✓ Saved!</span>}
        </div>
      </div>
    </div>
  );
}

function SettingsSection() {
  const [data, setData] = useState({ maintenanceMode: false, allowRegistrations: true, contactEmail: '', phone: '', address: '', socialFacebook: '', socialInstagram: '', socialTwitter: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'general')).then(snap => { if (snap.exists()) setData(snap.data() as never); });
  }, []);

  const save = async () => {
    await setDoc(doc(db, 'settings', 'general'), { ...data, updatedAt: serverTimestamp() });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="⚙️ Site Settings" sub="Global configuration, contact info, social links" />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {[
            { key: 'maintenanceMode', label: '🔧 Maintenance Mode', desc: 'Show maintenance page to all visitors' },
            { key: 'allowRegistrations', label: '📝 Allow Registrations', desc: 'Let new users register' },
          ].map(({ key, label, desc }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
              </div>
              <input type="checkbox" checked={data[key as keyof typeof data] as boolean} onChange={e => setData(d => ({ ...d, [key]: e.target.checked }))} style={{ width: 18, height: 18 }} />
            </label>
          ))}
        </div>
        <Input label="Contact Email" type="email" value={data.contactEmail} onChange={e => setData(d => ({ ...d, contactEmail: e.target.value }))} />
        <Input label="Phone" value={data.phone} onChange={e => setData(d => ({ ...d, phone: e.target.value }))} />
        <Input label="Address" value={data.address} onChange={e => setData(d => ({ ...d, address: e.target.value }))} />
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 12px', color: 'var(--text-secondary)' }}>Social Links</h3>
        <Input label="Facebook URL" value={data.socialFacebook} onChange={e => setData(d => ({ ...d, socialFacebook: e.target.value }))} />
        <Input label="Instagram URL" value={data.socialInstagram} onChange={e => setData(d => ({ ...d, socialInstagram: e.target.value }))} />
        <Input label="Twitter/X URL" value={data.socialTwitter} onChange={e => setData(d => ({ ...d, socialTwitter: e.target.value }))} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Btn onClick={save}>Save Settings</Btn>
          {saved && <span style={{ color: '#10b981', fontSize: 14 }}>✓ Saved!</span>}
        </div>
      </div>
    </div>
  );
}