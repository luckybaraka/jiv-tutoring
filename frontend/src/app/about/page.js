import Link from 'next/link';
import {
  Heart,
  Target,
  Award,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Globe2,
  BookOpen,
} from 'lucide-react';

export const metadata = {
  title: 'About Us — Our Team of Certified Educators',
  description:
    'JIV Tutoring is a collective of certified, caring educators delivering personalized tutoring and homeschooling across CBC, CBE, IGCSE, GCSE, MYP/IB and American curricula — available 24/7.',
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-sparkle" />
        <div className="container-custom relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-sm font-semibold text-gold-300 mb-6 border border-gold-400/30">
            <Sparkles className="h-4 w-4" />
            About JIV Tutoring
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            A Team of <span className="gradient-text">Passionate Educators</span>
          </h1>
          <p className="text-navy-100 text-lg max-w-3xl mx-auto">
            JIV Tutoring is a collective of certified, caring teachers united by
            one belief: every child deserves to learn with confidence.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900 mb-6">
                Education that <span className="gradient-text">starts with the child</span>
              </h2>
              <div className="space-y-4 text-navy-700 leading-relaxed text-lg">
                <p>
                  JIV Tutoring Services was founded with a simple but powerful idea —
                  that learning should be personal, patient, and inspiring. Today,
                  we are a growing team of certified educators serving families
                  across Kenya through both online and in-home tutoring.
                </p>
                <p>
                  Every teacher on our team shares the same commitment: to listen
                  to each child, understand their unique learning style, and adapt
                  to their pace. We don't just teach subjects — we build confidence,
                  curiosity, and the lifelong habits of strong learners.
                </p>
                <p>
                  Whether your child follows the{' '}
                  <strong className="text-navy-900">CBC</strong>,{' '}
                  <strong className="text-navy-900">CBE</strong>,{' '}
                  <strong className="text-navy-900">IGCSE</strong>,{' '}
                  <strong className="text-navy-900">GCSE</strong>,{' '}
                  <strong className="text-navy-900">MYP/IB</strong>, or{' '}
                  <strong className="text-navy-900">American</strong> curriculum
                  — is fully homeschooled, or just needs a hand with homework
                  — our team is here, around the clock.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Heart,
                  title: 'Our Mission',
                  desc: 'To empower every child in Kenya to learn with confidence, joy, and purpose — through personalized education delivered by teachers who truly care.',
                },
                {
                  icon: Target,
                  title: 'Our Vision',
                  desc: 'A Kenya where no child falls behind because of how they learn — where every learner has access to compassionate, certified educators who meet them where they are.',
                },
                {
                  icon: Award,
                  title: 'Our Values',
                  desc: 'Patience. Excellence. Integrity. We treat every child as if they were our own, and every parent as a partner in their child\'s journey.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border-2 border-navy-100 bg-gradient-to-br from-white to-navy-50/50 p-6 hover:border-gold-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient flex-shrink-0">
                      <item.icon className="h-6 w-6 text-navy-900" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy-900 text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-navy-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section-padding bg-gradient-to-b from-navy-50/40 to-white">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              How We Work
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900">
              A Service Built on <span className="gradient-text">Standards, Not Personalities</span>
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-navy-600 text-lg">
              JIV Tutoring is an organisation, not an individual. Every tutor
              you meet is held to the same vetting, training, and quality
              standards — so the experience is consistent, no matter who is
              teaching your child.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Rigorously Vetted',
                desc: 'Every educator passes interviews, certification checks, and a teaching demo before joining the team.',
              },
              {
                icon: Globe2,
                title: 'Curriculum-Trained',
                desc: 'Our tutors specialise in CBC, CBE, IGCSE, GCSE, MYP/IB, and the American curriculum — matched to your child.',
              },
              {
                icon: Clock,
                title: 'Always Available',
                desc: '24/7 booking and tutoring across time zones. Early mornings, late nights, weekends — we are on.',
              },
              {
                icon: Heart,
                title: 'Quality Assured',
                desc: 'Sessions are reviewed, parent feedback is tracked, and tutors are continuously coached to maintain excellence.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card text-center group hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient group-hover:scale-110 transition-transform">
                  <item.icon className="h-7 w-7 text-navy-900" strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-bold text-navy-900 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-navy-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { code: 'CBC', label: 'Competency-Based Curriculum' },
              { code: 'CBE', label: 'Competency-Based Education' },
              { code: 'IGCSE', label: 'Cambridge International' },
              { code: 'GCSE', label: 'General Certificate (UK)' },
              { code: 'MYP/IB', label: 'International Baccalaureate' },
              { code: 'American', label: 'US Curriculum' },
            ].map((c) => (
              <div
                key={c.code}
                className="rounded-xl border-2 border-navy-100 bg-white p-4 flex items-center gap-3 hover:border-gold-300 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-gradient flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-display font-extrabold text-navy-900">
                    {c.code}
                  </p>
                  <p className="text-xs text-navy-500">{c.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM CULTURE */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              Our Team
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900">
              Teachers Who <span className="gradient-text">Truly Care</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-navy-600 text-lg">
              Every educator on the JIV team is hand-picked through a rigorous
              process and shares our commitment to compassion,
              professionalism, and results.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Hand-picked Educators',
                desc: 'Every tutor is interviewed, vetted, and trained to meet our standards before joining the team.',
              },
              {
                icon: GraduationCap,
                title: 'Curriculum Experts',
                desc: 'Specialists in CBC, CBE, IGCSE, GCSE, MYP/IB, American curricula and homeschooling pedagogy.',
              },
              {
                icon: Heart,
                title: 'Patient & Kind',
                desc: 'We believe a child learns best when they feel safe, seen, and supported. That is non-negotiable.',
              },
            ].map((item) => (
              <div key={item.title} className="card text-center group hover:-translate-y-1">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient group-hover:scale-110 transition-transform">
                  <item.icon className="h-7 w-7 text-navy-900" strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-bold text-navy-900 text-xl mb-2">
                  {item.title}
                </h3>
                <p className="text-navy-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy-50/30">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900 mb-4">
            Ready to meet our team?
          </h2>
          <p className="text-navy-600 text-lg mb-8">
            Book a FREE 45-minute trial and experience the JIV difference firsthand.
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
