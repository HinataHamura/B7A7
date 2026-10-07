"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ShieldCheck, Sparkles, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { getRoleDashboard, setSessionCookie } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const demoAccounts = [
  { role: 'Admin', email: 'admin@roomly.com', password: 'Admin123!', accent: 'bg-violet-500', icon: ShieldCheck },
  { role: 'User', email: 'tenant.demo@roomly.com', password: 'Tenant123!', accent: 'bg-sky-500', icon: UserCog },
  { role: 'Provider', email: 'landlord.demo@roomly.com', password: 'Landlord123!', accent: 'bg-emerald-500', icon: Sparkles },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const performLogin = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (!response.user?.role || !response.accessToken) {
      throw new Error('The Roomly API returned an incomplete login response.');
    }

    const role = response.user.role;
    setSessionCookie(role, response.user.email, response.accessToken);
    localStorage.setItem('roomly_user', JSON.stringify(response.user));
    toast.success(`Welcome back, ${response.user.email}`);
    router.push(getRoleDashboard(role));
  };

  const handleDemoLogin = async (account: (typeof demoAccounts)[number]) => {
    setLoading(true);
    try {
      await performLogin(account.email, account.password);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await performLogin(values.email, values.password);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-soft">
        <div className="grid lg:grid-cols-2">
          <div className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">R</div>
              <h1 className="text-4xl font-black leading-tight">Welcome back 👋</h1>
              <p className="mt-4 max-w-sm text-slate-300">
                Sign in to manage rooms, bookings, and secure stays for your next move with confidence.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Demo access</p>
              <p className="mt-2 text-lg font-semibold">Admin, User, and Provider dashboards are ready to test.</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Roomly</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">Login to your account</h2>
              </div>
              <Link href="/" className="text-sm font-semibold text-primary-600">Home</Link>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  {...form.register('email')}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:bg-white"
                />
                {form.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  {...form.register('password')}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:bg-white"
                />
                {form.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Login'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="my-8 flex items-center gap-4 text-slate-500">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-900">Quick Demo Login</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  return (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => handleDemoLogin(account)}
                      disabled={loading}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white disabled:opacity-70"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${account.accent}`}>
                          <Icon size={18} />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Demo</span>
                      </div>
                      <p className="mt-4 text-lg font-bold text-slate-900">{account.role}</p>
                      <p className="mt-1 text-xs text-slate-500">{account.email}</p>
                      <span className="mt-4 inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                        Demo Login
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-8 text-sm text-slate-600">
              New here?{' '}
              <Link href="/register" className="font-semibold text-primary-600">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
