import { useState } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Text shown if the image fails to load. Defaults to alt. */
  fallbackLabel?: string;
  /** Render nothing (instead of a placeholder) when the image fails, e.g. for hover-only images. */
  hideOnError?: boolean;
}

/** <img> that degrades to a tidy placeholder instead of the browser's broken-image icon. */
export function SafeImage({ fallbackLabel, hideOnError = false, alt = '', className = '', ...rest }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc !== null && failedSrc === rest.src;

  if (failed) {
    if (hideOnError) return null;
    const label = fallbackLabel ?? alt;
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`flex items-center justify-center bg-gradient-to-br from-blush to-lilac p-2 text-center font-display text-[0.8rem] italic leading-tight text-ink/60 ${className}`}
      >
        <span className="line-clamp-3">{label}</span>
      </div>
    );
  }
  return <img {...rest} alt={alt} className={className} onError={() => setFailedSrc(rest.src ?? '')} />;
}
