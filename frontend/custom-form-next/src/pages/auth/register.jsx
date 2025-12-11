"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register({ name, email, password });
      const { user, token } = res.data || {};
      if (token) setAuth({ user, token });
      // If token present, go to dashboard; otherwise go to login
      router.push(token ? '/app/dashboard' : '/auth/login');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed');
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
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">Build and share beautiful custom forms</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <label className="text-xs font-medium text-slate-600">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input" type="text" required />

            <label className="text-xs font-medium text-slate-600">Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input" type="email" required />

            <label className="text-xs font-medium text-slate-600">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="input" type="password" minLength={6} required />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" className="btn-primary btn-signin w-full mt-6" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <p>
              Already have an account?{' '}
              <Link href="/auth/login" className="text-indigo-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
