import type { MetadataRoute } from 'next'
import { postDAO } from '@/lib/db/dao/post-dao'
import { absoluteUrl, getSiteUrl } from '@/lib/site-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const routes: MetadataRoute.Sitemap = [
    {
      url: getSiteUrl(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/articles'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/photography'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/videos'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  try {
    const { items: posts } = await postDAO.findMany({
      published: true,
      page: 1,
      limit: 1000,
    })

    return routes.concat(
      posts.map((post) => ({
        url: absoluteUrl(`/articles/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    )
  } catch {
    return routes
  }
}
