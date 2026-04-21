'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'user' | 'business';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  businessName?: string;
  businessSlug?: string;
  businessCategory?: string;
  verified?: boolean;
  joinedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  role: UserRole;
  businessName?: string;
  businessCategory?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

async function upsertProfile(fbUser: FirebaseUser): Promise<AuthUser> {
  const ref = doc(db, 'users', fbUser.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as AuthUser;
      // Always sync latest name/email from Google
      const updated = {
        ...data,
        name: fbUser.displayName || data.name || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email || data.email || '',
      };
      return updated;
    }
  } catch { /* fall through */ }

  const newUser: AuthUser = {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
    email: fbUser.email || '',
    role: 'user',
    verified: fbUser.emailVerified,
    joinedAt: new Date().toISOString(),
  };
  try {
    await setDoc(ref, { ...newUser, createdAt: serverTimestamp() });
  } catch { /* silent */ }
  return newUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let redirectHandled = false;

    // Step 1: Check for redirect result first
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          redirectHandled = true;
          const profile = await upsertProfile(result.user);
          setUser(profile);
          // Redirect to home after successful Google login
          if (typeof window !== 'undefined' && window.location.pathname === '/login') {
            window.location.href = '/';
          }
        }
      })
      .catch((err) => {
        console.error('[getRedirectResult error]', err?.code, err?.message);
      });

    // Step 2: Auth state listener (handles all sessions including redirect)
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await upsertProfile(fbUser);
          setUser(profile);
        } catch {
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            role: 'user',
            verified: fbUser.emailVerified,
            joinedAt: new Date().toISOString(),
          });
        }
      } else {
        if (!redirectHandled) setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error('[signInWithRedirect error]', err);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email.trim().toLowerCase(),
        data.password
      );
      await fbUpdateProfile(cred.user, { displayName: data.name.trim() });

      const slug = (data.businessName || '')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const newUser: AuthUser = {
        id: cred.user.uid,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
        phone: data.phone?.trim() || '',
        city: data.city?.trim() || '',
        businessName: data.businessName?.trim() || '',
        businessCategory: data.businessCategory || '',
        businessSlug: slug,
        verified: false,
        joinedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });

      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password':        'Password must be at least 6 characters.',
        'auth/invalid-email':        'Invalid email address.',
        'auth/too-many-requests':    'Too many attempts. Please wait and try again.',
        'auth/network-request-failed': 'Network error. Check your connection.',
      };
      return { ok: false, error: messages[code] || `Registration failed. (${code})` };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : prev);
    try {
      await updateDoc(doc(db, 'users', user.id), { ...data });
    } catch { /* silent */ }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
