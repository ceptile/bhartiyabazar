'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createJob, getUserJobs, closeJob, featureJob, markJobUrgent } from '@/lib/jobs-enhanced';
import Link from 'next/link';

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function JobsDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: 'vacancy' as 'vacancy' | 'wanted',
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    salary: '',
    salaryMin: '',
    salaryMax: '',
    salaryType: 'negotiable' as 'hourly' | 'monthly' | 'yearly' | 'negotiable',
    location: '',
    city: '',
    area: '',
    workType: 'onsite' as 'remote' | 'onsite' | 'hybrid',
    workSchedule: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance',
    experience: '',
    experienceMin: '',
    experienceMax: '',
    skills: '',
    category: '',
    company: '',
    companySize: '',
    companyWebsite: '',
    contactEmail: '',
    contactPhone: '',
    urgent: false,
    featured: false,
    expiresDays: '30',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      const userJobs = await getUserJobs(user.id);
      setJobs(userJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const jobData = {
        type: form.type,
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        responsibilities: form.responsibilities,
        salary: form.salary,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        salaryType: form.salaryType,
        location: form.location,
        city: form.city,
        area: form.area,
        workType: form.workType,
        workSchedule: form.workSchedule,
        experience: form.experience,
        experienceMin: form.experienceMin ? parseInt(form.experienceMin) : undefined,
        experienceMax: form.experienceMax ? parseInt(form.experienceMax) : undefined,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s),
        category: form.category,
        company: form.type === 'vacancy' ? form.company : undefined,
        companySize: form.type === 'vacancy' ? form.companySize : undefined,
        companyWebsite: form.type === 'vacancy' ? form.companyWebsite : undefined,
        userName: form.type === 'wanted' ? user.name : undefined,
        userProfile: form.type === 'wanted' ? user.id : undefined,
        postedBy: user.id,
        postedByRole: user.role || 'user',
        businessSlug: user.businessSlug,
        businessName: user.businessName,
        contactEmail: form.contactEmail || user.email,
        contactPhone: form.contactPhone || user.phone,
        urgent: form.urgent,
        featured: form.featured,
        expiresAt: new Date(Date.now() + parseInt(form.expiresDays) * 24 * 60 * 60 * 1000),
      };

      await createJob(jobData);
      setShowForm(false);
      setForm({
        type: 'vacancy',
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        salary: '',
        salaryMin: '',
        salaryMax: '',
        salaryType: 'negotiable',
        location: '',
        city: '',
        area: '',
        workType: 'onsite',
        workSchedule: 'full-time',
        experience: '',
        experienceMin: '',
        experienceMax: '',
        skills: '',
        category: '',
        company: '',
        companySize: '',
        companyWebsite: '',
        contactEmail: '',
        contactPhone: '',
        urgent: false,
        featured: false,
        expiresDays: '30',
      });
      await loadJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await closeJob(jobId, newStatus === 'closed' ? 'closed' : 'active');
      await loadJobs();
    } catch (error) {
      console.error('Error toggling job status:', error);
    }
  };

  const handleToggleFeatured = async (jobId: string, currentFeatured: boolean) => {
    try {
      await featureJob(jobId, !currentFeatured);
      await loadJobs();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleToggleUrgent = async (jobId: string, currentUrgent: boolean) => {
    try {
      await markJobUrgent(jobId, !currentUrgent);
      await loadJobs();
    } catch (error) {
      console.error('Error toggling urgent:', error);
    }
  };

  const CATEGORIES = [
    'Technology', 'Design', 'Marketing', 'Sales', 'Customer Service',
    'Finance', 'Human Resources', 'Operations', 'Legal', 'Healthcare',
    'Education', 'Engineering', 'Manufacturing', 'Retail', 'Hospitality',
    'Construction', 'Transportation', 'Agriculture', 'Media', 'Consulting', 'Other',
  ];

  const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Bhiwadi', 'Gurgaon', 'Noida', 'Faridabad'];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 80, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 1200 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Job Management</h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Manage your job postings and applications</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--r-md)',
              background: 'var(--amber)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon d="M12 5v14M5 12h14" />
            {showForm ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, marginBottom: 32, boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Create Job Posting</h2>

            <form onSubmit={handleSubmit}>
              {/* Job Type */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Job Type</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'vacancy' })}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--r-md)',
                      border: `2px solid ${form.type === 'vacancy' ? 'var(--amber)' : 'var(--border)'}`,
                      background: form.type === 'vacancy' ? 'var(--amber-subtle)' : 'var(--surface-2)',
                      color: form.type === 'vacancy' ? 'var(--amber)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    🏢 Hiring (Vacancy)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'wanted' })}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--r-md)',
                      border: `2px solid ${form.type === 'wanted' ? 'var(--amber)' : 'var(--border)'}`,
                      background: form.type === 'wanted' ? 'var(--amber-subtle)' : 'var(--surface-2)',
                      color: form.type === 'wanted' ? 'var(--amber)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    👤 Looking for Work
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Job Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Senior React Developer"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Select category…</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the role or what you're looking for…"
                  required
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Requirements & Responsibilities */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Requirements</label>
                  <textarea
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    placeholder="Required skills, qualifications, experience…"
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Responsibilities</label>
                  <textarea
                    value={form.responsibilities}
                    onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                    placeholder="Key responsibilities and duties…"
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Salary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Salary Type</label>
                  <select
                    value={form.salaryType}
                    onChange={(e) => setForm({ ...form, salaryType: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="negotiable">Negotiable</option>
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Min Salary (₹)</label>
                  <input
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                    placeholder="e.g. 25000"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Max Salary (₹)</label>
                  <input
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                    placeholder="e.g. 50000"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Select city…</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Area / Locality</label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="e.g. Sector 14, Bhiwadi"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Work Type & Schedule */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Work Type</label>
                  <select
                    value={form.workType}
                    onChange={(e) => setForm({ ...form, workType: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Work Schedule</label>
                  <select
                    value={form.workSchedule}
                    onChange={(e) => setForm({ ...form, workSchedule: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>

              {/* Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Experience Level</label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. 2-5 years"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Min Years</label>
                  <input
                    type="number"
                    value={form.experienceMin}
                    onChange={(e) => setForm({ ...form, experienceMin: e.target.value })}
                    placeholder="e.g. 2"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Max Years</label>
                  <input
                    type="number"
                    value={form.experienceMax}
                    onChange={(e) => setForm({ ...form, experienceMax: e.target.value })}
                    placeholder="e.g. 5"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. React, TypeScript, Node.js, MongoDB"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                />
              </div>

              {/* Company Info (for vacancies) */}
              {form.type === 'vacancy' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Company Name</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. TechCorp India"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Company Size</label>
                    <select
                      value={form.companySize}
                      onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Select size…</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Contact Email</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    placeholder="e.g. jobs@company.com"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Contact Phone</label>
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    placeholder="e.g. +91 98100 00000"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Expires In</label>
                  <select
                    value={form.expiresDays}
                    onChange={(e) => setForm({ ...form, expiresDays: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="7">7 days</option>
                    <option value="15">15 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.urgent}
                      onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Mark as Urgent</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Featured Listing</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 32px',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--amber)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Creating…' : 'Post Job'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="spinner" />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
            <h2 style={{ fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>No job postings yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Create your first job posting to start finding talent or opportunities.</p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '12px 32px',
                borderRadius: 'var(--r-md)',
                background: 'var(--amber)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Create First Job Posting
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
            {jobs.map(job => (
              <div key={job.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 'var(--r-full)', background: job.type === 'vacancy' ? 'var(--success-bg)' : 'var(--amber-subtle)', color: job.type === 'vacancy' ? 'var(--success)' : 'var(--amber)' }}>
                      {job.type === 'vacancy' ? 'Hiring' : 'Looking for Work'}
                    </span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      {job.featured && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--amber-subtle)', color: 'var(--amber)', fontWeight: 700 }}>⭐ Featured</span>}
                      {job.urgent && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700 }}>🔥 Urgent</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                    {new Date(job.createdAt?.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{job.title}</h3>

                <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" /> {job.company || job.userName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> {job.city}</span>
                </div>

                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {job.salary || 'Negotiable'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {job.views} views · {job.applications} applications
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {job.skills?.slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 'var(--r-full)', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>{skill}</span>
                  ))}
                  {job.skills?.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>+{job.skills.length - 3} more</span>}
                </div>

                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <button
                    onClick={() => handleToggleStatus(job.id, job.status)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--r-md)',
                      background: job.status === 'active' ? 'var(--surface-2)' : 'var(--success-bg)',
                      color: job.status === 'active' ? 'var(--text-secondary)' : 'var(--success)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {job.status === 'active' ? 'Close' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(job.id, job.featured)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--r-md)',
                      background: job.featured ? 'var(--amber-subtle)' : 'var(--surface-2)',
                      color: job.featured ? 'var(--amber)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {job.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleToggleUrgent(job.id, job.urgent)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--r-md)',
                      background: job.urgent ? 'rgba(239,68,68,0.1)' : 'var(--surface-2)',
                      color: job.urgent ? '#ef4444' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {job.urgent ? 'Not Urgent' : 'Mark Urgent'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}