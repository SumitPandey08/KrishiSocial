'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/AuthContext';
import { login as loginApi } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const result = await loginApi(email, password);
      if (result.user) {
        setUser(result.user, result.accessToken);
        router.push('/');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto min-h-screen bg-white px-6 py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 font-medium">Enter your details below to sign in</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">Email</label>
          <input 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">Password</label>
          <input 
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
            required
          />
        </div>

        <div className="text-right">
          <button type="button" className="text-sm font-black text-[#2E7D32]">Forgot Password?</button>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 bg-[#2E7D32] text-white rounded-2xl font-black text-base shadow-xl shadow-[#2E7D32]/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm font-bold text-gray-400">
          Don't have an account? <Link href="/register" className="text-[#2E7D32] ml-1">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
