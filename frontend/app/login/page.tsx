'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/AuthContext';
import { login as loginApi } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sprout, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle2,
  Store,
  Stethoscope,
  ShieldCheck,
  HelpCircle,
  X
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await loginApi(email.trim(), password);
      if (result.user) {
        setUser(result.user, result.accessToken);
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Invalid email or password. Please verify your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F4] text-slate-900 flex flex-col justify-center relative overflow-hidden font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Background Grassy Landscape Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft emerald radial glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-teal-300/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[300px] bg-emerald-200/40 rounded-full blur-[120px]" />

        {/* Delicate patterned grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#065F46 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} 
        />

        {/* Bottom soft hill illustration */}
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
            href="/register"
            className="text-xs font-black text-emerald-700 hover:text-emerald-900 underline-offset-4 hover:underline"
          >
            Need an account? <span className="font-extrabold text-emerald-800">Register Free</span>
          </Link>
        </div>

        {/* Dual Card Wrapper */}
        <div className="bg-white rounded-[36px] shadow-2xl shadow-emerald-950/10 border border-emerald-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Panel: Lush Grassy Brand Feature Showcase (Visible on Large screens) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Leaf Glow & SVG pattern */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />

            {/* Micro Grass Vector Silhouette at bottom */}
            <div 
              className="absolute bottom-0 inset-x-0 h-24 opacity-25 pointer-events-none" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30' viewBox='0 0 60 30'%3E%3Cpath d='M10,30 Q12,12 18,5 Q15,18 20,30 M25,30 Q28,10 35,2 Q31,16 38,30 M42,30 Q44,15 50,8 Q47,20 54,30' stroke='%2334D399' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat-x',
                backgroundPosition: 'bottom'
              }}
            />

            {/* Top Brand Header */}
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
                    Kisan Community Portal
                  </span>
                </div>
              </Link>

              <div className="pt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-black uppercase tracking-wider border border-emerald-400/25 backdrop-blur-sm">
                  <Sparkles size={12} className="text-amber-300 animate-pulse" />
                  <span>50,000+ Farmers Active Today</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Welcome back to your farming headquarters.
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed">
                  Real-time APMC Mandi rates, AI disease diagnosis, community advice, and weather alerts in one place.
                </p>
              </div>
            </div>

            {/* Feature Checkpoints */}
            <div className="relative z-10 space-y-3 my-6 pt-4 border-t border-emerald-400/20">
              <div className="flex items-center gap-3 text-xs font-bold text-emerald-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Store size={14} />
                </div>
                <span>450+ Live APMC Mandi Wholesale Rates</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-emerald-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Stethoscope size={14} />
                </div>
                <span>Instant Leaf Disease Detection with AI Doctor</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-emerald-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <span>100% Secure & Free for Every Indian Farmer</span>
              </div>
            </div>

            {/* Bottom Quote Badge */}
            <div className="relative z-10 bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-400/20 backdrop-blur-md">
              <p className="text-[11px] text-emerald-200/90 font-medium italic">
                "खेती का सही फैसला, सही जानकारी से ही संभव है।"
              </p>
            </div>
          </div>

          {/* Right Panel: Clean, High-UX Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
            
            <div>
              {/* Mobile Branding (Visible on mobile/tablet) */}
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <Sprout size={20} />
                </div>
                <div>
                  <span className="text-lg font-black text-slate-900 tracking-tight">
                    Krishi<span className="text-emerald-600">Social</span>
                  </span>
                  <p className="text-[10px] font-bold text-slate-400">Sign in to your farm account</p>
                </div>
              </div>

              {/* Form Heading */}
              <div className="space-y-1.5 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Sign In to Your Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Enter your credentials below to access your dashboard.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-3 animate-in fade-in">
                  <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-extrabold">Authentication Failed</p>
                    <p className="text-[11px] font-medium text-rose-600/90 mt-0.5">{error}</p>
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="e.g. kisan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-13 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-11 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-black text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-13 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-11 pr-12 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer accent-emerald-600"
                    />
                    <span className="text-xs font-bold text-slate-600">Keep me logged in</span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-13 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all disabled:opacity-50 hover:shadow-emerald-700/40 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Account</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Bottom Register Footer */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-500">
                  Don't have a KrishiSocial account?{' '}
                  <Link 
                    href="/register" 
                    className="text-emerald-700 hover:text-emerald-900 font-black hover:underline ml-1"
                  >
                    Create Free Account
                  </Link>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-100 space-y-4 relative">
            <button 
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <HelpCircle size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Reset Your Password</h3>
              <p className="text-xs text-slate-500 font-medium">
                Enter your registered email address and we will send you instructions to reset your password.
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="font-extrabold">Instructions Sent!</span>
                </div>
                <p className="text-[11px] font-normal text-slate-600">
                  If an account exists for <span className="font-bold">{forgotEmail}</span>, you will receive password reset instructions.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setForgotSubmitted(true); }} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="kisan@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 h-11 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
