'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

/**
 * /register-business is no longer a standalone sign-up page.
 * If the user is already logged in → send them straight to /list-business.
 * If not logged in → send them to /login?redirect=/list-business so they
 * sign in / sign up first, then land on the listing form.
 */
export default function RegisterBusinessRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/list-business');
    } else {
      router.replace('/login?redirect=/list-business');
    }
  }, [user, loading, router]);

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
    }}>
      <div style={{
        width: 32, height: 32,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--amber)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
