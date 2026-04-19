'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  verified?: boolean;
  joinedAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

export interface RegisterData {
  name: string; email: string; password: string;
  phone?: string; role: UserRole;
  businessName?: string; businessCategory?: string; city?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'bb_auth_user';
const USERS_KEY   = 'bb_users_db';

function getUsers(): AuthUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(u: AuthUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function saveSession(u: AuthUser) { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setUser(JSON.parse(s)); } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, error: 'No account found with this email.' };
    const storedPw = localStorage.getItem(`bb_pw_${found.id}`);
    if (storedPw !== password) return { ok: false, error: 'Incorrect password.' };
    setUser(found); saveSession(found);
    return { ok: true };
  };

  const register = async (data: RegisterData) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase()))
      return { ok: false, error: 'An account with this email already exists.' };
    const newUser: AuthUser = {
      id: `u_${Date.now()}`, name: data.name, email: data.email,
      role: data.role, phone: data.phone, city: data.city,
      businessName: data.businessName,
      businessSlug: data.businessName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      verified: false, joinedAt: new Date().toISOString(),
    };
    localStorage.setItem(`bb_pw_${newUser.id}`, data.password);
    saveUsers([...users, newUser]);
    setUser(newUser); saveSession(newUser);
    return { ok: true };
  };

  const logout = () => { setUser(null); localStorage.removeItem(STORAGE_KEY); };

  const updateProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated); saveSession(updated);
    saveUsers(getUsers().map(u => u.id === updated.id ? updated : u));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}