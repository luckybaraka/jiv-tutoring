import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  BookOpen,
  Users,
  HeartHandshake,
  Star,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Clock,
} from 'lucide-react';

export const metadata = {
  title: 'JIV Tutoring Services — Online Tutoring & Homeschooling in Kenya',
  description:
    'Help your child learn with confidence. Certified, caring tutors for CBC and IGCSE. Book a FREE 45-minute trial today.',
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 bg-sparkle" />
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="container-custom relative py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-sm font-semibold text-gold-300 mb-6 border border-gold-400/30">
                <Sparkles className="h-4 w-4" />
                Certified, caring teachers · Led by Joan Theresa
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Online Tutoring{' '}
                <span className="gradient-text">&amp;</span>
                <br />
                Homeschooling
              </h1>
              <p className="mt-6 max-w-xl text-lg text-navy-100 leading-relaxed">
                Looking for{' '}
                <span className="font-semibold text-gold-300">
                  certified, caring, and experienced teachers
                </span>{' '}
                to support your child's learning? We provide personalized online
                and home-based tutoring to help children learn with confidence
                and achieve academic success.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book" className="btn-primary text-base">
                  Book FREE 45-min Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/what-we-do" className="btn-secondary">
                  What We Do
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
                {[
                  { icon: ShieldCheck, label: 'Certified Tutors' },
                  { icon: Trophy, label: 'CBC & IGCSE' },
                  { icon: Clock, label: 'Flexible Schedule' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-navy-100"
                  >
                    <item.icon className="h-5 w-5 text-gold-400" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 -m-4 rounded-full bg-gold-gradient opacity-20 blur-2xl" />
                <div className="relative aspect-square rounded-full overflow-hidden border-4 border-gold-400 shadow-gold-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-300/20 to-navy-700/40" />
                  <div className="flex h-full w-full items-center justify-center bg-navy-800">
                    <div className="text-center px-6">
                      <BookOpen className="h-20 w-20 text-gold-400 mx-auto mb-4" strokeWidth={1.5} />
                      <p className="text-gold-300 font-display font-bold text-2xl">
                        Empowering
                      </p>
                      <p className="text-white font-display font-bold text-3xl">
                        Young Minds
                      </p>
                      <p className="text-navy-200 text-sm mt-3">
                        One student at a time
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -bottom-4 -left-6 rounded-2xl bg-white p-4 shadow-xl border border-gold-200 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100">
                      <Star className="h-5 w-5 text-gold-500 fill-gold-500" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-bold text-sm">100% Trusted</p>
                      <p className="text-xs text-navy-500">By Kenyan Parents</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-2 rounded-2xl bg-white p-4 shadow-xl border border-navy-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100">
                      <CheckCircle2 className="h-5 w-5 text-navy-600" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-bold text-sm">FREE Trial</p>
                      <p className="text-xs text-navy-500">45 Minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STATS */}
      <section className="bg-white py-12 border-b border-navy-100">
        <div className="container-custom grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: '500+', label: 'Students Helped' },
            { value: '50+', label: 'Certified Teachers' },
            { value: '95%', label: 'Parent Satisfaction' },
            { value: '24/7', label: 'Parent Support' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold gradient-text font-display">
                {stat.value}
              </div>
              <div className="text-sm text-navy-600 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="section-padding bg-navy-50/30">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              What We Offer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-900">
              Personalized Learning, <br className="md:hidden" />
              <span className="gradient-text">Real Results</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-navy-600 text-lg">
              Every child learns differently. Our certified team adapts to each
              student's pace, building confidence alongside academic skill.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: 'Homeschooling Support',
                desc: 'Complete curriculum delivery for parents who choose to educate at home — structured, supportive, and proven.',
              },
              {
                icon: HeartHandshake,
                title: 'One-on-One Private Tuition',
                desc: 'Focused attention that addresses your child\'s exact strengths and gaps. Faster progress, deeper understanding.',
              },
              {
                icon: Users,
                title: 'Group Tutoring (2–5)',
                desc: 'Small group sessions where children learn together, ask questions freely, and benefit from automatic group discounts.',
              },
              {
                icon: CheckCircle2,
                title: 'Homework Assistance',
                desc: 'Daily homework guidance that builds independent thinking — not just answers.',
              },
              {
                icon: Sparkles,
                title: 'Special Needs Support',
                desc: 'Patient, specialized tutors trained to support diverse learning needs with care and structure.',
              },
              {
                icon: Trophy,
                title: 'Improved Study Skills',
                desc: 'Time management, note-taking, exam strategies — life-long skills that go beyond grades.',
              },
            ].map((item) => (
              <div key={item.title} className="card group hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-navy-900" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-navy-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-900">
              Get Started in <span className="gradient-text">3 Easy Steps</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Book Your Free Trial',
                desc: 'Fill in a simple form (under 2 minutes) telling us about your child and preferred schedule.',
              },
              {
                step: '02',
                title: 'Meet Your Tutor',
                desc: 'Join your free 45-minute trial session online or at home and see if it\'s the right fit.',
              },
              {
                step: '03',
                title: 'Watch Them Thrive',
                desc: 'Continue with regular sessions. Track progress, build confidence, and achieve real results.',
              },
            ].map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-extrabold gradient-text font-display opacity-90">
                  {item.step}
                </div>
                <h3 className="mt-2 text-xl font-bold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-navy-600">{item.desc}</p>
                {idx < 2 && (
                  <ArrowRight className="hidden md:block absolute top-6 -right-4 h-8 w-8 text-gold-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-sparkle" />
        <div className="container-custom relative">
          <div className="text-center mb-14">
            <p className="text-gold-400 font-bold uppercase tracking-wider text-sm mb-3">
              What Parents Say
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
              Stories of <span className="text-gold-400">Confidence Restored</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "My daughter went from dreading math to asking for extra problems. The patience and structure of her tutor made all the difference.",
                name: 'Mary W.',
                role: 'Parent, Grade 5 (CBC)',
              },
              {
                quote:
                  "We chose homeschooling and JIV gave us the structure we needed. Our son is now ahead in his IGCSE coursework and loves learning.",
                name: 'David K.',
                role: 'Parent, Year 9 (IGCSE)',
              },
              {
                quote:
                  "The group sessions are amazing — my twins learn together and the discount makes it affordable. Joan's team is exceptional.",
                name: 'Grace M.',
                role: 'Parent of twins',
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-gold-400/20 p-6"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-gold-400 fill-gold-400"
                    />
                  ))}
                </div>
                <p className="text-navy-100 italic mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-sm text-gold-300">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="rounded-3xl bg-hero-gradient p-10 md:p-14 text-center relative overflow-hidden shadow-navy">
            <div className="absolute inset-0 bg-sparkle" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to See Your Child <br className="md:hidden" />
                <span className="gradient-text">Learn with Confidence?</span>
              </h2>
              <p className="text-navy-100 max-w-2xl mx-auto mb-8 text-lg">
                Limited slots available. Book your FREE 45-minute trial session
                today and experience the difference personalized tutoring makes.
              </p>
              <Link href="/book" className="btn-primary text-base">
                Enroll Now — Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
