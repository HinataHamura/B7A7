'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi, usersApi, type Profile } from '@/lib/api';
import { DashboardShell } from '@/components/dashboard-shell';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string(),
  bio: z.string().max(1000, 'Bio must be 1000 characters or fewer'),
  gender: z.enum(['MALE', 'FEMALE', 'ANY', '']),
  smoker: z.enum(['yes', 'no', '']),
  hasPets: z.enum(['yes', 'no', '']),
  sleepSchedule: z.enum(['EARLY_BIRD', 'NIGHT_OWL', 'FLEXIBLE', '']),
  cleanliness: z.enum(['VERY_TIDY', 'MODERATE', 'RELAXED', '']),
  budgetMin: z.number().nonnegative('Budget cannot be negative').optional(),
  budgetMax: z.number().nonnegative('Budget cannot be negative').optional(),
  preferredAreas: z.string().max(300, 'Preferred areas must be 300 characters or fewer'),
}).refine(
  (values) => values.budgetMin === undefined || values.budgetMax === undefined || values.budgetMin <= values.budgetMax,
  { path: ['budgetMax'], message: 'Maximum budget must be greater than or equal to minimum budget' },
);

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfileEditor({ role }: { role: 'TENANT' | 'LANDLORD' }) {
  const queryClient = useQueryClient();
  const meQuery = useQuery({ queryKey: ['current-user'], queryFn: authApi.getMe });
  const userProfile = role === 'TENANT' ? meQuery.data?.tenantProfile : meQuery.data?.landlordProfile;
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      bio: '',
      gender: '',
      smoker: '',
      hasPets: '',
      sleepSchedule: '',
      cleanliness: '',
      budgetMin: undefined,
      budgetMax: undefined,
      preferredAreas: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name ?? '',
        phone: userProfile.phone ?? '',
        bio: userProfile.bio ?? '',
        gender: userProfile.gender ?? '',
        smoker: userProfile.smoker === undefined || userProfile.smoker === null ? '' : userProfile.smoker ? 'yes' : 'no',
        hasPets: userProfile.hasPets === undefined || userProfile.hasPets === null ? '' : userProfile.hasPets ? 'yes' : 'no',
        sleepSchedule: userProfile.sleepSchedule ?? '',
        cleanliness: userProfile.cleanliness ?? '',
        budgetMin: userProfile.budgetMin == null ? undefined : Number(userProfile.budgetMin),
        budgetMax: userProfile.budgetMax == null ? undefined : Number(userProfile.budgetMax),
        preferredAreas: userProfile.preferredAreas?.join(', ') ?? '',
      });
    }
  }, [form, userProfile]);

  const mutation = useMutation({
    mutationFn: (values: ProfileValues) => {
      const basicProfile = { name: values.name, phone: values.phone, bio: values.bio };
      if (role !== 'TENANT') return usersApi.updateProfile(basicProfile);

      const tenantProfile: Partial<Profile> = {
        ...basicProfile,
        gender: values.gender || undefined,
        smoker: values.smoker === '' ? undefined : values.smoker === 'yes',
        hasPets: values.hasPets === '' ? undefined : values.hasPets === 'yes',
        sleepSchedule: values.sleepSchedule || undefined,
        cleanliness: values.cleanliness || undefined,
        budgetMin: values.budgetMin,
        budgetMax: values.budgetMax,
        preferredAreas: values.preferredAreas.split(',').map((area) => area.trim()).filter(Boolean),
      };
      return usersApi.updateProfile(tenantProfile);
    },
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
            {role === 'TENANT' && (
              <fieldset className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5">
                <legend className="px-2 text-sm font-semibold text-slate-900">Roommate preferences</legend>
                <p className="text-sm text-slate-600">These preferences power your compatibility scores. Share only what you are comfortable sharing.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="tenant-gender" className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
                    <select id="tenant-gender" {...form.register('gender')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <option value="">Prefer not to say</option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="ANY">Any</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tenant-smoking" className="mb-2 block text-sm font-medium text-slate-700">Smoking</label>
                    <select id="tenant-smoking" {...form.register('smoker')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <option value="">Prefer not to say</option>
                      <option value="no">Non-smoker</option>
                      <option value="yes">Smoker</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tenant-pets" className="mb-2 block text-sm font-medium text-slate-700">Have pets</label>
                    <select id="tenant-pets" {...form.register('hasPets')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <option value="">Prefer not to say</option>
                      <option value="no">No pets</option>
                      <option value="yes">Have pets</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tenant-schedule" className="mb-2 block text-sm font-medium text-slate-700">Sleep schedule</label>
                    <select id="tenant-schedule" {...form.register('sleepSchedule')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <option value="">Prefer not to say</option>
                      <option value="EARLY_BIRD">Early bird</option>
                      <option value="NIGHT_OWL">Night owl</option>
                      <option value="FLEXIBLE">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tenant-cleanliness" className="mb-2 block text-sm font-medium text-slate-700">Cleanliness</label>
                    <select id="tenant-cleanliness" {...form.register('cleanliness')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <option value="">Prefer not to say</option>
                      <option value="VERY_TIDY">Very tidy</option>
                      <option value="MODERATE">Moderate</option>
                      <option value="RELAXED">Relaxed</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tenant-areas" className="mb-2 block text-sm font-medium text-slate-700">Preferred areas</label>
                    <input id="tenant-areas" {...form.register('preferredAreas')} placeholder="Dhanmondi, Banani" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                    <p className="mt-1 text-xs text-slate-500">Separate areas with commas.</p>
                  </div>
                  <div>
                    <label htmlFor="tenant-budget-min" className="mb-2 block text-sm font-medium text-slate-700">Minimum monthly budget (৳)</label>
                    <input id="tenant-budget-min" type="number" min="0" {...form.register('budgetMin', { setValueAs: (value) => value === '' ? undefined : Number(value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                    {form.formState.errors.budgetMin && <p className="mt-1 text-xs text-red-600">{form.formState.errors.budgetMin.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="tenant-budget-max" className="mb-2 block text-sm font-medium text-slate-700">Maximum monthly budget (৳)</label>
                    <input id="tenant-budget-max" type="number" min="0" {...form.register('budgetMax', { setValueAs: (value) => value === '' ? undefined : Number(value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                    {form.formState.errors.budgetMax && <p className="mt-1 text-xs text-red-600">{form.formState.errors.budgetMax.message}</p>}
                  </div>
                </div>
              </fieldset>
            )}
            <button type="submit" disabled={mutation.isPending || meQuery.isLoading} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {mutation.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}
