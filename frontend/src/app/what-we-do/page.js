import Link from 'next/link';
import {
  BookOpen,
  Users,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Trophy,
  ArrowRight,
  GraduationCap,
  Brain,
  Calculator,
  FlaskConical,
  Globe,
} from 'lucide-react';

export const metadata = {
  title: 'What We Do — Tutoring Services & Subjects',
  description:
    'Online tutoring, homeschooling, group sessions, homework help and special needs support — for CBC and IGCSE students across Kenya.',
};

const services = [
  {
    icon: BookOpen,
    title: 'Homeschooling Support',
    desc: 'Full curriculum delivery for families who choose to educate at home. Structured lesson plans, regular assessments, and a teacher who walks the journey with you.',
    features: ['Full CBC or IGCSE coverage', 'Daily/weekly schedule design', 'Progress tracking', 'Parent reports'],
  },
  {
    icon: HeartHandshake,
    title: 'One-on-One Private Tuition',
    desc: 'Undivided attention from a teacher who knows your child. The fastest way to close gaps, build confidence, and accelerate progress.',
    features: ['Customized lesson plans', 'Flexible scheduling', 'In-home or online', 'Direct parent updates'],
  },
  {
    icon: Users,
    title: 'Group Tutoring (2–5 Students)',
    desc: 'Small group sessions where children learn together — and you save through automatic group discounts.',
    features: ['10% off for 2 students', '15% off for 3', '20% off for 4', '25% off for 5'],
    highlight: true,
  },
  {
    icon: CheckCircle2,
    title: 'Homework Assistance',
    desc: 'Daily homework guidance that builds independent thinking. Your child finishes their work — and understands it.',
    features: ['Same-day support', 'Concept explanations', 'Study techniques', 'Exam prep'],
  },
  {
    icon: Sparkles,
    title: 'Special Needs Learning Support',
    desc: 'Compassionate, specialized tutors trained to support diverse learning needs with patience and structure.',
    features: ['Individualized pace', 'Sensory-aware teaching', 'Confidence building', 'Family-centered approach'],
  },
  {
    icon: Trophy,
    title: 'Improved Study Skills & Confidence',
    desc: 'Beyond grades — we teach the lifelong habits that turn struggling students into self-driven learners.',
    features: ['Time management', 'Note-taking strategies', 'Test-taking skills', 'Goal setting'],
  },
];

const subjects = [
  { icon: Calculator, name: 'Mathematics' },
  { icon: BookOpen, name: 'English & Literature' },
  { icon: FlaskConical, name: 'Sciences' },
  { icon: Globe, name: 'Social Studies' },
  { icon: Brain, name: 'Kiswahili' },
  { icon: GraduationCap, name: 'And more...' },
];

export default function WhatWeDoPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-sparkle" />
        <div className="container-custom relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-sm font-semibold text-gold-300 mb-6 border border-gold-400/30">
            <Sparkles className="h-4 w-4" />
            Our Services
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            What <span className="gradient-text">We Do</span>
          </h1>
          <p className="text-navy-100 text-lg max-w-3xl mx-auto">
            From full homeschooling programs to single homework sessions — we
            meet your family where you are and tailor support to your child's needs.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className={`card group hover:-translate-y-1 ${
                  service.highlight
                    ? 'ring-2 ring-gold-400 bg-gradient-to-br from-gold-50 to-white'
                    : ''
                }`}
              >
                {service.highlight && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-navy-900 mb-3">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                )}
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7 text-navy-900" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-navy-600 leading-relaxed mb-4">
                  {service.desc}
                </p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-navy-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULA */}
      <section className="section-padding bg-navy-50/30">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              Curricula We Cover
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900">
              CBC <span className="text-gold-500">&</span> IGCSE — Done Right
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-hero-gradient text-white p-8 relative overflow-hidden shadow-navy">
              <div className="absolute inset-0 bg-sparkle" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/20 px-3 py-1 text-xs font-bold text-gold-300 border border-gold-400/30 mb-4">
                  KENYAN CURRICULUM
                </div>
                <h3 className="font-display text-3xl font-extrabold mb-3 text-gold-300">
                  CBC
                </h3>
                <p className="text-navy-100 mb-4 leading-relaxed">
                  Competency-Based Curriculum support for PP1 through Grade 9
                  and beyond. Our tutors understand the CBC framework deeply
                  and align lessons to learning areas, core competencies, and
                  formative assessments.
                </p>
                <ul className="space-y-2 text-sm text-navy-100">
                  {['Mathematics', 'English', 'Kiswahili', 'Sciences & Technology', 'Social Studies'].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-gold-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-gold-100 to-white border-2 border-gold-300 p-8 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 rounded-full bg-navy-700 px-3 py-1 text-xs font-bold text-gold-300 mb-4">
                INTERNATIONAL CURRICULUM
              </div>
              <h3 className="font-display text-3xl font-extrabold mb-3 text-navy-900">
                IGCSE
              </h3>
              <p className="text-navy-700 mb-4 leading-relaxed">
                Cambridge IGCSE preparation that goes beyond memorization. We
                develop the critical thinking, structured writing, and exam
                technique your child needs to excel internationally.
              </p>
              <ul className="space-y-2 text-sm text-navy-700">
                {['Mathematics (Core / Extended)', 'English (First & Second Lang.)', 'Sciences (Biology, Chemistry, Physics)', 'ICT & Computer Science', 'Business & Economics'].map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gold-600" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              Subjects We Teach
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900">
              Comprehensive <span className="gradient-text">Subject Coverage</span>
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="card text-center hover:-translate-y-1 hover:bg-gold-50"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 group-hover:bg-gold-200">
                  <subject.icon className="h-6 w-6 text-navy-700" strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-navy-900">{subject.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy-50/30">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900 mb-4">
            Find the right fit for your child
          </h2>
          <p className="text-navy-600 text-lg mb-8">
            Not sure which service is right? Book a FREE trial and let's figure it out together.
          </p>
          <Link href="/book" className="btn-primary text-base">
            Book Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
