'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendContact(form);
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-sparkle" />
        <div className="container-custom relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-sm font-semibold text-gold-300 mb-6 border border-gold-400/30">
            <Sparkles className="h-4 w-4" />
            We'd love to hear from you
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-navy-100 text-lg max-w-3xl mx-auto">
            Have a question? Need guidance choosing the right service? Reach
            out anytime — our team is available 24/7 and we usually respond
            within minutes.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* CONTACT CARDS */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-4">
                Reach us directly
              </h2>

              {[
                {
                  icon: Phone,
                  label: 'Call Us',
                  value: '+254 726 555 444',
                  href: 'tel:+254726555444',
                  desc: 'Available 24 hours, every day',
                },
                {
                  icon: MessageCircle,
                  label: 'WhatsApp',
                  value: '+254 726 555 444',
                  href: 'https://wa.me/254726555444',
                  desc: 'Fastest way to reach us',
                  external: true,
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'info@jivtutoring.com',
                  href: 'mailto:info@jivtutoring.com',
                  desc: "Replies typically within an hour",
                },
                {
                  icon: MapPin,
                  label: 'Where We Serve',
                  value: 'Worldwide',
                  desc: 'Online sessions globally · in-home where available',
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href || '#'}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="block rounded-2xl border-2 border-navy-100 p-5 transition-all hover:border-gold-300 hover:shadow-md group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-navy-900" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold-600">
                        {item.label}
                      </p>
                      <p className="font-bold text-navy-900 text-lg break-all">
                        {item.value}
                      </p>
                      <p className="text-sm text-navy-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* FORM */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl bg-gradient-to-br from-navy-50/40 to-white border-2 border-navy-100 p-8">
                <h2 className="font-display text-2xl font-extrabold text-navy-900 mb-2">
                  Send a Message
                </h2>
                <p className="text-navy-600 mb-6">
                  Fill out the form and we'll be in touch.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label-field">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Your name"
                      required
                      minLength={2}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-field">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-field">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+1 555 123 4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Your Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help..."
                      required
                      minLength={5}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
