'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Building2 } from 'lucide-react';

export function ListingPhoto({
  images,
  title,
  type,
  showRepresentativeLabel = true,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  images?: string[];
  title: string;
  type?: string;
  showRepresentativeLabel?: boolean;
  className?: string;
  sizes?: string;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const actualImage = images?.find((source) => source && !failedSources.includes(source));
  const representativeImage =
    type === 'ENTIRE_PLACE'
      ? '/images/representative-rooms/room-02.jpg'
      : type === 'SHARED_ROOM'
        ? '/images/representative-rooms/room-03.jpg'
        : '/images/representative-rooms/room-01.jpg';
  const isRepresentative = !actualImage;
  const image = actualImage ?? (failedSources.includes(representativeImage) ? undefined : representativeImage);

  if (!image) {
    return (
      <div
        role="img"
        aria-label={`${title}: no property photos uploaded`}
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-primary-50 text-slate-400 ${className}`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Building2 aria-hidden="true" size={34} strokeWidth={1.5} />
          <span className="text-xs font-medium">Photos not provided</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Image
        src={image}
        alt={isRepresentative
          ? `${title}: illustrative interior photo, not a photo of this specific property`
          : `${title} — room and property photo`}
        fill
        sizes={sizes}
        unoptimized
        onError={() => setFailedSources((current) => [...current, image])}
        className={`object-cover ${className}`}
      />
      {isRepresentative && showRepresentativeLabel && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
          Illustrative · Unsplash · actual room may differ
        </span>
      )}
    </>
  );
}
