'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'vacancy' | 'wanted'>('all');

  useEffect(() => {
    (async () => {
      try {
        const q = filter === 'all' 
          ? collection(db, 'jobs')
          : query(collection(db, 'jobs'), where('type', '==', filter));
        
        const snap = await getDocs(q);
        setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error('Error fetching jobs:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 80, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Job Hub</h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Find opportunities or the right talent in your local area.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setFilter('all')} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', background: filter === 'all' ? 'var(--amber)' : 'var(--surface)', color: filter === 'all' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>All</button>
            <button onClick={() => setFilter('vacancy')} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', background: filter === 'vacancy' ? 'var(--amber)' : 'var(--surface)', color: filter === 'vacancy' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Vacancies</button>
            <button onClick={() => setFilter('wanted')} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', background: filter === 'wanted' ? 'var(--amber)' : 'var(--surface)', color: filter === 'wanted' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Jobs Wanted</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}><div className="spinner" /></div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
            <h2 style={{ fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>No jobs found</h2>
            <p style={{ color: 'var(--text-muted)' }}>Try changing your filter or check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: 20 }}>
            {jobs.map(job => (
              <div key={job.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 24, boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 'var(--r-full)', background: job.type === 'vacancy' ? 'var(--success-bg)' : 'var(--amber-subtle)', color: job.type === 'vacancy' ? 'var(--success)' : 'var(--amber)' }}>
                    {job.type === 'vacancy' ? 'Hiring' : 'Looking for Work'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{new Date(job.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{job.title}</h3>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" /> {job.company || job.userName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> {job.location}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>₹{job.salary || 'Negotiable'}</div>
                  <button style={{ padding: '8px 20px', borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 48, padding: 32, background: 'var(--surface-2)', borderRadius: 'var(--r-xl)', border: '1.5px dashed var(--border-strong)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Post a Job or Wanted Listing?</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Connect with the BhartiyaBazar community and find the perfect match.</p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: 'var(--r-md)', background: 'var(--text-primary)', color: 'var(--bg)', fontWeight: 700, textDecoration: 'none' }}>Go to Dashboard →</Link>
        </div>
      </div>
    </div>
  );
}
