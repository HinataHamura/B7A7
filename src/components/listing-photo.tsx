'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Building2 } from 'lucide-react';

export function ListingPhoto({
  images,
  title,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  images?: string[];
  title: string;
  className?: string;
  sizes?: string;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const image = images?.find((source) => source && !failedSources.includes(source));

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
    <Image
      src={image}
      alt={`${title} — room and property photo`}
      fill
      sizes={sizes}
      unoptimized
      onError={() => setFailedSources((current) => [...current, image])}
      className={`object-cover ${className}`}
    />
  );
}
