'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {d.split(' M').map((seg, i) => (
        <path key={i} d={(i === 0 ? seg : 'M' + seg)} />
      ))}
    </svg>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', city: '', businessName: '', bio: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) setForm({
      name: user.name || '',
      phone: user.phone || '',
      city: user.city || '',
      businessName: user.businessName || '',
      bio: (user as any).bio || '',
    });
  }, [user, loading, router]);

  if (loading || !user) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: 'border-color var(--t)', boxSizing: 'border-box' };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await updateProfile({ name: form.name, phone: form.phone, city: form.city, bio: form.bio, businessName: form.businessName || user.businessName } as any);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const photoURL  = (user as any).photoURL as string | undefined;
  const skills    = ((user as any).skills as string || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const coverImage = (user as any).coverImage as string | undefined;
  const introVideo = (user as any).introVideo as string | undefined;
  const gallery = Array.isArray((user as any).gallery) ? (user as any).gallery : [];
  const mapLink = (user as any).mapLink as string | undefined;
  const socialLinks = [
    { href: (user as any).website,  icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z', label: 'Website' },
    { href: (user as any).linkedin, icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', label: 'LinkedIn' },
    { href: (user as any).github,   icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22', label: 'GitHub' },
    { href: (user as any).twitter,  icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z', label: 'Twitter' },
  ].filter(l => l.href);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>
      <style>{`
        .profile-tab { padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; background: transparent; color: var(--text-muted); border-bottom: 2px solid transparent; transition: all 0.15s; }
        .profile-tab.active { color: var(--amber); border-bottom-color: var(--amber); }
        .profile-tab:hover { color: var(--text-primary); }
        .skill-badge { display:inline-block; padding:4px 10px; border-radius:20px; background:var(--surface-2); border:1px solid var(--border); font-size:12px; color:var(--text-secondary); font-weight:500; margin:3px; }
      `}</style>

      {/* Cover + Avatar header */}
      <div style={{ background: coverImage ? `url(${coverImage}) center/cover no-repeat` : 'linear-gradient(135deg, var(--amber) 0%, #b8860b 100%)', height: 180, position: 'relative' }}>
        <div className="container" style={{ position: 'relative', height: '100%' }}>
          <Link href="/settings" style={{ position: 'absolute', top: 16, right: 0, padding: '7px 14px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={13} /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="container">
        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: -40, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, border: '4px solid var(--bg)', flexShrink: 0, overflow: 'hidden' }}>
            {photoURL ? <img src={photoURL} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div style={{ paddingBottom: 8 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{user.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{user.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', paddingBottom: 8, display: 'flex', gap: 10 }}>
            {socialLinks.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" title={l.label} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                <Icon d={l.icon} size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Bio */}
        {(user as any).bio && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 600, lineHeight: 1.6 }}>{(user as any).bio}</p>
        )}

        {/* Info pills */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          {user.city && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={13} />{user.city}</span>}
          {mapLink && <a href={mapLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--amber)', textDecoration: 'none' }}><Icon d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V4.618a1 1 0 0 1 1.447-.894L9 6m0 14 6-3m-6 3V6m6 11 4.553 2.276A1 1 0 0 0 21 18.382V6.618a1 1 0 0 0-.553-.894L15 3m0 14V3m0 0L9 6" size={13} />View on map</a>}
          {(user as any).experience && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" size={13} />{(user as any).experience}</span>}
          {(user as any).education && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" size={13} />{(user as any).education}</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon d="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={13} />Joined {new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills</h3>
            <div>{skills.map((s: string) => <span key={s} className="skill-badge">{s}</span>)}</div>
          </div>
        )}

        {(introVideo || gallery.length > 0) && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Media Showcase</h3>
            {introVideo && <a href={introVideo} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', marginBottom: 12, color: 'var(--amber)', textDecoration: 'none', fontSize: 13 }}>▶ Watch intro video</a>}
            {gallery.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>{gallery.map((img: string) => <img key={img} src={img} alt="Gallery" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />)}</div>}
          </div>
        )}

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 24, display: 'flex', gap: 0 }}>
          {['overview','edit'].map(t => (
            <button key={t} className={`profile-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
              {t === 'overview' ? 'Overview' : 'Edit Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' ? (
          <div style={{ paddingBottom: 60 }}>
            <div className="card-flat" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Account Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Role', val: user.role === 'business' ? 'Business Account' : 'User Account' },
                  { label: 'Phone', val: user.phone || 'Not set' },
                  { label: 'City', val: user.city || 'Not set' },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{row.label}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{row.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/settings" style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>⚙ Settings</Link>
              <Link href="/dashboard" style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border-hover)', color: 'var(--text-primary)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Dashboard</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ paddingBottom: 60, maxWidth: 600 }}>
            {saved && (
              <div style={{ marginBottom: 20, padding: '10px 14px', borderRadius: 8, background: 'rgba(22,101,52,0.08)', border: '1px solid rgba(22,101,52,0.2)', color: '#166534', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon d="M20 6L9 17l-5-5" size={14} /> Profile updated successfully
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label><input style={inp} value={form.name} onChange={set('name')} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Phone</label><input style={inp} value={form.phone} onChange={set('phone')} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>City</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.city} onChange={set('city')}>
                  <option value="">Select city…</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {user.role === 'business' && <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Business Name</label><input style={inp} value={form.businessName} onChange={set('businessName')} /></div>}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Bio</label>
              <textarea style={{ ...inp, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }} value={form.bio} onChange={set('bio')} placeholder="Tell people about yourself…" />
            </div>
            <button type="submit" disabled={saving} style={{ padding: '11px 28px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving && <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: '#fff #fff #fff transparent' }} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
