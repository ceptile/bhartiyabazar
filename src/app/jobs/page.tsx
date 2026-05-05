'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createJob, getAllJobs, getUserJobs, type Job, type JobKind, type JobType } from '@/lib/jobs';

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Bhiwadi', 'Gurgaon', 'Noida', 'Faridabad'];
const TYPES: JobType[] = ['full-time', 'part-time', 'freelance', 'internship', 'contract'];

type JobForm = {
  kind: JobKind;
  title: string;
  description: string;
  skills: string;
  city: string;
  area: string;
  salary: string;
  jobType: JobType;
  category: string;
  experience: string;
  education: string;
  openings: string;
  deadline: string;
};

const BLANK_FORM: JobForm = {
  kind: 'vacancy',
  title: '',
  description: '',
  skills: '',
  city: '',
  area: '',
  salary: '',
  jobType: 'full-time',
  category: '',
  experience: '',
  education: '',
  openings: '1',
  deadline: '',
};

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'discover' | 'post' | 'mine'>('discover');
  const [filter, setFilter] = useState({ q: '', city: '', kind: '' as '' | JobKind });
  const [form, setForm] = useState<JobForm>(BLANK_FORM);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const [all, mine] = await Promise.all([getAllJobs(), user?.id ? getUserJobs(user.id) : Promise.resolve([])]);
      setJobs(all);
      setMyJobs(mine);
    } catch {
      setError('Could not load jobs right now. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, [user?.id]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const q = filter.q.trim().toLowerCase();
    if (q) {
      const searchable = [job.title, job.description, job.category, job.skills.join(', '), job.city, job.area].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (filter.city && job.city?.toLowerCase() !== filter.city.toLowerCase()) return false;
    if (filter.kind && job.kind !== filter.kind) return false;
    return true;
  }), [jobs, filter]);

  const updateForm = (key: keyof JobForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const submitJob = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setError('');
      await createJob({
        kind: form.kind,
        title: form.title.trim(),
        description: form.description.trim(),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        city: form.city,
        area: form.area.trim(),
        salary: form.salary.trim(),
        jobType: form.jobType,
        category: form.category.trim(),
        contactEmail: user.email,
        contactPhone: user.phone || '',
        whatsapp: user.phone || '',
        postedBy: user.id,
        postedByName: user.name,
        businessName: user.businessName || '',
        businessSlug: user.businessSlug || '',
        photoURL: user.photoURL || '',
        experience: form.experience.trim(),
        education: form.education.trim(),
        openings: Math.max(1, Number(form.openings || 1)),
        deadline: form.deadline || '',
        active: true,
      });
      setForm(BLANK_FORM);
      setTab('mine');
      await loadJobs();
    } catch {
      setError('Could not publish the job right now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '88px 0 56px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Jobs Hub</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 14 }}>Post vacancies, create job-wanted profiles, and discover local opportunities.</p>

      {error && <div className="card-flat" style={{ borderColor: 'rgba(220,38,38,.25)', color: '#dc2626', marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {(['discover', 'post', 'mine'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="chip" style={{ background: tab === t ? 'var(--amber-subtle)' : 'transparent' }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'discover' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, marginBottom: 14 }}>
            <input className="field-inp" placeholder="Search title, description, skills..." value={filter.q} onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))} />
            <select className="field-inp" value={filter.city} onChange={(e) => setFilter((f) => ({ ...f, city: e.target.value }))}>
              <option value="">All cities</option>
              {CITIES.map((city) => <option key={city}>{city}</option>)}
            </select>
            <select className="field-inp" value={filter.kind} onChange={(e) => setFilter((f) => ({ ...f, kind: e.target.value as JobKind | '' }))}>
              <option value="">All types</option>
              <option value="vacancy">Vacancy</option>
              <option value="wanted">Wanted</option>
            </select>
            <button className="chip" type="button" onClick={() => setFilter({ q: '', city: '', kind: '' })}>Clear</button>
          </div>

          {loading ? <p>Loading jobs…</p> : (
            <div style={{ display: 'grid', gap: 12 }}>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{filteredJobs.length} result(s)</p>
              {filteredJobs.map((job) => (
                <article key={job.id} className="card-flat">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <h3 style={{ marginBottom: 8 }}>{job.title}</h3>
                    <span className="chip">{job.kind}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{job.description}</p>
                  <p style={{ marginBottom: 8 }}><strong>{job.city}</strong> · {job.jobType} · {job.salary || 'Salary not disclosed'}</p>
                  <p style={{ fontSize: 13 }}>Skills: {job.skills.join(', ') || '—'} · Contact: {job.contactEmail}</p>
                </article>
              ))}
              {filteredJobs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No jobs match these filters yet.</p>}
            </div>
          )}
        </>
      )}

      {tab === 'post' && (
        <form onSubmit={submitJob} className="card-flat" style={{ maxWidth: 920, display: 'grid', gap: 10 }}>
          {!user && <p>Please <Link href="/login">log in</Link> to post jobs.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <select className="field-inp" value={form.kind} onChange={updateForm('kind')}>
              <option value="vacancy">Vacancy (Business hiring)</option>
              <option value="wanted">Wanted (User seeking work)</option>
            </select>
            <input className="field-inp" placeholder="Job title" value={form.title} onChange={updateForm('title')} required />
          </div>
          <textarea className="field-inp" rows={4} placeholder="Role summary, responsibilities, highlights" value={form.description} onChange={updateForm('description')} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <input className="field-inp" placeholder="Skills (comma separated)" value={form.skills} onChange={updateForm('skills')} />
            <input className="field-inp" placeholder="Category (e.g. Sales, Developer)" value={form.category} onChange={updateForm('category')} />
            <select className="field-inp" value={form.jobType} onChange={updateForm('jobType')}>
              {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <select className="field-inp" value={form.city} onChange={updateForm('city')} required>
              <option value="">City</option>
              {CITIES.map((city) => <option key={city}>{city}</option>)}
            </select>
            <input className="field-inp" placeholder="Area / locality" value={form.area} onChange={updateForm('area')} />
            <input className="field-inp" placeholder="Salary range" value={form.salary} onChange={updateForm('salary')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <input className="field-inp" placeholder="Experience (e.g. 2-4 years)" value={form.experience} onChange={updateForm('experience')} />
            <input className="field-inp" placeholder="Education" value={form.education} onChange={updateForm('education')} />
            <input className="field-inp" type="number" min={1} placeholder="Openings" value={form.openings} onChange={updateForm('openings')} />
          </div>
          <input className="field-inp" type="date" value={form.deadline} onChange={updateForm('deadline')} />
          <button disabled={!user || saving} className="btn btn-primary" type="submit">{saving ? 'Publishing…' : 'Publish Job'}</button>
        </form>
      )}

      {tab === 'mine' && (
        <div style={{ display: 'grid', gap: 10 }}>
          {!user && <p>Please <Link href="/login">log in</Link> to see your jobs.</p>}
          {user && myJobs.length === 0 && <p>You have not posted anything yet.</p>}
          {myJobs.map((job) => <div key={job.id} className="card-flat"><strong>{job.title}</strong> — {job.kind} ({job.city})</div>)}
        </div>
      )}
    </div>
  );
}
