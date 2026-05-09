'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, GraduationCap, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Reset link is missing a token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
      toast.success('Password reset! You can sign in with the new password.');
      setTimeout(() => router.push('/admin/login'), 1800);
    } catch (err) {
      toast.error(err.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-sparkle" />

      <div className="relative w-full max-w-md">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1 text-sm text-gold-300 hover:text-gold-400 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="rounded-3xl bg-white shadow-2xl p-8 border border-gold-300">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-hero-gradient shadow-navy">
              <GraduationCap className="h-7 w-7 text-gold-400" strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-navy-900">
              Set a New <span className="gradient-text">Password</span>
            </h1>
            <p className="text-navy-600 text-sm mt-1">
              Choose a strong password (8+ characters).
            </p>
          </div>

          {!token ? (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-600 mb-2" />
              <p className="font-bold text-navy-900">Missing reset token</p>
              <p className="text-sm text-navy-600 mt-1">
                Use the link from your email, or{' '}
                <Link
                  href="/admin/forgot-password"
                  className="text-gold-700 font-semibold hover:underline"
                >
                  request a new one
                </Link>
                .
              </p>
            </div>
          ) : done ? (
            <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-2" />
              <p className="font-bold text-navy-900">Password updated</p>
              <p className="text-sm text-navy-600 mt-1">
                Redirecting to sign-in…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="At least 8 characters"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Repeat your new password"
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
                    Updating password...
                  </>
                ) : (
                  'Reset password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hero-gradient" />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
