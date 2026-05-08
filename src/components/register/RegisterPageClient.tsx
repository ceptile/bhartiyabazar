'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';

export default function RegisterPageClient() {
  const router = useRouter();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone]       = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Save user profile to Firestore
  async function saveUserToFirestore(uid: string, data: object) {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      createdAt: serverTimestamp(),
      role: 'user',
    });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      await saveUserToFirestore(user.uid, { name, email, phone });
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setError(''); setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      await saveUserToFirestore(user.uid, {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber ?? '',
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-up failed');
    } finally { setLoading(false); }
  }

  return (
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-off-white)', padding: '24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 'clamp(28px,6vw,48px)' }}>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,4vw,1.8rem)', fontWeight: 400, color: 'var(--color-deep-charcoal)', marginBottom: 6 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-light-gray)', marginBottom: 28 }}>
          Join BhartiyaBazar — free forever for buyers
        </p>

        {/* Google */}
        <button onClick={handleGoogle} disabled={loading} className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.5 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.6 0-14.2 4.2-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5L31.8 34C29.9 35.3 27.1 36 24 36c-5.3 0-9.7-2.7-11.3-7H6.3C9.8 39.8 16.4 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.4 4.9C41.5 34.8 44 29.8 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Sign up with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-muted-border)' }} />
          <span style={{ fontSize: 12, color: 'var(--color-light-gray)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-muted-border)' }} />
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="Rahul Sharma" className="input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className="input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Phone</label>
            <input
              type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210" className="input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters" className="input"
            />
          </div>

          {error && <p className="badge badge-error" style={{ padding: '10px 14px' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-accent" style={{ width: '100%', marginTop: 4 }}>
            {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--color-light-gray)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-warm-terracotta)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
}
