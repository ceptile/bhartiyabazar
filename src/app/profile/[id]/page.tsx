'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', id));
        if (snap.exists()) setProfile(snap.data());
      } catch (e) {
        console.error('Error loading profile:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  if (!profile || profile.privacy?.privacy_profile_public === false) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--bg)' }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 24, color: 'var(--text-primary)' }}>Profile is Private</h2>
      <Link href="/" style={{ padding: '8px 20px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontSize: 14, fontWeight: 600 }}>Back to Home</Link>
    </div>
  );

  const initials = profile.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 80, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        
        {/* Header Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '40px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(90deg, var(--amber), var(--amber-dark))', opacity: 0.1 }} />
          
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative', flexWrap: 'wrap' }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, border: '4px solid var(--surface)', boxShadow: 'var(--shadow-lg)', flexShrink: 0, overflow: 'hidden' }}>
              {profile.photoURL ? <img src={profile.photoURL} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            
            <div style={{ flex: 1, minWidth: 300 }}>
              <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{profile.name}</h1>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>{profile.bio || 'No bio provided yet.'}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14, color: 'var(--text-muted)' }}>
                {profile.city && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" size={14} /> {profile.city}, {profile.state}</span>}
                {profile.role === 'business' && <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--amber)', fontWeight: 600 }}><Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" size={14} /> Business Owner</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={14} /> Joined {new Date(profile.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>

              {/* Social links */}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {profile.website && <a href={profile.website} target="_blank" rel="noopener" style={{ color: 'var(--text-muted)' }}><Icon d="M12 2a10 10 0 100 20 10 10 0 000-20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></a>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener" style={{ color: 'var(--text-muted)' }}><Icon d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 2a2 2 0 110 4 2 2 0 010-4z" /></a>}
                {profile.github && <a href={profile.github} target="_blank" rel="noopener" style={{ color: 'var(--text-muted)' }}><Icon d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></a>}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Professional Section */}
            {(profile.skills || profile.experience || profile.education) && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px' }}>
                <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 20, color: 'var(--text-primary)', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>Professional Summary</h2>
                
                {profile.experience && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Experience</div>
                    <div style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>{profile.experience}</div>
                  </div>
                )}
                
                {profile.education && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Education</div>
                    <div style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>{profile.education}</div>
                  </div>
                )}
                
                {profile.skills && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {profile.skills.split(',').map((s: string) => (
                        <span key={s} style={{ padding: '4px 12px', borderRadius: 'var(--r-full)', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contribution placeholder */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px' }}>
              <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 20, color: 'var(--text-primary)', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>Activity</h2>
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
                <p style={{ fontSize: 14 }}>User activity and contributions will appear here.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Sidebar contact info */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px' }}>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: 18, color: 'var(--text-primary)', marginBottom: 16 }}>Contact Info</h3>
              
              {profile.privacy?.privacy_show_email && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                  <a href={`mailto:${profile.email}`} style={{ fontSize: 14, color: 'var(--amber)', textDecoration: 'none', fontWeight: 500 }}>{profile.email}</a>
                </div>
              )}
              
              {profile.privacy?.privacy_show_phone && profile.phone && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Phone</div>
                  <a href={`tel:${profile.phone}`} style={{ fontSize: 14, color: 'var(--amber)', textDecoration: 'none', fontWeight: 500 }}>{profile.phone}</a>
                </div>
              )}

              {!(profile.privacy?.privacy_show_email || profile.privacy?.privacy_show_phone) && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Contact information is private.</p>
              )}
            </div>

            {/* Trust badge */}
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--r-lg)', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>Verified User</div>
              <p style={{ fontSize: 12, color: 'var(--success)', opacity: 0.8 }}>This user has verified their identity with BhartiyaBazar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
