'use client';

import React, { useState } from 'react';
import { register as registerApi } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password) return;

    setIsLoading(true);
    try {
      await registerApi(name, username, email, password);
      alert('Account created successfully! Please login.');
      router.push('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto min-h-screen bg-white px-6 py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500 font-medium">Join our community and start sharing</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">Username</label>
            <input 
              type="text" 
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              required
            />
          </div>
        </div>

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 bg-[#2E7D32] text-white rounded-2xl font-black text-base shadow-xl shadow-[#2E7D32]/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm font-bold text-gray-400">
          Already have an account? <Link href="/login" className="text-[#2E7D32] ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}
