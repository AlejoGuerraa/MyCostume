import { useState } from 'react'
import './css/ImageWithFallback.css'

function ImageWithFallback({
  src,
  alt,
  className,
  placeholderClassName,
  loading = 'lazy',
}) {
  const [failedSource, setFailedSource] = useState(null)
  const failed = failedSource === src

  if (!src || failed) {
    return (
      <div
        className={`item-image-placeholder${placeholderClassName ? ` ${placeholderClassName}` : ''}`}
        role="img"
        aria-label={`No image available for ${alt}`}
      >
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M24 7a4 4 0 0 1 4 4c0 2.2-1.6 3.2-4 4.7l-12 7.2v16.6h24V22.9l-12-7.2" />
          <path d="M12 23h24M19 29h10" />
        </svg>
        <span>Image coming soon</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailedSource(src)}
    />
  )
}

export default ImageWithFallback
