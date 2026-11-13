import { useState } from 'react';

interface BakieImageProps {
  src: string;
  alt: string;
  fallbackIcon?: string;
  className?: string;
  imgClassName?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  width?: number;
  height?: number;
  onLoad?: () => void;
}

export function BakieImage({
  src,
  alt,
  fallbackIcon = '🧁',
  className = '',
  imgClassName = '',
  loading = 'eager',
  decoding = 'async',
  fetchPriority,
  width,
  height,
  onLoad,
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
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      onLoad={onLoad}
      onError={() => setHasError(true)}
      className={`${imgClassName} ${className}`.trim()}
      draggable={false}
    />
  );
}
