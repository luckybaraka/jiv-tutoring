'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-hero-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-sparkle opacity-50" />
      <div className="container-custom relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient">
                <GraduationCap className="h-6 w-6 text-navy-900" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-extrabold">
                  JIV <span className="text-gold-400">Tutoring</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-gold-200/80">
                  Services
                </div>
              </div>
            </Link>
            <p className="text-sm text-navy-100 leading-relaxed">
              Empowering learners across Kenya with personalized tutoring
              and homeschooling, delivered by certified, caring teachers.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-gold-300 font-semibold uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/what-we-do', label: 'What We Do' },
                { href: '/news', label: 'Learning News' },
                { href: '/contact', label: 'Contact' },
                { href: '/book', label: 'Book Free Trial' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-navy-100 hover:text-gold-300 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-gold-300 font-semibold uppercase tracking-wider text-sm">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-navy-100">
              <li>Homeschooling Support</li>
              <li>One-on-One Private Tuition</li>
              <li>Group Tutoring (2–5)</li>
              <li>Homework Assistance</li>
              <li>Special Needs Support</li>
              <li>CBC & IGCSE Curriculum</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-gold-300 font-semibold uppercase tracking-wider text-sm">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-navy-100">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-gold-400 flex-shrink-0" />
                <a href="tel:+254726555444" className="hover:text-gold-300">
                  +254 726 555 444
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gold-400 flex-shrink-0" />
                <a
                  href="mailto:joantheresa26@gmail.com"
                  className="hover:text-gold-300 break-all"
                >
                  joantheresa26@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gold-400 flex-shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-700 pt-6 text-center text-sm text-navy-200">
          <p>
            © {new Date().getFullYear()} JIV Tutoring Services. All rights reserved.
            <span className="hidden sm:inline"> · Led by Joan Theresa, Certified Educator.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
