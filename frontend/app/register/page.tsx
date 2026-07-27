'use client';

import React, { useState } from 'react';
import { register as registerApi } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sprout, Lock, Mail, User, AtSign, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password) return;

    setIsLoading(true);
    setError(null);
    try {
      await registerApi(name, username, email, password);
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 mx-auto">
            <Sprout size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-xs font-semibold text-slate-400">
            Join thousands of farmers & agricultural experts
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-10 pr-3 text-xs font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="rajesh_farmer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-10 pr-3 text-xs font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all placeholder:text-slate-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all hover:brightness-110 disabled:opacity-50 mt-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                Register Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 font-extrabold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
