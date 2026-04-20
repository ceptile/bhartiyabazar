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
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Firestore helpers ─────────────────────────────────────────────────────
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
  } catch { /* silent */ }
  return newUser;
}

function friendlyError(code: string, context: 'login' | 'register' | 'google'): string {
  const map: Record<string, string> = {
    'auth/user-not-found':        'No account found with this email. Please sign up first.',
    'auth/invalid-credential':    'Incorrect email or password. Please try again.',
    'auth/wrong-password':        'Incorrect password. Please try again.',
    'auth/email-already-in-use':  'An account with this email already exists. Please sign in instead.',
    'auth/weak-password':         'Password must be at least 6 characters.',
    'auth/too-many-requests':     'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed':'Network error. Please check your internet connection.',
    'auth/popup-closed-by-user':  '',
    'auth/cancelled-popup-request': '',
    'auth/popup-blocked':         'Popup was blocked. Please allow popups for this site and try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please enable it in the Firebase Console → Authentication → Sign-in methods.',
    'auth/invalid-email':         'Invalid email address.',
    'auth/missing-password':      'Password is required.',
    'auth/internal-error':        'Firebase returned an internal error. Please check your Firebase Console → Authentication → Sign-in methods and ensure Google sign-in is enabled, and your Vercel domain is added under Authorised domains.',
    'auth/unauthorized-domain':   'This domain is not authorised in Firebase. Go to Firebase Console → Authentication → Settings → Authorised domains and add your Vercel deployment URL.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method. Please sign in with email/password instead.',
  };
  if (map[code] !== undefined) return map[code];
  if (context === 'google')   return `Google sign-in failed. (${code})`;
  if (context === 'register') return `Registration failed. (${code})`;
  return `Sign-in failed. (${code})`;
}

// ── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  // ── Email / Password Login ────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      return { ok: false, error: friendlyError(code, 'login') };
    }
  };

  // ── Google Login ──────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // If new user via Google, ensure Firestore profile exists with role='user'
      const ref = doc(db, 'users', result.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        const newUser: AuthUser = {
          id: result.user.uid,
          name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
          email: result.user.email || '',
          role: 'user',
          verified: result.user.emailVerified,
          joinedAt: new Date().toISOString(),
        };
        await setDoc(ref, { ...newUser, createdAt: serverTimestamp() });
      }
      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { ok: false, error: '' };
      }
      if (code === 'auth/account-exists-with-different-credential') {
        return { ok: false, error: 'An account already exists with this email. Please sign in with your email and password.' };
      }
      return { ok: false, error: friendlyError(code, 'google') };
    }
  };

  // ── Register ──────────────────────────────────────────────────────────
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
      // auth/email-already-in-use is the correct Firebase error for duplicate email
      // No need for fetchSignInMethodsForEmail — Firebase throws this natively
      return { ok: false, error: friendlyError(code, 'register') };
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