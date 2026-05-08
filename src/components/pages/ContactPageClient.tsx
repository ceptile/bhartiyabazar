'use client';
import { useState } from 'react';

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="section-container">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vw,80px)' }}>
          <span className="section-label">Get in Touch</span>
          <h1 className="text-h2" style={{ marginBottom: 12 }}>Contact Us</h1>
          <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-medium-gray)', maxWidth: 520, margin: '0 auto' }}>
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {/* Contact form */}
          <div className="card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 'var(--text-h4)', marginBottom: 8, color: 'var(--color-deep-charcoal)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--color-medium-gray)' }}>We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Your Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Rahul Sharma" className="input" />
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input" />
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input type="text" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" className="input" />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us more about your inquiry..." className="input" style={{ minHeight: 120 }} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? <><span className="spinner" /> Sending…</> : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-subheading)', fontWeight: 600, marginBottom: 12, color: 'var(--color-deep-charcoal)' }}>Email</h3>
              <p style={{ color: 'var(--color-warm-terracotta)' }}>support@bhartiyabazar.com</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-subheading)', fontWeight: 600, marginBottom: 12, color: 'var(--color-deep-charcoal)' }}>Response Time</h3>
              <p style={{ color: 'var(--color-medium-gray)' }}>We typically respond within 24 hours on business days.</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-subheading)', fontWeight: 600, marginBottom: 12, color: 'var(--color-deep-charcoal)' }}>Social</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Twitter', 'LinkedIn', 'Instagram'].map((s) => (
                  <span key={s} className="badge">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
