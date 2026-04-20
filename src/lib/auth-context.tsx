'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
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

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
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

const AuthContext = createContext<AuthContextType | null>(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// ── Firestore profile helpers ─────────────────────────────────────────────
async function fetchOrCreateProfile(fbUser: FirebaseUser): Promise<AuthUser> {
  const ref = doc(db, 'users', fbUser.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as AuthUser;
  } catch { /* network error — fall through to create */ }

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
  } catch { /* silent — still return the user object */ }
  return newUser;
}

function friendlyError(code: string, context: 'login' | 'register' | 'google'): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
      return context === 'register'
        ? 'Invalid email address.'
        : 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/configuration-not-found':
      return 'Auth configuration missing. Please contact support.';
    default:
      if (context === 'google') return 'Google sign-in failed. Please try again.';
      if (context === 'register') return 'Registration failed. Please try again.';
      return 'Sign-in failed. Please try again.';
  }
}

// ── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle Google redirect result first (fires after page reloads from signInWithRedirect)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const profile = await fetchOrCreateProfile(result.user);
          setUser(profile);
        }
      })
      .catch(() => { /* ignore redirect errors silently */ });

    // Main auth state listener
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await fetchOrCreateProfile(fbUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ── Email / Password Login ──────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      return { ok: false, error: friendlyError(code, 'login') };
    }
  };

  // ── Google Login (redirect — works on all browsers/devices) ─────────────
  const loginWithGoogle = async () => {
    try {
      // signInWithRedirect navigates away then back — result handled in useEffect above
      await signInWithRedirect(auth, googleProvider);
      return { ok: true }; // page will redirect, this line rarely reached
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      return { ok: false, error: friendlyError(code, 'google') };
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────
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

      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      return { ok: false, error: friendlyError(code, 'register') };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ── Update Profile ────────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
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