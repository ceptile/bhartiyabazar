'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/auth-context';
import { addReview } from '@/lib/reviews-store';

interface Props {
  businessId: string;
  businessSlug: string;
  onClose: () => void;
  onAdded: () => void;
}

export default function ReviewModal({ businessId, businessSlug, onClose, onAdded }: Props) {
  const { user } = useAuth();
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [title, setTitle]     = useState('');
  const [text, setText]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    if (!user) { setError('Please sign in to leave a review.'); return; }
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (text.length < 20) { setError('Review must be at least 20 characters.'); return; }
    setLoading(true);
    const initials = user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    addReview({ businessId, businessSlug, userId: user.id, userName: user.name, userAvatar: initials, rating, title, text, verified: true });
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    onAdded();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 500, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 22, color: 'var(--text-primary)' }}>Write a Review</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--error-bg)', color: 'var(--crimson)', fontSize: 13 }}>{error}</div>}

          {/* Star rating */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>Your Rating *</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  style={{ fontSize: 32, color: s <= (hover || rating) ? 'var(--gold)' : 'var(--border-strong)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, transition: 'color var(--t)' }}>
                  ★
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {['','Terrible','Poor','Average','Good','Excellent'][hover || rating] || 'Select stars'}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Review Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarise your experience"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
              onFocus={e => (e.target.style.borderColor = 'var(--amber)')} onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Your Review *</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
              placeholder="Share your experience in detail (min 20 characters)…"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = 'var(--amber)')} onBlur={e => (e.target.style.borderColor = 'var(--border-hover)')} />
            <div style={{ fontSize: 11, color: text.length < 20 ? 'var(--crimson)' : 'var(--success)', marginTop: 3 }}>{text.length}/20 minimum</div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 'var(--r-md)', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: 11, borderRadius: 'var(--r-md)', background: loading ? 'var(--amber-dark)' : 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Posting…' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}