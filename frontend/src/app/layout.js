import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'JIV Tutoring Services | Online Tutoring & Homeschooling in Kenya',
    template: '%s | JIV Tutoring Services',
  },
  description:
    'Personalized online tutoring and homeschooling support for CBC, CBE, IGCSE, GCSE, MYP/IB and American curriculum students. Certified, caring teachers available 24/7. Book a FREE 45-minute trial today.',
  keywords: [
    'homeschooling Kenya',
    'online tutoring CBC',
    'CBE tutor Kenya',
    'IGCSE tutor Kenya',
    'GCSE tutor',
    'IB MYP tutor',
    'American curriculum tutor',
    'private tutor Kenya',
    'homework help Nairobi',
    'special needs learning support',
    'group tutoring Kenya',
    '24/7 online tutoring',
    'JIV Tutoring',
  ],
  authors: [{ name: 'JIV Tutoring Services' }],
  creator: 'JIV Tutoring Services',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    title: 'JIV Tutoring Services | Online Tutoring & Homeschooling',
    description:
      'Certified, caring teachers helping your child learn with confidence — across CBC, CBE, IGCSE, GCSE, MYP/IB and American curricula. Homeschooling and special needs support, available 24/7.',
    siteName: 'JIV Tutoring Services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JIV Tutoring Services',
    description: 'Online tutoring and homeschooling in Kenya — book a FREE trial.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: '#0a1f5a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Structured data for SEO (schema.org EducationalOrganization)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'JIV Tutoring Services',
    description:
      'Personalized online tutoring and homeschooling support for CBC, CBE, IGCSE, GCSE, MYP/IB and American curriculum students. Available 24/7.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telephone: '+254726555444',
    email: 'info@jivtutoring.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressLocality: 'Nairobi',
    },
    sameAs: [],
    offers: {
      '@type': 'Offer',
      name: 'Free 45-minute trial session',
      price: '0',
      priceCurrency: 'KES',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0a1f5a',
              color: '#fff',
              border: '1px solid #fbbf24',
              padding: '14px 18px',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
