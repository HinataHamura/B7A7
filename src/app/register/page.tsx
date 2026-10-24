'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { getRoleDashboard, setSessionCookie } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['TENANT', 'LANDLORD']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'TENANT' },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: RegisterForm) => {
    try {
      const response = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      if (!response.accessToken) throw new Error('Incomplete registration response from server.');
      setSessionCookie(response.user.role, response.user.email, response.accessToken);
      localStorage.setItem('roomly_user', JSON.stringify(response.user));
      toast.success('Account created successfully!');
      router.push(getRoleDashboard(response.user.role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-800">
        <div className="grid lg:grid-cols-2">
          {/* Left panel */}
          <div className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">R</div>
              <h1 className="text-4xl font-black leading-tight">Join Roomly today 🏠</h1>
              <p className="mt-4 max-w-sm text-slate-300">
                Start finding rooms, connecting with roommates, and managing properties on Bangladesh's most trusted housing platform.
              </p>
            </div>
            <div className="space-y-4">
              {[
                ['Tenant', 'Browse listings, book rooms, and find roommates.'],
                ['Landlord', 'Publish listings, manage bookings, and earn securely.'],
              ].map(([role, desc]) => (
                <div key={role} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold">{role}</p>
                  <p className="mt-1 text-sm text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Roomly</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Create your account</h2>
              </div>
              <Link href="/" className="text-sm font-semibold text-primary-600 dark:text-primary-400">Home</Link>
            </div>

            {/* Social login (UI only) */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toast.info('Google login coming soon!')}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => toast.info('Facebook login coming soon!')}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#1877F2]" fill="currentColor" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <div className="my-6 flex items-center gap-4 text-slate-500">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">or register with email</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                <input {...form.register('name')} placeholder="Your full name" className="input-base" />
                {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
                <input type="email" {...form.register('email')} placeholder="you@example.com" className="input-base" />
                {form.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...form.register('password')}
                    placeholder="Create a strong password"
                    className="input-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>}
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">At least 6 characters, 1 uppercase, 1 number.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">I am joining as</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['TENANT', 'LANDLORD'] as const).map((roleOption) => (
                    <label
                      key={roleOption}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                        form.watch('role') === roleOption
                          ? 'border-primary bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <input type="radio" {...form.register('role')} value={roleOption} className="sr-only" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{roleOption === 'TENANT' ? 'Tenant' : 'Landlord'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{roleOption === 'TENANT' ? 'Looking for a room' : 'Listing a property'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account…
                  </>
                ) : (
                  <>Create account <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-600 dark:text-primary-400">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
