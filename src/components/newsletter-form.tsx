'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed! Watch your inbox for Roomly updates.');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
      />
      <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
        Subscribe
      </button>
    </form>
  );
}
