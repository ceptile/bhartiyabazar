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

async function fetchOrCreateProfile(fbUser: FirebaseUser): Promise<AuthUser> {
  const ref = doc(db, 'users', fbUser.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as AuthUser;
      return {
        ...data,
        name: fbUser.displayName || data.name || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email || data.email || '',
      };
    }
  } catch { /* network error — fall through */ }

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

  // Handle redirect result on mount (called after Google redirects back)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const profile = await fetchOrCreateProfile(result.user);
          setUser(profile);
        }
      })
      .catch((err) => {
        console.error('[Google Redirect Error]', err?.code, err?.message);
      });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await fetchOrCreateProfile(fbUser);
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
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Google login — redirect flow (works on all browsers & deployed domains)
  const loginWithGoogle = async () => {
    await signInWithRedirect(auth, googleProvider);
    // Page will redirect to Google and come back — no return value needed
  };

  // Register with email/password
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
