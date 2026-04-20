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

// Read full profile from Firestore
async function fetchProfile(fbUser: FirebaseUser): Promise<AuthUser | null> {
  try {
    const snap = await getDoc(doc(db, 'users', fbUser.uid));
    if (snap.exists()) return snap.data() as AuthUser;
    // First-time Google sign-in — create a minimal profile
    const newUser: AuthUser = {
      id: fbUser.uid,
      name: fbUser.displayName || 'User',
      email: fbUser.email || '',
      role: 'user',
      verified: false,
      joinedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', fbUser.uid), { ...newUser, createdAt: serverTimestamp() });
    return newUser;
  } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await fetchProfile(fbUser);
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
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential')
        return { ok: false, error: 'No account found with this email.' };
      if (code === 'auth/wrong-password')
        return { ok: false, error: 'Incorrect password.' };
      if (code === 'auth/too-many-requests')
        return { ok: false, error: 'Too many attempts. Try again later.' };
      return { ok: false, error: 'Login failed. Please try again.' };
    }
  };

  // ── Google Login ────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      if (code === 'auth/popup-closed-by-user')
        return { ok: false, error: 'Sign-in popup was closed.' };
      return { ok: false, error: 'Google sign-in failed. Please try again.' };
    }
  };

  // ── Register ─────────────────────────────────────────────────────────────
  const register = async (data: RegisterData) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await fbUpdateProfile(cred.user, { displayName: data.name });

      const slug = data.businessName
        ?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';

      const newUser: AuthUser = {
        id: cred.user.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || '',
        city: data.city || '',
        businessName: data.businessName || '',
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
      if (code === 'auth/email-already-in-use')
        return { ok: false, error: 'An account with this email already exists.' };
      if (code === 'auth/weak-password')
        return { ok: false, error: 'Password must be at least 6 characters.' };
      if (code === 'auth/invalid-email')
        return { ok: false, error: 'Invalid email address.' };
      return { ok: false, error: 'Registration failed. Please try again.' };
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ── Update Profile ──────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      await updateDoc(doc(db, 'users', user.id), { ...data });
    } catch { /* silent fail */ }
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