'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PersonaPlaceholder } from './PersonaPlaceholder';

interface PersonaImageProps {
  src: string | null;
  alt: string;
  accent: string;
  size?: number;
  /** Short code shown on the placeholder while the slot is empty. */
  placeholderLabel?: string;
}

/* Renders the dropped-in character art for a result, or a reserved-slot
   placeholder when the file isn't there yet (so missing art never breaks the
   layout and it's obvious which slots are still empty). */
export function PersonaImage({
  src,
  alt,
  accent,
  size = 132,
  placeholderLabel,
}: PersonaImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <PersonaPlaceholder
        accent={accent}
        size={size}
        label={placeholderLabel}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      priority
      onError={() => setFailed(true)}
      className='block object-cover'
      style={{ width: size, height: size }}
    />
  );
}
