'use client';

import { useEffect, useState } from 'react';
import { ListingPhoto } from '@/components/listing-photo';

export function ListingGallery({
  images,
  title,
  type,
}: {
  images?: string[];
  title: string;
  type?: string;
}) {
  const photos = images?.filter(Boolean) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = photos[activeIndex];

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(photos.length - 1, 0)));
  }, [photos.length]);

  function changePhoto(step: number) {
    setActiveIndex((index) => (index + step + photos.length) % photos.length);
  }

  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full">
        <ListingPhoto images={activeImage ? [activeImage] : undefined} title={title} type={type} />
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => changePhoto(-1)}
              aria-label="Show previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-xl font-bold text-white transition hover:bg-slate-950"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => changePhoto(1)}
              aria-label="Show next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-xl font-bold text-white transition hover:bg-slate-950"
            >
              ›
            </button>
            <span className="absolute right-3 top-3 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white" aria-live="polite">
              {activeIndex + 1} / {photos.length}
            </span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto rounded-xl bg-slate-950/50 p-2" aria-label="Select a listing photo">
          {photos.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${activeIndex === index ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <ListingPhoto images={[image]} title={`${title}, photo ${index + 1}`} type={type} showRepresentativeLabel={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
