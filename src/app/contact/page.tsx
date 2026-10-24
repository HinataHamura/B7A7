'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(4, 'Subject is required'),
  category: z.enum(['general', 'listing', 'payment', 'technical', 'partnership'], {
    required_error: 'Please select a category',
  }),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@roomly.app',
    sub: 'Response within 24 hours',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+880 1700-000000',
    sub: 'Sunday–Thursday, 9am–6pm',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Dhanmondi, Dhaka 1205',
    sub: 'Bangladesh',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    icon: MessageCircle,
    label: 'Live Chat',
    value: 'Available in-app',
    sub: 'Mon–Sat, 8am–10pm',
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', category: 'general', message: '' },
  });

  const onSubmit = async (values: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.info('Contact form submission:', values);
    setSubmitted(true);
    toast.success('Message sent! We will get back to you within 24 hours.');
    form.reset();
  };

  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="bg-mesh-gradient py-16">
          <div className="container-shell">
            <div className="max-w-2xl">
              <span className="pill">Get in touch</span>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Let's talk about your next move.
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Have a question, feedback, or a partnership idea? Our team is ready to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="container-shell py-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="glass-panel p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-1 font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="container-shell pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="glass-panel p-8">
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">Message sent!</h2>
                  <p className="mt-3 max-w-sm text-slate-600 dark:text-slate-400">
                    Thanks for reaching out. We'll get back to you at your provided email within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Send us a message</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fill in the form and we'll respond within 24 hours.</p>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                        <input
                          {...form.register('name')}
                          placeholder="Your name"
                          className="input-base"
                        />
                        {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
                        <input
                          type="email"
                          {...form.register('email')}
                          placeholder="you@example.com"
                          className="input-base"
                        />
                        {form.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Category</label>
                        <select {...form.register('category')} className="input-base">
                          <option value="general">General inquiry</option>
                          <option value="listing">Listing support</option>
                          <option value="payment">Payment issue</option>
                          <option value="technical">Technical problem</option>
                          <option value="partnership">Partnership</option>
                        </select>
                        {form.formState.errors.category && <p className="mt-1 text-xs text-red-500">{form.formState.errors.category.message}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Subject</label>
                        <input
                          {...form.register('subject')}
                          placeholder="Brief subject line"
                          className="input-base"
                        />
                        {form.formState.errors.subject && <p className="mt-1 text-xs text-red-500">{form.formState.errors.subject.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Message</label>
                      <textarea
                        {...form.register('message')}
                        rows={6}
                        placeholder="Tell us how we can help…"
                        className="input-base resize-none"
                      />
                      {form.formState.errors.message && <p className="mt-1 text-xs text-red-500">{form.formState.errors.message.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {form.formState.isSubmitting ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                </>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Office hours</h3>
                <div className="mt-4 space-y-3 text-sm">
                  {[
                    ['Sunday – Thursday', '9:00 AM – 6:00 PM'],
                    ['Friday', 'Closed'],
                    ['Saturday', '10:00 AM – 2:00 PM'],
                  ].map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>{day}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Common topics</h3>
                <ul className="mt-4 space-y-2">
                  {['How to list a property', 'Booking cancellation policy', 'Payment methods', 'Verification process', 'Roommate requests'].map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
