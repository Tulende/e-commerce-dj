import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
export const AuthModal: React.FC = () => {
  const { isOpen, close, login, signup } = useAuth(); const [mode, setMode] = useState<'login'|'signup'>('login');
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState<UserRole>('customer'); const [adminCode,setAdminCode]=useState(''); const [error,setError]=useState('');
  if (!isOpen) return null;
  const submit=(e:React.FormEvent)=>{e.preventDefault(); setError(''); if(mode==='login'){if(!login(email,password)) setError('Email atau kata sandi salah.');}else{const r=signup(name,email,password,role,adminCode);if(!r.ok)setError(r.message||'Pendaftaran gagal.');}};
  return <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-black/50 backdrop-blur-sm"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-pink-100">
    <div className="flex justify-between items-start mb-5"><div><div className="flex items-center gap-2 text-pink-700"><ShieldCheck className="w-5 h-5"/><span className="font-bold">SoundRent Account</span></div><p className="text-sm text-slate-500 mt-1">{mode==='login'?'Masuk untuk melanjutkan sewa.':'Buat akun customer atau admin.'}</p></div><button type="button" onClick={close}><X/></button></div>
    {mode==='signup' && <><label className="text-xs font-semibold">Nama lengkap</label><input required value={name} onChange={e=>setName(e.target.value)} className="auth-input" /></>}
    <label className="text-xs font-semibold">Email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="auth-input" />
    <label className="text-xs font-semibold">Kata sandi</label><input required minLength={6} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="auth-input" />
    {mode==='signup' && <><label className="text-xs font-semibold">Jenis akun</label><select value={role} onChange={e=>setRole(e.target.value as UserRole)} className="auth-input"><option value="customer">Customer</option><option value="admin">Admin</option></select>{role==='admin' && <><label className="text-xs font-semibold">Kode undangan admin</label><input required value={adminCode} onChange={e=>setAdminCode(e.target.value)} className="auth-input" /></>}</>}
    {error && <p className="text-sm text-rose-600 mt-3">{error}</p>}<button className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold flex justify-center gap-2">{mode==='login'?<LogIn className="w-4 h-4"/>:<UserPlus className="w-4 h-4"/>}{mode==='login'?'Masuk':'Buat akun'}</button>
    <button type="button" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}} className="w-full mt-3 text-sm text-violet-700">{mode==='login'?'Belum punya akun? Daftar':'Sudah punya akun? Masuk'}</button>
  </form></div>;
};
