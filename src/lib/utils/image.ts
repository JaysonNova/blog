export function getShimmerDataUrl(width = 1200, height = 800) {
  const shimmer = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f5f5f5"/>
      <rect id="pulse" width="${width}" height="${height}" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#f5f5f5"/>
          <stop offset="50%" stop-color="#ebebeb"/>
          <stop offset="100%" stop-color="#f5f5f5"/>
        </linearGradient>
      </defs>
      <animate xlink:href="#pulse" attributeName="x" from="-${width}" to="${width}" dur="1.2s" repeatCount="indefinite"/>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shimmer)}`
}
