'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Bhiwadi','Gurgaon','Noida','Faridabad','Chandigarh','Indore','Bhopal','Nagpur','Patna','Vadodara','Coimbatore','Kochi','Agra','Varanasi'];
const TABS = [
  { id: 'profile',   icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Profile' },
  { id: 'account',   icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',                                    label: 'Account & Security' },
  { id: 'notif',     icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',        label: 'Notifications' },
  { id: 'privacy',   icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', label: 'Privacy' },
  { id: 'appearance',icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', label: 'Appearance' },
  { id: 'danger',    icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01', label: 'Danger Zone' },
];

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {d.split(' M').map((seg, i) => (
        <path key={i} d={(i === 0 ? seg : 'M' + seg)} />
      ))}
    </svg>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      padding: '12px 20px', borderRadius: 12,
      background: type === 'success' ? '#166534' : '#991b1b',
      color: '#fff', fontSize: 13, fontWeight: 600,
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideUp 0.3s ease',
    }}>
      <Icon d={type === 'success' ? 'M20 6L9 17l-5-5' : 'M18 6L6 18 M6 6l12 12'} size={14} />
      {msg}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 4, fontSize: 14 }}>✕</button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('profile');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 64 }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .settings-tab { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; color:var(--text-secondary); border:none; background:transparent; width:100%; text-align:left; transition:all 0.15s; }
        .settings-tab:hover { background:var(--surface-2); color:var(--text-primary); }
        .settings-tab.active { background:var(--amber-bg,rgba(212,160,23,0.1)); color:var(--amber); font-weight:600; }
        .field-inp { width:100%; padding:10px 14px; border-radius:8px; border:1px solid var(--border-hover); background:var(--bg); color:var(--text-primary); font-size:14px; outline:none; transition:border-color 0.15s; box-sizing:border-box; }
        .field-inp:focus { border-color:var(--amber); }
        .field-inp:disabled { opacity:0.5; cursor:not-allowed; }
        .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid var(--border); }
        .toggle-row:last-child { border-bottom:none; }
        .toggle { width:44px; height:24px; border-radius:12px; border:none; cursor:pointer; position:relative; transition:background 0.2s; flex-shrink:0; }
        .toggle::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform 0.2s; }
        .toggle.on { background:var(--amber); }
        .toggle.on::after { transform:translateX(20px); }
        .toggle.off { background:var(--border-hover); }
        .danger-btn { padding:10px 20px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:1px solid; transition:all 0.15s; }
        .avatar-wrap { position:relative; display:inline-block; }
        .avatar-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; cursor:pointer; }
        .avatar-wrap:hover .avatar-overlay { opacity:1; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', color: 'var(--text-primary)', marginBottom: 4 }}>Settings</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Manage your account, privacy, and preferences</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 12px', position: 'sticky', top: 80 }}>
            {/* Mini profile */}
            <div style={{ textAlign: 'center', padding: '12px 0 16px', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, margin: '0 auto 10px' }}>
                {user.photoURL ? <img src={user.photoURL} alt={user.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} /> : initials}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</div>
            </div>
            {TABS.map(t => (
              <button key={t.id} className={`settings-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                <Icon d={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 32 }}>
            {tab === 'profile'    && <ProfileTab user={user} updateProfile={updateProfile} showToast={showToast} />}
            {tab === 'account'   && <AccountTab user={user} showToast={showToast} />}
            {tab === 'notif'     && <NotifTab user={user} updateProfile={updateProfile} showToast={showToast} />}
            {tab === 'privacy'   && <PrivacyTab user={user} updateProfile={updateProfile} showToast={showToast} />}
            {tab === 'appearance'&& <AppearanceTab user={user} updateProfile={updateProfile} showToast={showToast} />}
            {tab === 'danger'    && <DangerTab user={user} logout={logout} showToast={showToast} />}
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab({ user, updateProfile, showToast }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    city: user.city || '',
    state: user.state || '',
    area: user.area || '',
    address: user.address || '',
    pincode: user.pincode || '',
    bio: user.bio || '',
    website: user.website || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    twitter: user.twitter || '',
    skills: user.skills || '',
    experience: user.experience || '',
    education: user.education || '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5 MB', 'error'); return; }
    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.id}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile({ photoURL: url } as any);
      showToast('Profile photo updated!');
    } catch {
      showToast('Upload failed. Check Firebase Storage rules.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast('Name cannot be empty', 'error'); return; }
    setSaving(true);
    await updateProfile(form as any);
    setSaving(false);
    showToast('Profile saved successfully!');
  };

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Profile Information</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Customize your public profile. This information may be visible to other users.</p>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
        <div className="avatar-wrap">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, overflow: 'hidden' }}>
            {(user as any).photoURL ? <img src={(user as any).photoURL} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div className="avatar-overlay" onClick={() => fileRef.current?.click()}>
            {uploading ? <div className="spinner" style={{ width: 20, height: 20, borderColor: '#fff #fff #fff transparent' }} /> : <Icon d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={20} />}
          </div>
        </div>
        <div>
          <button onClick={() => fileRef.current?.click()} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border-hover)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {uploading ? 'Uploading…' : 'Change Photo'}
          </button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>JPG, PNG or WebP. Max 5 MB.</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
      </div>

      {/* Basic info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name *</label><input className="field-inp" value={form.name} onChange={set('name')} /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label><input className="field-inp" value={user.email} disabled /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Phone</label><input className="field-inp" value={form.phone} onChange={set('phone')} placeholder="+91 98100 00000" /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>City</label>
          <select className="field-inp" value={form.city} onChange={set('city')} style={{ cursor: 'pointer' }}>
            <option value="">Select city…</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>State</label><input className="field-inp" value={form.state} onChange={set('state')} placeholder="Haryana" /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Pincode</label><input className="field-inp" value={form.pincode} onChange={set('pincode')} placeholder="121001" /></div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Area / Locality</label>
        <input className="field-inp" value={form.area} onChange={set('area')} placeholder="Sector 14, Bhiwadi…" />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Bio / About</label>
        <textarea className="field-inp" rows={3} value={form.bio} onChange={set('bio')} placeholder="Tell people about yourself…" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
      </div>

      {/* Skills / Experience */}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>Professional Info (LinkedIn-style)</h3>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Skills (comma-separated)</label>
        <input className="field-inp" value={form.skills} onChange={set('skills')} placeholder="React, Firebase, Next.js, Marketing…" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Current / Latest Experience</label>
        <input className="field-inp" value={form.experience} onChange={set('experience')} placeholder="Software Engineer at TechCorp (2021 – Present)" />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Education</label>
        <input className="field-inp" value={form.education} onChange={set('education')} placeholder="B.Tech, IIT Delhi (2017–2021)" />
      </div>

      {/* Social Links */}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>Social Links</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Website</label><input className="field-inp" value={form.website} onChange={set('website')} placeholder="https://yoursite.com" /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>LinkedIn</label><input className="field-inp" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/you" /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>GitHub</label><input className="field-inp" value={form.github} onChange={set('github')} placeholder="https://github.com/you" /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Twitter / X</label><input className="field-inp" value={form.twitter} onChange={set('twitter')} placeholder="https://x.com/you" /></div>
      </div>

      <button onClick={handleSave} disabled={saving} style={{ padding: '11px 28px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
        {saving && <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: '#fff #fff #fff transparent' }} />}
        {saving ? 'Saving…' : 'Save Profile'}
      </button>
    </div>
  );
}

// ─── Account & Security Tab ──────────────────────────────────────────────────
function AccountTab({ user, showToast }: any) {
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [conPwd, setConPwd] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePwdChange = async () => {
    if (!curPwd || !newPwd) { showToast('Please fill all fields', 'error'); return; }
    if (newPwd !== conPwd) { showToast('Passwords do not match', 'error'); return; }
    if (newPwd.length < 6) { showToast('New password must be at least 6 characters', 'error'); return; }
    setSaving(true);
    try {
      const fbUser = auth.currentUser!;
      const cred = EmailAuthProvider.credential(fbUser.email!, curPwd);
      await reauthenticateWithCredential(fbUser, cred);
      await updatePassword(fbUser, newPwd);
      setCurPwd(''); setNewPwd(''); setConPwd('');
      showToast('Password changed successfully!');
    } catch (e: any) {
      const msg = e.code === 'auth/wrong-password' ? 'Current password is incorrect.' :
                  e.code === 'auth/too-many-requests' ? 'Too many attempts. Please wait.' :
                  'Failed to change password.';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Account & Security</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Manage your password and account security settings.</p>

      {/* Account info */}
      <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 20, marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Email', val: user.email },
            { label: 'Account Type', val: user.role === 'business' ? 'Business' : 'Personal' },
            { label: 'Member Since', val: new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Verified', val: user.verified ? '✓ Yes' : 'No' },
          ].map(row => (
            <div key={row.label}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{row.label}</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{row.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Change Password</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440, marginBottom: 28 }}>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Current Password</label>
          <input type="password" className="field-inp" value={curPwd} onChange={e => setCurPwd(e.target.value)} /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>New Password</label>
          <input type="password" className="field-inp" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Confirm New Password</label>
          <input type="password" className="field-inp" value={conPwd} onChange={e => setConPwd(e.target.value)} /></div>
        <button onClick={handlePwdChange} disabled={saving} style={{ padding: '10px 24px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </div>

      {/* Active sessions placeholder */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Active Sessions</h3>
      <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        You are currently signed in on this device. Log out from all devices if you suspect unauthorised access.
      </div>
    </div>
  );
}

// ─── Notifications Tab ───────────────────────────────────────────────────────
function NotifTab({ user, updateProfile, showToast }: any) {
  const defaults = {
    notif_reviews: true,
    notif_messages: true,
    notif_jobs: true,
    notif_promotions: false,
    notif_newsletter: false,
    notif_digest: true,
  };
  const [prefs, setPrefs] = useState({ ...defaults, ...(user.notifications || {}) });

  const toggle = (k: string) => setPrefs(p => ({ ...p, [k]: !p[k as keyof typeof p] }));

  const save = async () => {
    await updateProfile({ notifications: prefs } as any);
    showToast('Notification preferences saved!');
  };

  const rows = [
    { k: 'notif_reviews',    label: 'New reviews on your business',    sub: 'Get notified when someone leaves a review' },
    { k: 'notif_messages',   label: 'Direct messages',                 sub: 'Alerts when you receive a new message' },
    { k: 'notif_jobs',       label: 'Job alerts',                      sub: 'New jobs matching your skills or location' },
    { k: 'notif_promotions', label: 'Promotional offers',              sub: 'Platform offers and discount announcements' },
    { k: 'notif_newsletter', label: 'Weekly newsletter',               sub: 'BhartiyaBazar updates and local business news' },
    { k: 'notif_digest',     label: 'Activity digest',                 sub: 'Daily summary of activity on your listings' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Notifications</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Choose which notifications you want to receive.</p>
      <div style={{ marginBottom: 24 }}>
        {rows.map(row => (
          <div key={row.k} className="toggle-row">
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{row.sub}</div>
            </div>
            <button className={`toggle ${prefs[row.k as keyof typeof prefs] ? 'on' : 'off'}`} onClick={() => toggle(row.k)} aria-label={row.label} />
          </div>
        ))}
      </div>
      <button onClick={save} style={{ padding: '10px 24px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>Save Preferences</button>
    </div>
  );
}

// ─── Privacy Tab ─────────────────────────────────────────────────────────────
function PrivacyTab({ user, updateProfile, showToast }: any) {
  const defaults = {
    privacy_profile_public: true,
    privacy_show_email: false,
    privacy_show_phone: false,
    privacy_show_location: true,
    privacy_indexed: true,
  };
  const [prefs, setPrefs] = useState({ ...defaults, ...(user.privacy || {}) });
  const toggle = (k: string) => setPrefs(p => ({ ...p, [k]: !p[k as keyof typeof p] }));
  const save = async () => {
    await updateProfile({ privacy: prefs } as any);
    showToast('Privacy settings saved!');
  };
  const rows = [
    { k: 'privacy_profile_public', label: 'Public profile',             sub: 'Anyone can view your profile page' },
    { k: 'privacy_show_email',     label: 'Show email on profile',       sub: 'Your email is visible to other users' },
    { k: 'privacy_show_phone',     label: 'Show phone on profile',       sub: 'Your phone number is visible to other users' },
    { k: 'privacy_show_location',  label: 'Show city / location',        sub: 'Your city is visible on your profile' },
    { k: 'privacy_indexed',        label: 'Allow search engine indexing', sub: 'Your profile may appear in Google search results' },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Privacy</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Control who can see your information and how your data is used.</p>
      <div style={{ marginBottom: 24 }}>
        {rows.map(row => (
          <div key={row.k} className="toggle-row">
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{row.sub}</div>
            </div>
            <button className={`toggle ${prefs[row.k as keyof typeof prefs] ? 'on' : 'off'}`} onClick={() => toggle(row.k)} aria-label={row.label} />
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16, marginBottom: 24, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text-primary)' }}>Data usage:</strong> We never sell your personal data. Your information is used only to operate BhartiyaBazar services. For details, read our <a href="/privacy" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Privacy Policy</a>.
      </div>
      <button onClick={save} style={{ padding: '10px 24px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>Save Privacy Settings</button>
    </div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────
function AppearanceTab({ user, updateProfile, showToast }: any) {
  const [theme, setTheme] = useState((user as any).theme || 'system');
  const [accent, setAccent] = useState((user as any).accent || 'amber');
  const accents = [
    { id: 'amber',  color: '#d4a017', label: 'Amber (Default)' },
    { id: 'blue',   color: '#2563eb', label: 'Blue' },
    { id: 'green',  color: '#16a34a', label: 'Green' },
    { id: 'purple', color: '#7c3aed', label: 'Purple' },
    { id: 'red',    color: '#dc2626', label: 'Red' },
  ];
  const save = async () => {
    await updateProfile({ theme, accent } as any);
    showToast('Appearance saved!');
  };
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Appearance</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Customise the look and feel of your BhartiyaBazar experience.</p>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Theme</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {['light', 'dark', 'system'].map(t => (
          <button key={t} onClick={() => setTheme(t)} style={{ padding: '10px 20px', borderRadius: 8, border: `2px solid ${theme === t ? 'var(--amber)' : 'var(--border-hover)'}`, background: theme === t ? 'var(--amber-bg,rgba(212,160,23,0.08))' : 'var(--surface-2)', color: theme === t ? 'var(--amber)' : 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
            {t === 'light' ? '☀️ Light' : t === 'dark' ? '🌙 Dark' : '🖥 System'}
          </button>
        ))}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Accent Color</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
        {accents.map(a => (
          <button key={a.id} onClick={() => setAccent(a.id)} title={a.label} style={{ width: 40, height: 40, borderRadius: '50%', background: a.color, border: `3px solid ${accent === a.id ? 'var(--text-primary)' : 'transparent'}`, cursor: 'pointer', outline: accent === a.id ? `2px solid ${a.color}` : 'none', outlineOffset: 2 }} />
        ))}
      </div>
      <button onClick={save} style={{ padding: '10px 24px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>Save Appearance</button>
    </div>
  );
}

// ─── Danger Zone Tab ─────────────────────────────────────────────────────────
function DangerTab({ user, logout, showToast }: any) {
  const router = useRouter();
  const [delConfirm, setDelConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (delConfirm !== 'DELETE') { showToast('Type DELETE to confirm', 'error'); return; }
    setDeleting(true);
    try {
      const fbUser = auth.currentUser!;
      await deleteDoc(doc(db, 'users', fbUser.uid));
      await deleteUser(fbUser);
      await logout();
      router.push('/');
    } catch (e: any) {
      if (e.code === 'auth/requires-recent-login') {
        showToast('Please log out and log in again before deleting your account.', 'error');
      } else {
        showToast('Failed to delete account. Please contact support.', 'error');
      }
      setDeleting(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Danger Zone</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>These actions are irreversible. Please proceed with caution.</p>

      {/* Log out */}
      <div style={{ border: '1px solid var(--border-hover)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Sign out</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Sign out of your account on this device.</div>
        <button onClick={logout} className="danger-btn" style={{ borderColor: 'var(--border-hover)', background: 'transparent', color: 'var(--text-secondary)' }}>Sign Out</button>
      </div>

      {/* Delete account */}
      <div style={{ border: '1px solid rgba(185,28,28,0.3)', borderRadius: 10, padding: 20, background: 'rgba(185,28,28,0.03)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#b91c1c', marginBottom: 6 }}>Delete Account</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Permanently delete your account and all associated data. This cannot be undone.</div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Type <strong>DELETE</strong> to confirm</label>
          <input className="field-inp" value={delConfirm} onChange={e => setDelConfirm(e.target.value)} placeholder="DELETE" style={{ maxWidth: 260 }} />
        </div>
        <button onClick={handleDelete} disabled={deleting || delConfirm !== 'DELETE'} className="danger-btn" style={{ borderColor: '#b91c1c', background: delConfirm === 'DELETE' ? '#b91c1c' : 'transparent', color: delConfirm === 'DELETE' ? '#fff' : '#b91c1c', opacity: deleting ? 0.7 : 1 }}>
          {deleting ? 'Deleting…' : 'Delete My Account'}
        </button>
      </div>
    </div>
  );
}
