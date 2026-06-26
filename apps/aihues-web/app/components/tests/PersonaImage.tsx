'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PersonaPlaceholder } from './PersonaPlaceholder';

interface PersonaImageProps {
  src: string | null;
  alt: string;
  accent: string;
  width?: number;
  height?: number;
  /** Short code shown on the placeholder while the slot is empty. */
  placeholderLabel?: string;
}

/* Renders the dropped-in character art for a result, or a reserved-slot
   placeholder when the file isn't there yet. Art is full-body portrait, so we
   contain the full image inside the frame instead of cropping it. */
export function PersonaImage({
  src,
  alt,
  accent,
  width = 180,
  height = 270,
  placeholderLabel,
}: PersonaImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <PersonaPlaceholder
        accent={accent}
        width={width}
        height={height}
        label={placeholderLabel}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      priority
      onError={() => setFailed(true)}
      className='block object-contain'
      style={{ width, height }}
    />
  );
}
