'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi, usersApi } from '@/lib/api';
import { DashboardShell } from '@/components/dashboard-shell';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string(),
  bio: z.string().max(1000, 'Bio must be 1000 characters or fewer'),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfileEditor({ role }: { role: 'TENANT' | 'LANDLORD' }) {
  const queryClient = useQueryClient();
  const meQuery = useQuery({ queryKey: ['current-user'], queryFn: authApi.getMe });
  const userProfile = role === 'TENANT' ? meQuery.data?.tenantProfile : meQuery.data?.landlordProfile;
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '', bio: '' },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name ?? '',
        phone: userProfile.phone ?? '',
        bio: userProfile.bio ?? '',
      });
    }
  }, [form, userProfile]);

  const mutation = useMutation({
    mutationFn: (values: ProfileValues) => usersApi.updateProfile(values),
    onSuccess: async () => {
      toast.success('Profile saved.');
      await queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not save profile.'),
  });
  const dashboardRole = role === 'TENANT' ? 'tenant' : 'landlord';

  return (
    <DashboardShell title="Profile" role={dashboardRole}>
      <div className="max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <p className="pill">Account settings</p>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Update your profile</h1>
        <p className="mt-2 text-sm text-slate-600">Changes are saved to your Roomly account.</p>
        {meQuery.isError && <div role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{meQuery.error.message}</div>}
        {meQuery.isLoading ? (
          <div className="mt-6 h-40 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="mt-6 space-y-4">
            <div>
              <label htmlFor="profile-name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
              <input id="profile-name" {...form.register('name')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              {form.formState.errors.name && <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input id="profile-email" readOnly value={meQuery.data?.email ?? ''} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500" />
            </div>
            <div>
              <label htmlFor="profile-phone" className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input id="profile-phone" type="tel" {...form.register('phone')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            <div>
              <label htmlFor="profile-bio" className="mb-2 block text-sm font-medium text-slate-700">About you</label>
              <textarea id="profile-bio" rows={4} maxLength={1000} {...form.register('bio')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              {form.formState.errors.bio && <p className="mt-1 text-xs text-red-600">{form.formState.errors.bio.message}</p>}
            </div>
            <button type="submit" disabled={mutation.isPending || meQuery.isLoading} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {mutation.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}
