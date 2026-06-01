'use client';

function gradientFromSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1} 70% 85%), hsl(${h2} 70% 75%))`;
}

export default function CoverImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`${className || ''} relative overflow-hidden`}
      style={{ background: gradientFromSlug(alt) }}
    >
      <img
        alt={alt}
        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
        loading='lazy'
        src={src}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}
