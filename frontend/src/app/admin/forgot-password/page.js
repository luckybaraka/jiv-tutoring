'use client';

import { useState } from 'react';
import { Mail, GraduationCap, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setSent(true);
      toast.success(res.message || 'If that email is registered, a reset link is on its way.');
    } catch (err) {
      toast.error(err.message || 'Could not request reset. Try again.');
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
              Forgot <span className="gradient-text">Password?</span>
            </h1>
            <p className="text-navy-600 text-sm mt-1">
              Enter the email tied to your admin account and we'll send a
              reset link.
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-2" />
              <p className="font-bold text-navy-900">Check your inbox</p>
              <p className="text-sm text-navy-600 mt-1">
                If <strong>{email}</strong> is registered, you'll receive a
                reset link within a minute. The link expires in 30 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
                className="mt-4 text-sm font-semibold text-gold-700 hover:text-gold-800"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="info@jivtutoring.com"
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
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
