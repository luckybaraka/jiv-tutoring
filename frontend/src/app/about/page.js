import Link from 'next/link';
import {
  Heart,
  Target,
  Award,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'About Us — Our Team of Certified Educators',
  description:
    'Meet the JIV Tutoring team — certified, passionate teachers led by Joan Theresa. Dedicated to helping every Kenyan child thrive academically.',
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
                  Whether your child is following the{' '}
                  <strong className="text-navy-900">CBC</strong> or{' '}
                  <strong className="text-navy-900">IGCSE</strong> curriculum,
                  is fully homeschooled, or just needs an extra hand with
                  homework — our team is here to support them.
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

      {/* MEET JOAN */}
      <section className="section-padding bg-gradient-to-b from-navy-50/40 to-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-3">
              Leading the Team
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-navy-900">
              Meet <span className="gradient-text">Joan Theresa</span>
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-5 items-center">
            <div className="lg:col-span-2">
              <div className="relative mx-auto max-w-sm">
                <div className="absolute inset-0 -m-3 rounded-3xl bg-gold-gradient opacity-30 blur-2xl" />
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-4 border-gold-400 shadow-gold-lg bg-navy-800">
                  <div className="flex h-full w-full items-center justify-center p-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gold-gradient">
                        <GraduationCap className="h-12 w-12 text-navy-900" strokeWidth={2} />
                      </div>
                      <p className="text-gold-300 font-display font-bold text-2xl">
                        Joan Theresa
                      </p>
                      <p className="text-navy-200 text-sm mt-2">
                        Founder & Lead Educator
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-3 py-1 text-xs font-semibold text-gold-300 border border-gold-400/30">
                        <Award className="h-3 w-3" />
                        Certified & Dedicated Tutor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-5 text-navy-700 leading-relaxed text-lg">
              <p>
                <strong className="text-navy-900">Joan Theresa</strong> is the
                founder and lead educator behind JIV Tutoring Services. As a
                certified teacher with deep experience in both the CBC and IGCSE
                curricula, Joan has spent years helping children unlock their
                potential — one lesson at a time.
              </p>
              <p>
                She built JIV Tutoring around a vision of education that is
                <strong className="text-navy-900"> personal, kind, and effective.</strong>{' '}
                Today, she leads a team of like-minded educators who share her
                standards and her heart for children.
              </p>
              <p>
                Joan personally vets every tutor on the JIV team, ensures the
                quality of every session, and stays directly involved with the
                families we serve. When you book with JIV, you are joining a
                community led by someone who genuinely cares about your child's
                success.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  'CBC Specialist',
                  'IGCSE Certified',
                  'Special Needs Trained',
                  'Years of Experience',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1.5 text-xs font-bold text-gold-800"
                  >
                    <Sparkles className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
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
              Every educator on the JIV team is hand-picked by Joan and shares
              our commitment to compassion, professionalism, and results.
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
                desc: 'Specialists in CBC, IGCSE, and homeschooling pedagogy — your child is in the right hands.',
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
