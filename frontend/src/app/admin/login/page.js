'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, GraduationCap, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(form.email, form.password);
      localStorage.setItem('jiv_admin_token', res.token);
      localStorage.setItem('jiv_admin_user', JSON.stringify(res.admin));
      toast.success(`Welcome back, ${res.admin.name}!`);
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-sparkle" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gold-300 hover:text-gold-400 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>

        <div className="rounded-3xl bg-white shadow-2xl p-8 border border-gold-300">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-hero-gradient shadow-navy">
              <GraduationCap className="h-7 w-7 text-gold-400" strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900">
              Admin <span className="gradient-text">Login</span>
            </h1>
            <p className="text-navy-600 text-sm mt-1">Sign in to manage bookings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="info@jivtutoring.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label-field">Password</label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-semibold text-gold-700 hover:text-gold-800"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
