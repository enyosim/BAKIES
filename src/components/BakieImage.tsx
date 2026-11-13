import { useState } from 'react';

interface BakieImageProps {
  src: string;
  alt: string;
  fallbackIcon?: string;
  className?: string;
  imgClassName?: string;
}

export function BakieImage({
  src,
  alt,
  fallbackIcon = '🧁',
  className = '',
  imgClassName = '',
}: BakieImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 text-center p-2 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-3xl sm:text-4xl leading-none" aria-hidden="true">
          {fallbackIcon}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${imgClassName} ${className}`.trim()}
      draggable={false}
    />
  );
}
