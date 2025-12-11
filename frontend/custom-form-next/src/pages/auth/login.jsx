"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      const { user, token } = res.data || {};
      if (token) setAuth({ user, token });
      router.push('/app/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 via-transparent to-emerald-100/40 pointer-events-none" />
      <div className="w-full max-w-md mx-auto px-4 z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-lg font-bold shadow-md">F</div>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to continue to FormCraft</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <label className="text-xs font-medium text-slate-600">Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input" type="email" required />

            <label className="text-xs font-medium text-slate-600">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="input" type="password" required />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" className="btn-primary btn-signin w-full mt-4" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <p>
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-indigo-600 hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
