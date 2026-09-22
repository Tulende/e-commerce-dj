import React, { createContext, useContext, useState } from 'react';
import { AuthUser, UserRole } from '../types';

type Account = AuthUser & { password: string };
interface AuthValue {
  user: AuthUser | null; isOpen: boolean; open: () => void; close: () => void;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole, adminCode: string) => { ok: boolean; message?: string };
  logout: () => void;
}
const AuthContext = createContext<AuthValue | undefined>(undefined);
const ACCOUNTS = 'soundrent_accounts'; const SESSION = 'soundrent_session';
const accounts = (): Account[] => JSON.parse(localStorage.getItem(ACCOUNTS) || '[]');
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => JSON.parse(localStorage.getItem(SESSION) || 'null'));
  const [isOpen, setOpen] = useState(false);
  const persist = (next: AuthUser | null) => { setUser(next); next ? localStorage.setItem(SESSION, JSON.stringify(next)) : localStorage.removeItem(SESSION); };
  const login = (email: string, password: string) => {
    const found = accounts().find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!found) return false; const { password: _, ...safe } = found; persist(safe); setOpen(false); return true;
  };
  const signup = (fullName: string, email: string, password: string, role: UserRole, adminCode: string) => {
    if (accounts().some(a => a.email.toLowerCase() === email.toLowerCase())) return { ok: false, message: 'Email sudah terdaftar.' };
    if (role === 'admin' && adminCode !== 'SOUNDRENT-ADMIN') return { ok: false, message: 'Kode undangan admin tidak valid.' };
    const account: Account = { id: `user-${Date.now()}`, fullName, email, password, role };
    localStorage.setItem(ACCOUNTS, JSON.stringify([...accounts(), account]));
    const { password: _, ...safe } = account; persist(safe); setOpen(false); return { ok: true };
  };
  return <AuthContext.Provider value={{ user, isOpen, open: () => setOpen(true), close: () => setOpen(false), login, signup, logout: () => persist(null) }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const v = useContext(AuthContext); if (!v) throw new Error('AuthProvider missing'); return v; };
