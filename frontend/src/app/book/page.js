'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  User,
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  PartyPopper,
  Globe2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { api } from '@/lib/api';

const SESSION_DURATION_MINUTES = 45;

/** Detect the visitor's IANA timezone (e.g. "Africa/Nairobi", "America/New_York"). */
function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Nairobi';
  } catch {
    return 'Africa/Nairobi';
  }
}

/**
 * Combine local "YYYY-MM-DD" date and "HH:MM" time into a UTC ISO string.
 * The Date constructor interprets `YYYY-MM-DDTHH:MM:SS` in the browser's
 * local timezone (which IS the user's timezone), so toISOString() gives the
 * correct absolute instant.
 */
function toUtcIso(date, time) {
  if (!date || !time) return '';
  const d = new Date(`${date}T${time}:00`);
  return isNaN(d.getTime()) ? '' : d.toISOString();
}

function formatTzOffset(timezone) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value;
    return tz || '';
  } catch {
    return '';
  }
}

const SUBJECT_OPTIONS = {
  CBC: [
    'Mathematics',
    'English',
    'Kiswahili',
    'Science & Technology',
    'Social Studies',
    'Creative Arts',
  ],
  CBE: [
    'Mathematics',
    'English',
    'Kiswahili',
    'Integrated Science',
    'Social Studies',
    'Creative Arts',
    'Pre-Technical Studies',
  ],
  IGCSE: [
    'Mathematics',
    'English (First Language)',
    'English (Second Language)',
    'Biology',
    'Chemistry',
    'Physics',
    'Combined Science',
    'ICT',
    'Computer Science',
    'Business Studies',
    'Economics',
    'Geography',
    'History',
  ],
  GCSE: [
    'Mathematics',
    'English Language',
    'English Literature',
    'Biology',
    'Chemistry',
    'Physics',
    'Combined Science',
    'Computer Science',
    'Geography',
    'History',
    'Business',
  ],
  'MYP/IB': [
    'Mathematics',
    'Language & Literature',
    'Language Acquisition',
    'Sciences',
    'Individuals & Societies',
    'Design',
    'Arts',
    'Theory of Knowledge',
    'Extended Essay Support',
  ],
  American: [
    'Mathematics (Algebra, Geometry, Calculus)',
    'English / Language Arts',
    'Biology',
    'Chemistry',
    'Physics',
    'World History',
    'US History',
    'Economics',
    'Computer Science',
    'SAT / ACT Prep',
  ],
};

