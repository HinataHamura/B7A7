'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, BookOpen, Calendar, Clock, Tag } from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { NewsletterForm } from '@/components/newsletter-form';

const posts = [
  {
    id: 'dhaka-neighborhoods-2025',
    title: 'The Best Neighborhoods to Rent in Dhaka in 2025',
    excerpt: "Explore Dhaka's top rental hotspots -- from the upscale Gulshan corridor to the budget-friendly Mirpur blocks, and everything in between.",
    category: 'Neighborhood Guide',
    readTime: '6 min read',
    date: 'October 10, 2025',
    author: 'Sumaiya Islam',
    avatar: 'S',
    color: 'bg-primary',
    featured: true,
  },
  {
    id: 'first-time-renter-checklist',
    title: '10 Things Every First-Time Renter Must Check Before Signing',
    excerpt: 'Avoid costly mistakes with this comprehensive checklist covering lease terms, deposits, utilities, and landlord verification.',
    category: 'Renting Tips',
    readTime: '5 min read',
    date: 'September 28, 2025',
    author: 'Tariq Ahmed',
    avatar: 'T',
    color: 'bg-emerald-500',
    featured: false,
  },
  {
    id: 'roommate-compatibility',
    title: 'How to Find a Compatible Roommate: A Data-Driven Approach',
    excerpt: "Roomly's AI matching algorithm analyzes sleep schedules, cleanliness preferences, and budget to connect you with your ideal co-tenant.",
    category: 'Roommate Matching',
    readTime: '7 min read',
    date: 'September 15, 2025',
    author: 'Rahim Chowdhury',
    avatar: 'R',
    color: 'bg-amber-500',
    featured: false,
  },
  {
    id: 'landlord-listing-tips',
    title: 'How to Write a Listing That Attracts Quality Tenants Fast',
    excerpt: 'Photos, descriptions, and pricing strategies that experienced landlords use to fill vacancies in under a week.',
    category: 'Landlord Tips',
    readTime: '4 min read',
    date: 'September 5, 2025',
    author: 'Nadia Begum',
    avatar: 'N',
    color: 'bg-rose-500',
    featured: false,
  },
  {
    id: 'rental-rights-bangladesh',
    title: 'Your Rental Rights in Bangladesh: What Tenants Need to Know',
    excerpt: 'A plain-English guide to the Premises Rent Control Act and how it protects tenants from unfair evictions and illegal rent hikes.',
    category: 'Legal',
    readTime: '8 min read',
    date: 'August 20, 2025',
    author: 'Tariq Ahmed',
    avatar: 'T',
    color: 'bg-emerald-500',
    featured: false,
  },
  {
    id: 'sslcommerz-security',
    title: "Is My Rent Payment Secure? Inside Roomly's SSLCommerz Integration",
    excerpt: "A technical deep-dive into how Roomly uses SSLCommerz to protect tenant transactions and prevent payment fraud.",
    category: 'Technology',
    readTime: '5 min read',
    date: 'August 8, 2025',
    author: 'Sumaiya Islam',
    avatar: 'S',
    color: 'bg-primary',
    featured: false,
  },
];

const categories = ['All', 'Neighborhood Guide', 'Renting Tips', 'Landlord Tips', 'Roommate Matching', 'Legal', 'Technology'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [featured, ...rest] = posts;

  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="bg-mesh-gradient py-16">
          <div className="container-shell">
            <div className="max-w-2xl">
              <span className="pill">Roomly Blog</span>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Insights for smarter renting.
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Guides, tips, and stories from the Roomly team to help you navigate housing in Dhaka.
              </p>
            </div>
          </div>
        </section>

        {/* Category filters */}
        <section className="sticky top-16 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
          <div className="container-shell py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    cat === activeCategory
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured post */}
        <section className="container-shell pt-12">
          <div className="glass-panel overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="flex h-64 items-center justify-center bg-slate-900 lg:h-auto">
                <BookOpen size={64} className="text-slate-600" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Featured</span>
                </div>
                <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{featured.title}</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400">{featured.excerpt}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${featured.color} text-xs font-bold text-white`}>
                      {featured.avatar}
                    </div>
                    {featured.author}
                  </div>
                  <span className="flex items-center gap-1"><Calendar size={13} /> {featured.date}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {featured.readTime}</span>
                </div>
                <Link
                  href={`/blog/${featured.id}`}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                >
                  Read article <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Post grid */}
        <section className="container-shell py-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent articles</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article key={post.id} className="glass-panel flex flex-col overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-slate-100 dark:bg-slate-700">
                  <Tag size={32} className="text-slate-400" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{post.category}</span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white">{post.title}</h3>
                  <p className="mt-2 flex-1 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${post.color} text-[10px] font-bold text-white`}>
                        {post.avatar}
                      </div>
                      {post.author}
                    </div>
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400"
                  >
                    Read more <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="container-shell pb-16">
          <div className="glass-panel p-8 text-center sm:p-12">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Never miss a new post.</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Weekly housing insights and Dhaka neighborhood guides, delivered to your inbox.</p>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
