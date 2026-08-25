'use client';

import React, { useState } from 'react';
import { register as registerApi } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sprout, 
  Lock, 
  Mail, 
  User, 
  AtSign, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Wheat,
  X
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the community terms and privacy policy.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await registerApi(name.trim(), username.trim().toLowerCase(), email.trim(), password);
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F4] text-slate-900 flex flex-col justify-center relative overflow-hidden font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Grassy Landscape Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-teal-300/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[300px] bg-emerald-200/40 rounded-full blur-[120px]" />

        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#065F46 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} 
        />

        <svg className="absolute bottom-0 w-full h-36 text-emerald-100/60" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,64L80,85.3C160,107,320,149,480,149.3C640,149,800,107,960,90.7C1120,75,1280,85,1360,90.7L1440,96L1440,200L1360,200C1280,200,1120,200,960,200C800,200,640,200,480,200C320,200,160,200,80,200L0,200Z" />
        </svg>
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Top Floating Navigation Back to Guide */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/welcome"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-950 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl shadow-xs border border-emerald-100 backdrop-blur-md transition-all active:scale-95"
          >
            <ArrowLeft size={14} className="text-emerald-600" />
            <span>Farmer Guide & Overview</span>
          </Link>

          <Link
            href="/login"
            className="text-xs font-black text-emerald-700 hover:text-emerald-900 underline-offset-4 hover:underline"
          >
            Already have an account? <span className="font-extrabold text-emerald-800">Sign In</span>
          </Link>
        </div>

        {/* Dual Card Wrapper */}
        <div className="bg-white rounded-[36px] shadow-2xl shadow-emerald-950/10 border border-emerald-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* Left Panel: Lush Grassy Brand Feature Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />

            <div 
              className="absolute bottom-0 inset-x-0 h-24 opacity-25 pointer-events-none" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30' viewBox='0 0 60 30'%3E%3Cpath d='M10,30 Q12,12 18,5 Q15,18 20,30 M25,30 Q28,10 35,2 Q31,16 38,30 M42,30 Q44,15 50,8 Q47,20 54,30' stroke='%2334D399' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat-x',
                backgroundPosition: 'bottom'
              }}
            />

            {/* Brand Header */}
            <div className="relative z-10 space-y-4">
              <Link href="/welcome" className="inline-flex items-center gap-2.5 group">
                <div className="w-11 h-11 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-400/30 group-hover:scale-105 transition-transform">
                  <Sprout size={24} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-white flex items-center gap-0.5">
                    Krishi<span className="text-emerald-300">Social</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200/80 -mt-1">
                    Digital Krishi Manch
                  </span>
                </div>
              </Link>

              <div className="pt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-black uppercase tracking-wider border border-emerald-400/25 backdrop-blur-sm">
                  <Sparkles size={12} className="text-amber-300 animate-pulse" />
                  <span>Join 50,000+ Progressive Farmers</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Start your smart farming journey today.
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed">
                  Join India's fastest growing community of agriculturists, mandi traders, and agronomy experts.
                </p>
              </div>
            </div>

            {/* Value Checkpoints */}
            <div className="relative z-10 space-y-3 my-6 pt-4 border-t border-emerald-400/20">
              <div className="flex items-center gap-3 text-xs font-bold text-emerald-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Wheat size={14} />
                </div>
                <span>Free Crop Advisory & Sowing Tips</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-emerald-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span>Daily Wholesale Prices from 450+ Mandis</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-emerald-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <span>100% Free Forever for Every Farmer</span>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="relative z-10 bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-400/20 backdrop-blur-md">
              <p className="text-[11px] text-emerald-200/90 font-medium italic">
                "ज्ञान और सही तकनीक से ही होगी किसान की उन्नति।"
              </p>
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
            
            <div>
              {/* Mobile Branding */}
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <Sprout size={20} />
                </div>
                <div>
                  <span className="text-lg font-black text-slate-900 tracking-tight">
                    Krishi<span className="text-emerald-600">Social</span>
                  </span>
                  <p className="text-[10px] font-bold text-slate-400">Create your free farmer account</p>
                </div>
              </div>

              {/* Form Heading */}
              <div className="space-y-1.5 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Create Your Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Join thousands of farmers sharing knowledge & finding better prices.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-3 animate-in fade-in">
                  <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-extrabold">Registration Issue</p>
                    <p className="text-[11px] font-medium text-rose-600/90 mt-0.5">{error}</p>
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-3.5">
                
                {/* 2-Column Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Rajesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-10 pr-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Username
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                        <AtSign size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="rajesh_farmer"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-10 pr-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      placeholder="kisan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-10 pr-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-10 pr-11 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer accent-emerald-600"
                    />
                    <span className="text-[11px] text-slate-600 leading-tight">
                      I agree to the <span className="font-bold text-emerald-800">KrishiSocial Community Guidelines</span> and free farmer services terms.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all disabled:opacity-50 hover:shadow-emerald-700/40 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Creating Your Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="pt-6 mt-4 border-t border-slate-100 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Already registered?{' '}
                <Link 
                  href="/login" 
                  className="text-emerald-700 hover:text-emerald-900 font-black hover:underline ml-1"
                >
                  Sign In to Account
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