const CURRICULUM_LABELS = {
  CBC: 'Competency-Based Curriculum (KE)',
  CBE: 'Competency-Based Education (KE)',
  IGCSE: 'Cambridge International',
  GCSE: 'General Certificate (UK)',
  'MYP/IB': 'International Baccalaureate',
  American: 'US Curriculum',
};

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  const [timezone, setTimezone] = useState('Africa/Nairobi');
  const [availability, setAvailability] = useState({
    state: 'idle', // idle | checking | available | conflict | error
    conflict: null,
  });

  const [data, setData] = useState({
    sessionType: 'INDIVIDUAL',
    curriculum: 'CBC',
    parent: { fullName: '', email: '', phone: '' },
    students: [{ name: '', age: '', gradeOrClass: '', learningChallenges: '' }],
    subjects: [],
    scheduledDate: '',
    timeSlot: '',
    notes: '',
  });

  // Detect timezone on mount (client-only).
  useEffect(() => {
    setTimezone(detectTimezone());
  }, []);

  const tzOffsetLabel = useMemo(() => formatTzOffset(timezone), [timezone]);

  // Live availability check — debounced — when both date and time are set.
  const availabilityTimer = useRef(null);
  useEffect(() => {
    if (step !== 4) return;
    if (!data.scheduledDate || !data.timeSlot) {
      setAvailability({ state: 'idle', conflict: null });
      return;
    }
    const startAt = toUtcIso(data.scheduledDate, data.timeSlot);
    if (!startAt) {
      setAvailability({ state: 'idle', conflict: null });
      return;
    }
    if (new Date(startAt) <= new Date()) {
      setAvailability({ state: 'idle', conflict: null });
      return;
    }

    setAvailability({ state: 'checking', conflict: null });
    if (availabilityTimer.current) clearTimeout(availabilityTimer.current);
    availabilityTimer.current = setTimeout(async () => {
      try {
        const res = await api.checkAvailability({
          startAt,
          durationMinutes: SESSION_DURATION_MINUTES,
        });
        if (res?.data?.available) {
          setAvailability({ state: 'available', conflict: null });
        } else {
          setAvailability({
            state: 'conflict',
            conflict: res?.data?.conflict || null,
          });
        }
      } catch {
        setAvailability({ state: 'error', conflict: null });
      }
    }, 350);

    return () => {
      if (availabilityTimer.current) clearTimeout(availabilityTimer.current);
    };
  }, [data.scheduledDate, data.timeSlot, step]);

  // Helpers
  const updateParent = (field, value) =>
    setData((d) => ({ ...d, parent: { ...d.parent, [field]: value } }));

  const updateStudent = (idx, field, value) => {
    setData((d) => {
      const students = [...d.students];
      students[idx] = { ...students[idx], [field]: value };
      return { ...d, students };
    });
  };

  const addStudent = () => {
    if (data.students.length >= 5) return;
    setData((d) => ({
      ...d,
      students: [...d.students, { name: '', age: '', gradeOrClass: '', learningChallenges: '' }],
    }));
  };

  const removeStudent = (idx) => {
    if (data.students.length <= 1) return;
    setData((d) => ({ ...d, students: d.students.filter((_, i) => i !== idx) }));
  };

  const toggleSubject = (subject) => {
    setData((d) => ({
      ...d,
      subjects: d.subjects.includes(subject)
        ? d.subjects.filter((s) => s !== subject)
        : [...d.subjects, subject],
    }));
  };

  const setSessionType = (type) => {
    setData((d) => {
      let students = d.students;
      if (type === 'INDIVIDUAL' && students.length > 1) {
        students = [students[0]];
      } else if (type === 'GROUP' && students.length < 2) {
        students = [...students, { name: '', age: '', gradeOrClass: '', learningChallenges: '' }];
      }
      return { ...d, sessionType: type, students };
    });
  };

  const groupDiscount = (() => {
    if (data.sessionType !== 'GROUP') return 0;
    const c = data.students.length;
    return c === 2 ? 10 : c === 3 ? 15 : c === 4 ? 20 : c === 5 ? 25 : 0;
  })();

  // Validation per step
  const validateStep = () => {
    if (step === 1) {
      if (!data.sessionType || !data.curriculum) {
        toast.error('Please select session type and curriculum');
        return false;
      }
      if (data.sessionType === 'GROUP' && (data.students.length < 2 || data.students.length > 5)) {
        toast.error('Group sessions require 2 to 5 students');
        return false;
      }
    }
    if (step === 2) {
      const p = data.parent;
      if (!p.fullName || p.fullName.length < 2) {
        toast.error('Please enter parent full name');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        toast.error('Please enter a valid email');
        return false;
      }
      if (!/^(\+?254|0)(7|1)\d{8}$/.test(p.phone.replace(/\s+/g, ''))) {
        toast.error('Please enter a valid Kenyan phone (e.g. 0726555444)');
        return false;
      }
    }
    if (step === 3) {
      for (const s of data.students) {
        if (!s.name || !s.age || !s.gradeOrClass) {
          toast.error('Please fill all required student fields');
          return false;
        }
        if (Number(s.age) < 3 || Number(s.age) > 25) {
          toast.error('Student age must be between 3 and 25');
          return false;
        }
      }
      if (data.subjects.length === 0) {
        toast.error('Please select at least one subject');
        return false;
      }
    }
    if (step === 4) {
      if (!data.scheduledDate) {
        toast.error('Please pick a date');
        return false;
      }
      if (!data.timeSlot) {
        toast.error('Please pick a time slot');
        return false;
      }
      const picked = new Date(`${data.scheduledDate}T${data.timeSlot}:00`);
      if (picked < new Date()) {
        toast.error('Please pick a future date and time');
        return false;
      }
      if (availability.state === 'conflict') {
        toast.error(
          'That time overlaps an existing booking. Please pick another time.'
        );
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 5));
  };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const startAt = toUtcIso(data.scheduledDate, data.timeSlot);
      const payload = {
        parent: data.parent,
        students: data.students.map((s) => ({
          ...s,
          age: Number(s.age),
        })),
        sessionType: data.sessionType,
        curriculum: data.curriculum,
        subjects: data.subjects,
        startAt,
        timezone,
        durationMinutes: SESSION_DURATION_MINUTES,
        notes: data.notes,
        isFreeTrialed: true,
      };
      const res = await api.createBooking(payload);
      setCompletedBooking(res.data);
      setStep(5);
      toast.success('Booking received! Check your email.');
    } catch (err) {
      toast.error(err.message || 'Could not submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (completedBooking) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-navy-50/30 to-white py-16">
        <div className="container-custom max-w-2xl">
          <div className="rounded-3xl bg-white border-2 border-gold-300 shadow-gold-lg p-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient animate-fade-in">
              <PartyPopper className="h-10 w-10 text-navy-900" strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900 mb-3">
              Booking <span className="gradient-text">Received!</span>
            </h1>
            <p className="text-navy-600 text-lg mb-2">
              Thank you, <strong>{completedBooking.parent.fullName.split(' ')[0]}</strong>!
            </p>
            <p className="text-navy-600 mb-8">
              We've sent a confirmation to <strong className="text-navy-900">{completedBooking.parent.email}</strong>.
              Our team will reach out within 24 hours to confirm your session.
            </p>

            <div className="rounded-2xl bg-navy-50/60 p-5 text-left mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-2">
                Booking Summary
              </p>
              <p className="text-sm text-navy-700">
                <strong>Booking ID:</strong>{' '}
                <code className="bg-white px-2 py-0.5 rounded text-xs">{completedBooking.id}</code>
              </p>
              <p className="text-sm text-navy-700 mt-1">
                <strong>Session:</strong> {completedBooking.sessionType === 'GROUP' ? `Group (${completedBooking.students.length} students)` : 'Individual'} · {completedBooking.curriculum}
              </p>
              <p className="text-sm text-navy-700 mt-1">
                <strong>Date:</strong>{' '}
                {new Date(completedBooking.startAt || completedBooking.scheduledDate).toLocaleDateString('en-KE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: completedBooking.timezone || undefined,
                })}
              </p>
              <p className="text-sm text-navy-700 mt-1">
                <strong>Time:</strong> {completedBooking.timeSlot.startTime} – {completedBooking.timeSlot.endTime}
                {completedBooking.timezone && (
                  <span className="text-navy-500"> · {completedBooking.timezone}</span>
                )}
              </p>
            </div>

            <Link href="/" className="btn-primary">
              Back to Home
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-hero-gradient text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-sparkle" />
        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-sm font-semibold text-gold-300 mb-4 border border-gold-400/30">
              <Sparkles className="h-4 w-4" />
              FREE 45-min Trial · Less than 2 minutes
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-2">
              Book Your <span className="gradient-text">Free Trial</span>
            </h1>
            <p className="text-navy-100">
              Tell us about your child and we'll set up the perfect first session.
            </p>
          </div>

          {/* Stepper */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              {['Session', 'Parent', 'Students', 'Schedule'].map((label, idx) => {
                const n = idx + 1;
                const active = step === n;
                const done = step > n;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm transition-all
                          ${done ? 'bg-gold-gradient text-navy-900' :
                            active ? 'bg-white text-navy-900 ring-4 ring-gold-400/50' :
                            'bg-navy-700 text-navy-200'}`}
                      >
                        {done ? <CheckCircle2 className="h-5 w-5" /> : n}
                      </div>
                      <p className={`mt-2 text-xs font-semibold hidden sm:block ${
                        active || done ? 'text-gold-300' : 'text-navy-300'
                      }`}>
                        {label}
                      </p>
                    </div>
                    {idx < 3 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full ${
                        done ? 'bg-gold-gradient' : 'bg-navy-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="rounded-3xl border-2 border-navy-100 bg-white p-6 md:p-10 shadow-sm">

            {/* STEP 1: SESSION TYPE & CURRICULUM */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-2">
                    Choose your session type
                  </h2>
                  <p className="text-navy-600 mb-6">
                    Group sessions get an automatic discount based on size.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSessionType('INDIVIDUAL')}
                      className={`text-left rounded-2xl border-2 p-5 transition-all ${
                        data.sessionType === 'INDIVIDUAL'
                          ? 'border-gold-400 bg-gold-50 shadow-md'
                          : 'border-navy-100 hover:border-gold-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient">
                          <User className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="font-bold text-navy-900">Individual</h3>
                          <p className="text-sm text-navy-600 mt-1">
                            One student · Maximum focus and personalization
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSessionType('GROUP')}
                      className={`text-left rounded-2xl border-2 p-5 transition-all relative ${
                        data.sessionType === 'GROUP'
                          ? 'border-gold-400 bg-gold-50 shadow-md'
                          : 'border-navy-100 hover:border-gold-200'
                      }`}
                    >
                      <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2 py-0.5 text-[10px] font-bold text-navy-900">
                        <Sparkles className="h-2.5 w-2.5" />
                        DISCOUNT
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient">
                          <Users className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="font-bold text-navy-900">Group (2–5)</h3>
                          <p className="text-sm text-navy-600 mt-1">
                            Save 10–25% with auto group discount
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-2">
                    Which curriculum?
                  </h2>
                  <p className="text-navy-600 mb-6">
                    Pick the curriculum your child is enrolled in. We support
                    all major systems.
                  </p>

                  <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                    {Object.keys(SUBJECT_OPTIONS).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, curriculum: curr, subjects: [] }))}
                        className={`rounded-2xl border-2 p-4 transition-all ${
                          data.curriculum === curr
                            ? 'border-gold-400 bg-gold-50 shadow-md'
                            : 'border-navy-100 hover:border-gold-200'
                        }`}
                      >
                        <GraduationCap className="h-6 w-6 text-gold-500 mx-auto mb-2" />
                        <p className="font-display font-bold text-lg text-navy-900">{curr}</p>
                        <p className="text-[11px] text-navy-500 mt-1 leading-tight">
                          {CURRICULUM_LABELS[curr]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PARENT */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-2">
                    Parent / Guardian Details
                  </h2>
                  <p className="text-navy-600">We'll send confirmations and updates to this contact.</p>
                </div>

                <div>
                  <label className="label-field">Full Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Mary Wanjiku"
                    value={data.parent.fullName}
                    onChange={(e) => updateParent('fullName', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label-field">Email *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="parent@example.com"
                      value={data.parent.email}
                      onChange={(e) => updateParent('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-field">Phone *</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="0726555444"
                      value={data.parent.phone}
                      onChange={(e) => updateParent('phone', e.target.value)}
                    />
                    <p className="text-xs text-navy-500 mt-1">
                      Kenyan format: 0726555444 or +254726555444
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: STUDENTS + SUBJECTS */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-display text-2xl font-extrabold text-navy-900">
                        Student{data.students.length > 1 ? 's' : ''} ({data.students.length})
                      </h2>
                      {data.sessionType === 'GROUP' && (
                        <p className="text-sm text-navy-600">
                          Group sessions: 2–5 students · Currently <strong className="text-gold-600">{groupDiscount}%</strong> discount
                        </p>
                      )}
                    </div>
                    {data.sessionType === 'GROUP' && data.students.length < 5 && (
                      <button
                        type="button"
                        onClick={addStudent}
                        className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-4 py-2 text-sm font-bold text-navy-900 shadow-gold hover:shadow-gold-lg"
                      >
                        <Plus className="h-4 w-4" />
                        Add Student
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {data.students.map((s, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border-2 border-navy-100 p-5 bg-navy-50/30"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-gold-600">
                            Student {idx + 1}
                          </p>
                          {data.students.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStudent(idx)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Remove student"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div>
                            <label className="label-field text-xs">Name *</label>
                            <input
                              type="text"
                              className="input-field py-2.5 text-sm"
                              placeholder="Student name"
                              value={s.name}
                              onChange={(e) => updateStudent(idx, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label-field text-xs">Age *</label>
                            <input
                              type="number"
                              min="3"
                              max="25"
                              className="input-field py-2.5 text-sm"
                              placeholder="e.g. 10"
                              value={s.age}
                              onChange={(e) => updateStudent(idx, 'age', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label-field text-xs">Grade / Class *</label>
                            <input
                              type="text"
                              className="input-field py-2.5 text-sm"
                              placeholder="e.g. Grade 5 / Year 7"
                              value={s.gradeOrClass}
                              onChange={(e) => updateStudent(idx, 'gradeOrClass', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="label-field text-xs">
                            Learning challenges (optional)
                          </label>
                          <input
                            type="text"
                            className="input-field py-2.5 text-sm"
                            placeholder="e.g. Struggles with fractions, dyslexia, exam anxiety..."
                            value={s.learningChallenges}
                            onChange={(e) => updateStudent(idx, 'learningChallenges', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-extrabold text-navy-900 mb-2">
                    Subjects needed *
                  </h3>
                  <p className="text-sm text-navy-600 mb-4">
                    Select all that apply ({data.subjects.length} selected)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS[data.curriculum].map((subj) => {
                      const selected = data.subjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => toggleSubject(subj)}
                          className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                            selected
                              ? 'border-gold-400 bg-gold-gradient text-navy-900 shadow-gold'
                              : 'border-navy-200 bg-white text-navy-700 hover:border-gold-300'
                          }`}
                        >
                          {selected && '✓ '}
                          {subj}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULE */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-2">
                    When works for you?
                  </h2>
                  <p className="text-navy-600">
                    Free trial sessions are <strong>45 minutes</strong>. We are
                    available <strong className="text-navy-900">24 hours a day</strong>
                    — pick any time that suits your family.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border-2 border-gold-200 bg-gold-50 p-3 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient flex-shrink-0">
                    <Globe2 className="h-4 w-4 text-navy-900" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-navy-900">
                      Times shown in your local timezone
                    </p>
                    <p className="text-navy-600 text-xs">
                      <span className="font-mono font-semibold">{timezone}</span>
                      {tzOffsetLabel && (
                        <span className="text-navy-500"> · {tzOffsetLabel}</span>
                      )}
                      {' '}— we'll book it as the absolute moment in time, so
                      your tutor sees it in their zone too.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label-field flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gold-500" />
                      Preferred date *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                      value={data.scheduledDate}
                      onChange={(e) => setData((d) => ({ ...d, scheduledDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="label-field">Preferred time *</label>
                    <input
                      type="time"
                      className="input-field"
                      value={data.timeSlot}
                      onChange={(e) => setData((d) => ({ ...d, timeSlot: e.target.value }))}
                    />
                    <p className="text-xs text-navy-500 mt-1">
                      Any time works — we operate around the clock.
                    </p>
                  </div>
                </div>

                {data.scheduledDate && data.timeSlot && (() => {
                  const startIso = toUtcIso(data.scheduledDate, data.timeSlot);
                  if (!startIso) return null;
                  const endLocal = new Date(
                    new Date(startIso).getTime() + SESSION_DURATION_MINUTES * 60 * 1000
                  );
                  const endTimeLocal = endLocal.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hourCycle: 'h23',
                  });
                  const formatConflictTime = (iso) =>
                    new Date(iso).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23',
                    });

                  let panelClasses =
                    'rounded-xl border-2 p-3 flex items-start gap-3 text-sm';
                  let icon = <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />;
                  let title = 'This slot is open';
                  let body = (
                    <>
                      Your session: <strong>{data.timeSlot}</strong> →{' '}
                      <strong>{endTimeLocal}</strong> ({SESSION_DURATION_MINUTES} min) in {timezone}.
                    </>
                  );

                  if (availability.state === 'checking') {
                    panelClasses += ' border-navy-200 bg-navy-50/50 text-navy-700';
                    icon = (
                      <Loader2 className="h-5 w-5 text-navy-500 mt-0.5 flex-shrink-0 animate-spin" />
                    );
                    title = 'Checking availability...';
                    body = (
                      <>
                        Your session would run <strong>{data.timeSlot}</strong> →{' '}
                        <strong>{endTimeLocal}</strong> ({SESSION_DURATION_MINUTES} min) in {timezone}.
                      </>
                    );
                  } else if (availability.state === 'available') {
                    panelClasses += ' border-green-200 bg-green-50 text-green-800';
                  } else if (availability.state === 'conflict') {
                    panelClasses += ' border-red-200 bg-red-50 text-red-800';
                    icon = <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />;
                    title = 'That time overlaps an existing booking';
                    const c = availability.conflict;
                    body = c ? (
                      <>
                        Our tutor is occupied from{' '}
                        <strong>{formatConflictTime(c.startAt)}</strong> to{' '}
                        <strong>{formatConflictTime(c.endAt)}</strong> (your time).
                        Please pick a non-overlapping slot.
                      </>
                    ) : (
                      <>
                        Please pick a different start time — overlaps an existing
                        session.
                      </>
                    );
                  } else if (availability.state === 'error') {
                    panelClasses += ' border-yellow-200 bg-yellow-50 text-yellow-800';
                    icon = <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />;
                    title = "Couldn't check availability";
                    body = (
                      <>
                        We'll re-check when you submit. Your session: {data.timeSlot} → {endTimeLocal}.
                      </>
                    );
                  } else {
                    panelClasses += ' border-navy-100 bg-navy-50/50 text-navy-700';
                    icon = (
                      <Calendar className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    );
                    title = 'Session preview';
                  }

                  return (
                    <div className={panelClasses}>
                      {icon}
                      <div className="flex-1">
                        <p className="font-bold">{title}</p>
                        <p className="text-xs mt-0.5">{body}</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="rounded-xl bg-navy-50/50 border border-navy-100 p-3 flex items-center gap-3 text-sm text-navy-700">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient flex-shrink-0">
                    <Calendar className="h-4 w-4 text-navy-900" strokeWidth={2.5} />
                  </div>
                  <span>
                    Quick picks:&nbsp;
                    {['08:00', '14:00', '18:00', '21:00'].map((q, i, arr) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, timeSlot: q }))}
                        className="text-gold-700 hover:text-gold-800 font-bold underline-offset-2 hover:underline"
                      >
                        {q}{i < arr.length - 1 ? ' · ' : ''}
                      </button>
                    ))}
                  </span>
                </div>

                <div>
                  <label className="label-field">Notes / special requests (optional)</label>
                  <textarea
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Anything else we should know? Special accommodations, learning style preferences, etc."
                    value={data.notes}
                    onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
                  />
                </div>

                {/* Summary */}
                <div className="rounded-2xl bg-gradient-to-br from-gold-50 to-white border-2 border-gold-200 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gold-700 mb-2">
                    Booking Summary
                  </p>
                  <div className="text-sm space-y-1 text-navy-700">
                    <p><strong>Session:</strong> {data.sessionType === 'GROUP' ? `Group (${data.students.length} students, ${groupDiscount}% off)` : 'Individual'}</p>
                    <p><strong>Curriculum:</strong> {data.curriculum}</p>
                    <p><strong>Subjects:</strong> {data.subjects.join(', ') || '—'}</p>
                    <p><strong>Trial:</strong> FREE · 45 minutes</p>
                  </div>
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-navy-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={back}
                  className="btn-outline-navy"
                  disabled={submitting}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </button>
              ) : <div />}

              {step < 4 ? (
                <button type="button" onClick={next} className="btn-primary">
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <CheckCircle2 className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
