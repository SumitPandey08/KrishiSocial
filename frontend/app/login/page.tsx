'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/AuthContext';
import { login as loginApi } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sprout, Lock, Mail, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await loginApi(email, password);
      if (result.user) {
        setUser(result.user, result.accessToken);
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 mx-auto">
            <Sprout size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            Krishi<span className="text-emerald-400">Social</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400">
            Connecting Farmers, APMC Markets & AI Advisory
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
              <button type="button" className="text-[10px] font-extrabold text-emerald-400 hover:underline">
                Forgot?
              </button>
            </div>
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
                Sign In To Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-400 font-extrabold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
