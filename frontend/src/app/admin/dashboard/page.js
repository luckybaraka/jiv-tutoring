'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, LogOut, RefreshCw, Loader2,
  CheckCircle2, XCircle, Clock, BookOpen, Users, User,
  Mail, Phone, Calendar, Trophy, AlertCircle, Trash2,
  Download, TrendingUp, Globe2, Ban, UserCheck, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  APPROVED: 'bg-green-100 text-green-800 border-green-300',
  REJECTED: 'bg-red-100 text-red-800 border-red-300',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
  CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, completed: 0,
    rejected: 0, cancelled: 0, individual: 0, group: 0,
    last30Days: 0, totalStudents: 0, byCurriculum: {},
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [acting, setActing] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('jiv_admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    const u = localStorage.getItem('jiv_admin_user');
    if (u) setUser(JSON.parse(u));
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        api.adminListBookings(),
        api.adminStats(),
      ]);
      setBookings(bookingsRes.data || []);
      setStats((prev) => ({ ...prev, ...(statsRes.data || {}) }));
    } catch (err) {
      if (err.message.includes('Unauthorized') || err.message.includes('Invalid')) {
        localStorage.removeItem('jiv_admin_token');
        router.replace('/admin/login');
        return;
      }
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jiv_admin_token');
    localStorage.removeItem('jiv_admin_user');
    router.replace('/admin/login');
  };

  const handleAction = async (id, action) => {
    setActing(id + action);
    try {
      if (action === 'approve') await api.adminApprove(id);
      else if (action === 'reject') {
        const reason = window.prompt('Reason for rejection (optional):') || 'Not specified';
        await api.adminReject(id, reason);
      } else if (action === 'complete') await api.adminComplete(id);
      else if (action === 'cancel') await api.adminCancel(id);
      else if (action === 'delete') {
        const ok = window.confirm(
          'Permanently delete this booking? This cannot be undone.'
        );
        if (!ok) {
          setActing(null);
          return;
        }
        await api.adminDelete(id);
      }
      toast.success(`Booking ${action}${action === 'delete' ? 'd' : 'd'}`);
      await loadAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActing(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const filters = filter === 'ALL' ? {} : { status: filter };
      const filename = await api.adminExportExcel(filters);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);

  const adminTimezone =
    typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Nairobi'
      : 'Africa/Nairobi';

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-KE', {
      year: 'numeric', month: 'short', day: 'numeric',
      timeZone: adminTimezone,
    });

  const formatTimeRange = (b) => {
    if (b.startAt && b.endAt) {
      const start = new Date(b.startAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: adminTimezone,
      });
      const end = new Date(b.endAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: adminTimezone,
      });
      return `${start}–${end}`;
    }
    return `${b.timeSlot?.startTime || ''}–${b.timeSlot?.endTime || ''}`;
  };

  const primaryStats = [
    { label: 'Total', value: stats.total, icon: BookOpen, color: 'from-navy-500 to-navy-700' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'from-green-500 to-green-600' },
    { label: 'Completed', value: stats.completed, icon: Trophy, color: 'from-blue-500 to-blue-600' },
  ];

  const secondaryStats = [
    { label: 'Rejected', value: stats.rejected, icon: XCircle, accent: 'text-red-600' },
    { label: 'Cancelled', value: stats.cancelled, icon: Ban, accent: 'text-gray-600' },
    { label: 'Individual', value: stats.individual, icon: User, accent: 'text-navy-600' },
    { label: 'Group', value: stats.group, icon: Users, accent: 'text-gold-600' },
    { label: 'Last 30 days', value: stats.last30Days, icon: TrendingUp, accent: 'text-green-600' },
    { label: 'Students', value: stats.totalStudents, icon: UserCheck, accent: 'text-blue-600' },
  ];

  const curriculumEntries = Object.entries(stats.byCurriculum || {}).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-hero-gradient text-white shadow-navy">
        <div className="container-custom flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient">
              <GraduationCap className="h-6 w-6 text-navy-900" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display font-extrabold text-lg">JIV Admin Dashboard</p>
              <p className="text-xs text-gold-300">{user?.name || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting || loading}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button
              onClick={loadAll}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-semibold flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={logout}
              className="rounded-lg bg-gold-gradient px-3 py-2 text-sm font-bold text-navy-900 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* PRIMARY STATS */}
        <div className="grid gap-4 md:grid-cols-4 mb-4">
          {primaryStats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm border border-navy-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-500">
                    {s.label}
                  </p>
                  <p className="text-3xl font-extrabold text-navy-900 mt-1">{s.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECONDARY STATS */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
          {secondaryStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-white p-3 border border-navy-100 flex items-center gap-3"
            >
              <s.icon className={`h-5 w-5 ${s.accent} flex-shrink-0`} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-500">
                  {s.label}
                </p>
                <p className="text-lg font-extrabold text-navy-900 leading-tight">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CURRICULUM BREAKDOWN */}
        {curriculumEntries.length > 0 && (
          <div className="rounded-2xl bg-white border border-navy-100 p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-gold-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-navy-500">
                  Bookings by Curriculum
                </p>
              </div>
              <p className="text-xs text-navy-500">{stats.total} total</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {curriculumEntries.map(([code, count]) => {
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div
                    key={code}
                    className="flex items-center gap-2 rounded-full bg-gold-50 border border-gold-200 px-3 py-1.5"
                  >
                    <span className="font-display font-extrabold text-sm text-navy-900">
                      {code}
                    </span>
                    <span className="text-xs text-navy-600">
                      {count} · {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  filter === f
                    ? 'bg-gold-gradient text-navy-900 shadow-gold'
                    : 'bg-white text-navy-700 border border-navy-200 hover:bg-navy-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <p className="text-xs text-navy-500 inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-gold-500" />
            Showing {filtered.length} of {bookings.length}
          </p>
        </div>

        {/* BOOKINGS */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-gold-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-navy-100 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-navy-300 mx-auto mb-3" />
            <p className="text-navy-600">No bookings found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl bg-white border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* LEFT: Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${STATUS_COLORS[b.status]}`}>
                            {b.status}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-bold text-navy-700">
                            {b.sessionType === 'GROUP' ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
                            {b.sessionType}
                            {b.sessionType === 'GROUP' && ` · ${b.discountPercentage}% off`}
                          </span>
                          <span className="inline-block rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-800">
                            {b.curriculum}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-navy-900">
                          {b.parent.fullName}
                        </h3>
                        <p className="text-xs text-navy-500 mt-0.5 font-mono">{b.id}</p>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 text-sm text-navy-700 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gold-500 flex-shrink-0" />
                        <a href={`mailto:${b.parent.email}`} className="truncate hover:text-gold-700">
                          {b.parent.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gold-500 flex-shrink-0" />
                        <a href={`tel:${b.parent.phone}`} className="hover:text-gold-700">
                          {b.parent.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Calendar className="h-4 w-4 text-gold-500 flex-shrink-0" />
                        <span>
                          {formatDate(b.startAt || b.scheduledDate)} · {formatTimeRange(b)}
                        </span>
                        {b.timezone && b.timezone !== adminTimezone && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-navy-700"
                            title={`Booked from ${b.timezone}`}
                          >
                            <Globe2 className="h-2.5 w-2.5" />
                            {b.timeSlot?.startTime} {b.timezone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gold-500 flex-shrink-0" />
                        {b.subjects.join(', ')}
                      </div>
                    </div>

                    <div className="border-t border-navy-100 pt-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-1">
                        Student{b.students.length > 1 ? 's' : ''} ({b.students.length})
                      </p>
                      <div className="space-y-1">
                        {b.students.map((s, i) => (
                          <p key={i} className="text-sm text-navy-700">
                            <strong>{s.name}</strong> · Age {s.age} · {s.gradeOrClass}
                            {s.learningChallenges && (
                              <span className="text-navy-500 italic"> — {s.learningChallenges}</span>
                            )}
                          </p>
                        ))}
                      </div>
                    </div>

                    {b.notes && (
                      <div className="mt-3 rounded-lg bg-navy-50/60 p-3 text-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-1">Notes</p>
                        <p className="text-navy-700">{b.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Actions */}
                  <div className="flex flex-row flex-wrap lg:flex-col gap-2 lg:w-48">
                    {b.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAction(b.id, 'approve')}
                          disabled={acting === b.id + 'approve'}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                          {acting === b.id + 'approve' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'reject')}
                          disabled={acting === b.id + 'reject'}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {acting === b.id + 'reject' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                          Reject
                        </button>
                      </>
                    )}
                    {b.status === 'APPROVED' && (
                      <>
                        <button
                          onClick={() => handleAction(b.id, 'complete')}
                          disabled={acting === b.id + 'complete'}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          <Trophy className="h-4 w-4" />
                          Mark Complete
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'cancel')}
                          disabled={acting === b.id + 'cancel'}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-500 px-3 py-2 text-sm font-bold text-white hover:bg-gray-600 disabled:opacity-60"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleAction(b.id, 'delete')}
                      disabled={acting === b.id + 'delete'}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-red-300 bg-white px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {acting === b.id + 'delete' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
