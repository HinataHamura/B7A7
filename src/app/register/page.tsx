"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { getRoleDashboard, setSessionCookie } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['TENANT', 'LANDLORD']),
});

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'TENANT' },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const response = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      setSessionCookie(response.user.role, response.user.email);
      toast.success('Account created successfully');
      router.push(getRoleDashboard(response.user.role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <div className="mb-8">
          <p className="pill">Create account</p>
          <h1 className="mt-4 text-3xl font-black text-slate-900">Join Roomly</h1>
          <p className="mt-2 text-slate-600">Start your home search or list your space in minutes.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input
              {...form.register('name')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:bg-white"
              placeholder="Your full name"
            />
            {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              {...form.register('email')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:bg-white"
              placeholder="you@example.com"
            />
            {form.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              {...form.register('password')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:bg-white"
              placeholder="Create a strong password"
            />
            {form.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">I am joining as</label>
            <select
              {...form.register('role')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:bg-white"
            >
              <option value="TENANT">Tenant</option>
              <option value="LANDLORD">Landlord</option>
            </select>
          </div>

          <button type="submit" className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
