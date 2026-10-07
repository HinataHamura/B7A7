'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { listingsApi, uploadsApi, type ListingItem, type ListingPayload } from '@/lib/api';
import { DashboardShell } from '@/components/dashboard-shell';

const listingSchema = z.object({
  title: z.string().min(5, 'Use at least 5 characters').max(200),
  description: z.string().min(20, 'Describe the home in at least 20 characters'),
  type: z.enum(['ENTIRE_PLACE', 'PRIVATE_ROOM', 'SHARED_ROOM']),
  addressLine: z.string().min(5, 'Enter the street address'),
  city: z.string().min(2, 'Enter the city'),
  area: z.string().min(2, 'Enter the area or neighborhood'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  rentAmount: z.number().positive('Monthly rent must be greater than zero'),
  securityDeposit: z.number().nonnegative('Deposit cannot be negative'),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  maxOccupants: z.number().int().positive(),
  amenitiesText: z.string(),
  genderPreference: z.enum(['', 'MALE', 'FEMALE', 'ANY']),
  images: z.array(z.string().url()),
});

type ListingFormValues = z.infer<typeof listingSchema>;

const stepFields: (keyof ListingFormValues)[][] = [
  ['title', 'description', 'type'],
  ['addressLine', 'city', 'area', 'latitude', 'longitude'],
  ['rentAmount', 'securityDeposit', 'bedrooms', 'bathrooms', 'maxOccupants', 'genderPreference'],
  ['amenitiesText', 'images'],
];

const defaultValues: ListingFormValues = {
  title: '',
  description: '',
  type: 'PRIVATE_ROOM',
  addressLine: '',
  city: '',
  area: '',
  latitude: 23.8103,
  longitude: 90.4125,
  rentAmount: 0,
  securityDeposit: 0,
  bedrooms: 1,
  bathrooms: 1,
  maxOccupants: 1,
  amenitiesText: '',
  genderPreference: '',
  images: [],
};

function toFormValues(listing: ListingItem): ListingFormValues {
  return {
    title: listing.title,
    description: listing.description,
    type: listing.type === 'ENTIRE_PLACE' || listing.type === 'SHARED_ROOM' ? listing.type : 'PRIVATE_ROOM',
    addressLine: listing.addressLine ?? '',
    city: listing.city,
    area: listing.area,
    latitude: listing.latitude ?? 23.8103,
    longitude: listing.longitude ?? 90.4125,
    rentAmount: Number(listing.rentAmount),
    securityDeposit: Number(listing.securityDeposit ?? 0),
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms ?? 1,
    maxOccupants: listing.maxOccupants ?? 1,
    amenitiesText: (listing.amenities ?? []).join(', '),
    genderPreference:
      listing.genderPreference === 'MALE' || listing.genderPreference === 'FEMALE' || listing.genderPreference === 'ANY'
        ? listing.genderPreference
        : '',
    images: listing.images ?? [],
  };
}

export default function ListingEditor({ listingId }: { listingId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const listingQuery = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => listingsApi.getById(listingId!),
    enabled: Boolean(listingId),
  });
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues,
  });
  const watchedImages = form.watch('images');
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  useEffect(() => {
    if (listingQuery.data) form.reset(toFormValues(listingQuery.data));
  }, [form, listingQuery.data]);

  const createMutation = useMutation({
    mutationFn: (payload: ListingPayload) => listingsApi.create(payload),
    onSuccess: async (listing) => {
      toast.success('Listing published.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['landlord-listings'] }),
        queryClient.invalidateQueries({ queryKey: ['landlord-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['listings'] }),
      ]);
      router.push(`/provider/listings?created=${encodeURIComponent(listing.id)}`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not create listing.'),
  });
  const updateMutation = useMutation({
    mutationFn: (payload: ListingPayload) => listingsApi.update(listingId!, payload),
    onSuccess: async () => {
      toast.success('Listing updated.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['landlord-listings'] }),
        queryClient.invalidateQueries({ queryKey: ['listing', listingId] }),
        queryClient.invalidateQueries({ queryKey: ['listings'] }),
      ]);
      router.push('/provider/listings');
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update listing.'),
  });
  const isSaving = uploading || createMutation.isPending || updateMutation.isPending;

  const nextStep = async () => {
    if (await form.trigger(stepFields[step])) setStep((current) => Math.min(current + 1, stepFields.length - 1));
  };

  const submit = form.handleSubmit(async (values) => {
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploadedUrls = await uploadsApi.uploadListingImages(files);
        values.images = [...values.images, ...uploadedUrls];
        form.setValue('images', values.images, { shouldValidate: true });
        setFiles([]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Photo upload failed. Your listing was not saved.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (values.images.length === 0) {
      toast.error('Upload at least one property photo before publishing.');
      return;
    }

    const payload: ListingPayload = {
      title: values.title.trim(),
      description: values.description.trim(),
      type: values.type,
      addressLine: values.addressLine.trim(),
      city: values.city.trim(),
      area: values.area.trim(),
      latitude: values.latitude,
      longitude: values.longitude,
      rentAmount: values.rentAmount,
      securityDeposit: values.securityDeposit,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      maxOccupants: values.maxOccupants,
      amenities: values.amenitiesText.split(',').map((amenity) => amenity.trim()).filter(Boolean),
      genderPreference: values.genderPreference || undefined,
      images: values.images,
      status: 'PUBLISHED',
    };

    if (listingId) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  });

  if (listingId && listingQuery.isLoading) {
    return <main className="container-shell py-10"><div className="glass-panel h-96 animate-pulse bg-slate-100" /></main>;
  }

  if (listingId && (listingQuery.isError || !listingQuery.data)) {
    return (
      <DashboardShell title="Edit listing" role="landlord">
        <div role="alert" className="glass-panel p-8 text-center">
          <h1 className="text-xl font-bold">Listing unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">{listingQuery.error instanceof Error ? listingQuery.error.message : 'The listing could not be loaded.'}</p>
          <Link href="/provider/listings" className="mt-4 inline-flex text-sm font-semibold text-primary-700">Back to listings</Link>
        </div>
      </DashboardShell>
    );
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500';

  return (
    <DashboardShell title={listingId ? 'Edit listing' : 'Create listing'} role="landlord">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <p className="pill">Property listing</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">{listingId ? 'Update your listing' : 'List your space'}</h1>
          <p className="mt-2 text-slate-600">Add accurate details and real property photos to help tenants decide.</p>
        </div>

        <ol aria-label="Listing form steps" className="mb-6 grid grid-cols-4 gap-2">
          {['Basics', 'Location', 'Pricing', 'Photos'].map((label, index) => (
            <li key={label} className={`rounded-xl px-2 py-3 text-center text-xs font-semibold sm:text-sm ${step === index ? 'bg-primary text-white' : step > index ? 'bg-primary-50 text-primary-800' : 'bg-white text-slate-500'}`}>
              <span className="mr-1">{index + 1}.</span>{label}
            </li>
          ))}
        </ol>

        <form onSubmit={submit} className="glass-panel space-y-5 p-5 sm:p-8">
          {step === 0 && (
            <>
              <Field label="Listing title" error={form.formState.errors.title?.message}>
                <input {...form.register('title')} maxLength={200} className={inputClass} placeholder="Bright private room near Dhanmondi Lake" />
              </Field>
              <Field label="Description" error={form.formState.errors.description?.message}>
                <textarea {...form.register('description')} rows={5} className={inputClass} placeholder="Describe the room, building, rules, and nearby transit." />
              </Field>
              <Field label="Space type" error={form.formState.errors.type?.message}>
                <select {...form.register('type')} className={inputClass}>
                  <option value="ENTIRE_PLACE">Entire place</option>
                  <option value="PRIVATE_ROOM">Private room</option>
                  <option value="SHARED_ROOM">Shared room</option>
                </select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Street address" error={form.formState.errors.addressLine?.message}>
                <input {...form.register('addressLine')} className={inputClass} placeholder="Road 8, Dhanmondi" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" error={form.formState.errors.city?.message}>
                  <input {...form.register('city')} className={inputClass} placeholder="Dhaka" />
                </Field>
                <Field label="Area / neighborhood" error={form.formState.errors.area?.message}>
                  <input {...form.register('area')} className={inputClass} placeholder="Dhanmondi" />
                </Field>
              </div>
              <p className="text-sm font-semibold text-slate-800">Map coordinates</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Latitude" error={form.formState.errors.latitude?.message}>
                  <input {...form.register('latitude', { valueAsNumber: true })} type="number" step="any" min="-90" max="90" className={inputClass} />
                </Field>
                <Field label="Longitude" error={form.formState.errors.longitude?.message}>
                  <input {...form.register('longitude', { valueAsNumber: true })} type="number" step="any" min="-180" max="180" className={inputClass} />
                </Field>
              </div>
              <p className="text-xs text-slate-500">Coordinates are required for nearby search. Confirm them from a map before publishing.</p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Monthly rent (BDT)" error={form.formState.errors.rentAmount?.message}>
                  <input {...form.register('rentAmount', { valueAsNumber: true })} type="number" min="1" className={inputClass} />
                </Field>
                <Field label="Security deposit (BDT)" error={form.formState.errors.securityDeposit?.message}>
                  <input {...form.register('securityDeposit', { valueAsNumber: true })} type="number" min="0" className={inputClass} />
                </Field>
                <Field label="Bedrooms" error={form.formState.errors.bedrooms?.message}>
                  <input {...form.register('bedrooms', { valueAsNumber: true })} type="number" min="0" step="1" className={inputClass} />
                </Field>
                <Field label="Bathrooms" error={form.formState.errors.bathrooms?.message}>
                  <input {...form.register('bathrooms', { valueAsNumber: true })} type="number" min="0" step="1" className={inputClass} />
                </Field>
                <Field label="Maximum occupants" error={form.formState.errors.maxOccupants?.message}>
                  <input {...form.register('maxOccupants', { valueAsNumber: true })} type="number" min="1" step="1" className={inputClass} />
                </Field>
                <Field label="Gender preference" error={form.formState.errors.genderPreference?.message}>
                  <select {...form.register('genderPreference')} className={inputClass}>
                    <option value="">No preference</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="ANY">Any</option>
                  </select>
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Amenities" hint="Separate items with commas, e.g. WiFi, AC, Furnished" error={form.formState.errors.amenitiesText?.message}>
                <input {...form.register('amenitiesText')} className={inputClass} placeholder="WiFi, AC, Furnished" />
              </Field>
              <div>
                <label htmlFor="listing-photos" className="block text-sm font-semibold text-slate-800">Property photos <span className="text-red-600">required to publish</span></label>
                <p className="mt-1 text-xs text-slate-500">Choose up to 10 JPG, PNG, WEBP, or GIF images. Maximum 5 MB each.</p>
                <input
                  id="listing-photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={(event) => {
                    const selected = Array.from(event.target.files ?? []);
                    const accepted = selected.filter((file) => file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/'));
                    if (accepted.length !== selected.length) toast.error('Images must be valid image files under 5 MB each.');
                    const nextFiles = [...files, ...accepted].slice(0, Math.max(0, 10 - watchedImages.length));
                    if (nextFiles.length < files.length + accepted.length) toast.error('You can add up to 10 photos per listing.');
                    setFiles(nextFiles);
                    event.target.value = '';
                  }}
                  className="mt-3 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                {watchedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {watchedImages.map((url, index) => (
                      <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <Image src={url} alt={`Saved property photo ${index + 1}`} fill unoptimized sizes="180px" className="object-cover" />
                        <button type="button" onClick={() => form.setValue('images', watchedImages.filter((_, itemIndex) => itemIndex !== index), { shouldValidate: true })} className="absolute right-2 top-2 rounded-full bg-slate-950/80 px-2 py-1 text-xs font-semibold text-white" aria-label={`Remove saved photo ${index + 1}`}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {previews.map(({ file, url }) => (
                      <div key={`${file.name}-${file.lastModified}`} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <Image src={url} alt={`Preview of ${file.name}`} fill unoptimized sizes="180px" className="object-cover" />
                        <button type="button" onClick={() => setFiles((current) => current.filter((item) => item !== file))} className="absolute right-2 top-2 rounded-full bg-slate-950/80 px-2 py-1 text-xs font-semibold text-white" aria-label={`Remove ${file.name}`}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
            <button type="button" disabled={step === 0 || isSaving} onClick={() => setStep((current) => Math.max(0, current - 1))} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40">Back</button>
            {step < stepFields.length - 1 ? (
              <button type="button" onClick={nextStep} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">Continue</button>
            ) : (
              <button type="submit" disabled={isSaving} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {uploading ? 'Uploading photos…' : createMutation.isPending || updateMutation.isPending ? 'Saving listing…' : listingId ? 'Save listing' : 'Publish listing'}
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</label>
      {hint && <p className="mb-2 text-xs text-slate-500">{hint}</p>}
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
