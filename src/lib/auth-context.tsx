'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
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
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// ── Firestore helpers ─────────────────────────────────────────────────────
async function fetchOrCreateProfile(fbUser: FirebaseUser): Promise<AuthUser> {
  const ref = doc(db, 'users', fbUser.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as AuthUser;
      // Always keep email/name fresh from Firebase Auth
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

function friendlyError(code: string, context: 'login' | 'register' | 'google'): string {
  const map: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/invalid-credential': 'No account found with this email or password is wrong.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Google sign-in was cancelled.',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site and try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Contact support.',
    'auth/configuration-not-found': 'Firebase configuration missing. Contact support.',
    'auth/invalid-email': context === 'register' ? 'Invalid email address.' : 'Invalid email address.',
    'auth/missing-password': 'Password is required.',
  };
  if (map[code]) return map[code];
  if (context === 'google') return `Google sign-in failed. (${code || 'unknown error'})`;
  if (context === 'register') return `Registration failed. (${code || 'unknown error'})`;
  return `Sign-in failed. (${code || 'unknown error'})`;
}

// ── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is the single source of truth
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await fetchOrCreateProfile(fbUser);
          setUser(profile);
        } catch {
          // Even if Firestore fails, populate from Firebase Auth
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

  // ── Email / Password Login ────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged will fire and setUser automatically
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: friendlyError((err as {code?:string}).code || '', 'login') };
    }
  };

  // ── Google Login (POPUP — works reliably on Vercel/Next.js) ───────────
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged fires → setUser automatically
      return { ok: true };
    } catch (err: unknown) {
      const code = (err as {code?:string}).code || '';
      // User simply closed the popup — not really an error
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { ok: false, error: '' };
      }
      return { ok: false, error: friendlyError(code, 'google') };
    }
  };

  // ── Register ──────────────────────────────────────────────────────────
  const register = async (data: RegisterData) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      await fbUpdateProfile(cred.user, { displayName: data.name.trim() });

      const slug = (data.businessName || '')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const newUser: AuthUser = {
        id: cred.user.uid,
        name: data.name.trim(),
        email: data.email.trim(),
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

      // onAuthStateChanged will fire and setUser automatically
      return { ok: true };
    } catch (err: unknown) {
      return { ok: false, error: friendlyError((err as {code?:string}).code || '', 'register') };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ── Update Profile ────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : prev);
    try {
      await updateDoc(doc(db, 'users', user.id), { ...data });
    } catch { /* silent */ }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}