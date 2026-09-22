import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, UserRole } from '../types';

interface AuthValue { user: AuthUser | null; isOpen: boolean; isLoading: boolean; open: () => void; close: () => void; login: (email: string, password: string) => Promise<void>; signup: (name: string, email: string, password: string, role: UserRole, adminCode: string) => Promise<void>; logout: () => void; }
const AuthContext = createContext<AuthValue | undefined>(undefined);
const TOKEN = 'soundrent_token';
const request = async (path: string, body?: unknown) => {
  const token = localStorage.getItem(TOKEN);
  const res = await fetch(`/api/auth/${path}`, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Autentikasi gagal.'); return data;
};
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null); const [isOpen, setOpen] = useState(false); const [isLoading, setLoading] = useState(true);
  useEffect(() => { request('me').then(data => setUser(data.user)).catch(() => localStorage.removeItem(TOKEN)).finally(() => setLoading(false)); }, []);
  const authenticate = async (path: 'login' | 'register', body: unknown) => { const data = await request(path, body); localStorage.setItem(TOKEN, data.token); setUser(data.user); setOpen(false); };
  return <AuthContext.Provider value={{ user, isOpen, isLoading, open: () => setOpen(true), close: () => setOpen(false), login: (email, password) => authenticate('login', { email, password }), signup: (fullName, email, password, role, adminCode) => authenticate('register', { fullName, email, password, role, adminCode }), logout: () => { localStorage.removeItem(TOKEN); setUser(null); } }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider missing'); return value; };
