export const siteConfig = {
  name: '个人博客',
  description: '一个简约、设计精巧、交互舒适的个人博客',
  locale: 'zh_CN',
  keywords: ['个人博客', '技术文章', '摄影作品', '视频内容', 'Next.js'],
  author: {
    name: '个人博客',
  },
  social: {
    twitter: '@blog',
  },
} as const

const fallbackSiteUrl = 'http://localhost:3000'

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    fallbackSiteUrl
  ).replace(/\/$/, '')
}

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}
