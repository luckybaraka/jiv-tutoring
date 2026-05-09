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
    'Online tutoring, homeschooling, group sessions, homework help and special needs support — across CBC, CBE, IGCSE, GCSE, MYP/IB and American curricula. Available 24/7.',
};

const services = [
  {
    icon: BookOpen,
    title: 'Homeschooling Support',
    desc: 'Full curriculum delivery for families who choose to educate at home. Structured lesson plans, regular assessments, and a teacher who walks the journey with you.',
    features: ['CBC, CBE, IGCSE, GCSE, MYP/IB or American', 'Daily/weekly schedule design', 'Progress tracking', 'Parent reports'],
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
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              Curricula We Cover
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900">
              Every Major Curriculum, <span className="gradient-text">Done Right</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-navy-600 text-lg">
              From local Kenyan systems to international standards — our
              tutors are certified across the curricula that matter to your
              family.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                code: 'CBC',
                tag: 'KENYA',
                desc: 'Competency-Based Curriculum support for PP1 through Grade 9 and beyond — aligned to learning areas, core competencies, and formative assessments.',
                subjects: ['Mathematics', 'English', 'Kiswahili', 'Sciences & Tech', 'Social Studies'],
                dark: true,
              },
              {
                code: 'CBE',
                tag: 'KENYA',
                desc: 'Competency-Based Education — the evolved Kenyan framework focused on senior school pathways and integrated, real-world learning.',
                subjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Pre-Technical'],
              },
              {
                code: 'IGCSE',
                tag: 'INTERNATIONAL',
                desc: 'Cambridge IGCSE preparation that goes beyond memorisation — structured writing, exam technique, and deep subject mastery.',
                subjects: ['Maths (Core/Extended)', 'English (1st & 2nd Lang.)', 'Sciences', 'ICT & CS', 'Business & Econ'],
                dark: true,
              },
              {
                code: 'GCSE',
                tag: 'UK',
                desc: 'UK General Certificate of Secondary Education — full coverage with mock exams, mark-scheme alignment, and topic-by-topic mastery.',
                subjects: ['Mathematics', 'English Language & Lit.', 'Sciences', 'Computer Science', 'History & Geography'],
              },
              {
                code: 'MYP / IB',
                tag: 'INTERNATIONAL',
                desc: 'International Baccalaureate Middle Years and Diploma — inquiry-based learning, ToK, Extended Essay coaching, and CAS guidance.',
                subjects: ['Lang. & Literature', 'Sciences', 'Individuals & Societies', 'Mathematics', 'Theory of Knowledge'],
                dark: true,
              },
              {
                code: 'American',
                tag: 'USA',
                desc: 'US Curriculum K–12 plus AP courses, SAT and ACT preparation. Built for students applying to colleges in the United States.',
                subjects: ['Algebra · Geometry · Calculus', 'English / Language Arts', 'Sciences (Bio, Chem, Phys)', 'US & World History', 'SAT / ACT Prep'],
              },
            ].map((c) => (
              <div
                key={c.code}
                className={`rounded-2xl p-7 relative overflow-hidden ${
                  c.dark
                    ? 'bg-hero-gradient text-white shadow-navy'
                    : 'bg-gradient-to-br from-gold-50 to-white border-2 border-gold-200'
                }`}
              >
                {c.dark && <div className="absolute inset-0 bg-sparkle" />}
                <div className="relative">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold mb-4 ${
                      c.dark
                        ? 'bg-gold-400/20 text-gold-300 border border-gold-400/30'
                        : 'bg-navy-700 text-gold-300'
                    }`}
                  >
                    {c.tag}
                  </div>
                  <h3
                    className={`font-display text-2xl font-extrabold mb-3 ${
                      c.dark ? 'text-gold-300' : 'text-navy-900'
                    }`}
                  >
                    {c.code}
                  </h3>
                  <p
                    className={`mb-4 leading-relaxed text-sm ${
                      c.dark ? 'text-navy-100' : 'text-navy-700'
                    }`}
                  >
                    {c.desc}
                  </p>
                  <ul
                    className={`space-y-1.5 text-xs ${
                      c.dark ? 'text-navy-100' : 'text-navy-700'
                    }`}
                  >
                    {c.subjects.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <CheckCircle2
                          className={`h-3.5 w-3.5 flex-shrink-0 ${
                            c.dark ? 'text-gold-400' : 'text-gold-600'
                          }`}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
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
