'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad'];

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', city: '', businessName: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) setForm({ name: user.name || '', phone: user.phone || '', city: user.city || '', businessName: user.businessName || '' });
  }, [user, loading, router]);

  if (loading || !user) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: 'border-color var(--t)' };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateProfile({ name: form.name, phone: form.phone, city: form.city, businessName: form.businessName || user.businessName });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--text-primary)', marginBottom: 4 }}>My Profile</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,280px) 1fr', gap: 24, alignItems: 'start' }}>

          {/* Sidebar card */}
          <div className="card-flat" style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, margin: '0 auto 14px', fontFamily: 'var(--font-display)' }}>
              {initials}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{user.email}</div>
            <span className={`badge ${user.role === 'business' ? 'badge-amber' : 'badge-info'}`}>
              {user.role === 'business' ? 'Business Account' : 'User Account'}
            </span>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Member since', val: new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
                { label: 'City', val: user.city || 'Not set' },
                { label: 'Phone', val: user.phone || 'Not set' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card-flat">
            {saved && (
              <div style={{ marginBottom: 20, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--success-bg)', border: '1px solid rgba(45,122,58,0.2)', color: 'var(--success)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" size={15} /> Profile updated successfully
              </div>
            )}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--text-primary)', marginBottom: 4 }}>Personal Information</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input style={inp} value={form.name} onChange={set('name')} placeholder="Your name"
                    onFocus={e => (e.target.style.borderColor = 'var(--info)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input style={{ ...inp, opacity: 0.55, cursor: 'not-allowed' }} value={user.email} disabled />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Phone Number</label>
                  <input style={inp} value={form.phone} onChange={set('phone')} placeholder="+91 98100 00000"
                    onFocus={e => (e.target.style.borderColor = 'var(--info)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>City</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={form.city} onChange={set('city')}>
                    <option value="">Select city...</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {user.role === 'business' && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--text-primary)' }}>Business Information</h2>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Business Name</label>
                    <input style={inp} value={form.businessName} onChange={set('businessName')} placeholder="Your business name"
                      onFocus={e => (e.target.style.borderColor = 'var(--info)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
                  </div>
                </>
              )}

              <button type="submit" disabled={saving} className={`btn btn-primary${saving ? ' btn-sm' : ''}`} style={{ alignSelf: 'flex-start', minWidth: 140 }}>
                {saving ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}