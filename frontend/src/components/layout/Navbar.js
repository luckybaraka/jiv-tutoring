'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/what-we-do', label: 'What We Do' },
  { href: '/news', label: 'Learning News' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur-md shadow-sm">
      <nav className="container-custom flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-hero-gradient shadow-navy group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6 text-gold-400" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-lg font-extrabold leading-tight text-navy-900">
              JIV <span className="text-gold-500">Tutoring</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-navy-500">
              Services
            </div>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'text-gold-600'
                      : 'text-navy-700 hover:text-navy-900'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/book" className="hidden lg:inline-flex btn-primary">
            Book Free Trial
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden rounded-lg p-2 text-navy-700 hover:bg-navy-50"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-navy-100 bg-white">
          <ul className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-3 font-semibold ${
                    pathname === link.href
                      ? 'bg-gold-50 text-gold-700'
                      : 'text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Book Free Trial
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
