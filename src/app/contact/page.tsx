'use client';
import { useState, FormEvent } from 'react';

function Icon({ d, size = 18, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)',
  border: '1px solid var(--border-hover)', background: 'var(--bg)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  transition: 'border-color var(--t)',
};

const SUBJECTS = [
  'General Enquiry',
  'Business Listing Support',
  'Review Dispute',
  'Technical Issue',
  'Partnership / Advertising',
  'Press & Media',
  'Other',
];

const CONTACT_INFO = [
  {
    icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
    label: 'Email',
    value: 'support@bhartiyabazar.in',
    sub: 'Response within 24 hours',
  },
  {
    icon: 'M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z',
    label: 'Phone',
    value: '+91 11 4567 8900',
    sub: 'Mon–Sat, 9 AM – 6 PM IST',
  },
  {
    icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    label: 'Office',
    value: 'DLF Cyber City, Gurgaon',
    sub: 'Haryana — 122 002',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--info)');
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--border-hover)');

  return (
    <div style={{ background: 'var(--bg)', paddingTop: 64 }}>

      {/* Hero */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(48px,8vw,80px) 0' }}>
        <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-hover)', background: 'var(--surface-2)', fontSize: 12, fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 22 }}>
            <Icon d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" size={13} />
            Contact Us
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 14 }}>
            We&rsquo;re here to help
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '100%' }}>
            Have a question, need support, or want to explore a partnership? Send us a message and we will get back to you within one business day.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,380px) 1fr', gap: 28, alignItems: 'start' }}>

          {/* Info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CONTACT_INFO.map((info, i) => (
              <div key={i} className="card-flat" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--r-lg)', background: 'var(--amber-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', flexShrink: 0 }}>
                  <Icon d={info.icon} size={17} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{info.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{info.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{info.sub}</div>
                </div>
              </div>
            ))}

            <div className="card-flat" style={{ marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Support Hours</div>
              {[
                { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM IST' },
                { day: 'Saturday', time: '10:00 AM – 5:00 PM IST' },
                { day: 'Sunday', time: 'Closed' },
              ].map(row => (
                <div key={row.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.day}</span>
                  <span style={{ color: row.time === 'Closed' ? 'var(--crimson)' : 'var(--text-primary)', fontWeight: 500 }}>{row.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card-flat">
            {sent ? (
              <div style={{ textAlign: 'center', padding: 'clamp(32px,6vw,56px) 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--success-bg)', border: '1px solid rgba(45,122,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: 'var(--success)' }}>
                  <Icon d="M20 6L9 17l-5-5" size={24} sw={2.5} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Message sent</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 24px' }}>
                  Thank you for reaching out. A member of our team will respond to your message within one business day.
                </p>
                <button onClick={() => setSent(false)} className="btn btn-outline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Send a message</h2>

                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'rgba(161,44,123,0.06)', border: '1px solid rgba(161,44,123,0.2)', color: 'var(--crimson)', fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Full Name <span style={{ color: 'var(--crimson)' }}>*</span></label>
                    <input style={inp} value={form.name} onChange={set('name')} onFocus={focus} onBlur={blur} placeholder="Your name" />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Email Address <span style={{ color: 'var(--crimson)' }}>*</span></label>
                    <input style={inp} type="email" value={form.email} onChange={set('email')} onFocus={focus} onBlur={blur} placeholder="you@example.com" />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Subject</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={form.subject} onChange={set('subject')} onFocus={focus} onBlur={blur}>
                    <option value="">Select a subject...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Message <span style={{ color: 'var(--crimson)' }}>*</span></label>
                  <textarea style={{ ...inp, resize: 'vertical', minHeight: 140 }} value={form.message} onChange={set('message')} onFocus={focus} onBlur={blur} placeholder="Describe your question or issue in detail..." />
                </div>

                <button type="submit" disabled={sending} className="btn btn-primary" style={{ alignSelf: 'flex-start', minWidth: 160, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {sending
                    ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Sending...</>
                    : <><Icon d="M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z" size={15} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}