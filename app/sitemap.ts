import { MetadataRoute } from 'next'

const SITE_URL = 'https://www.pixbanana.xyz'

export default function sitemap(): MetadataRoute.Sitemap {
  // 基础页面（支持中英文）
  const pages = [
    '',
    '/pricing',
    '/privacy',
    '/terms',
    '/refund',
  ]

  // 为每个页面生成中英文版本的 URL
  const sitemap: MetadataRoute.Sitemap = []

  // 中文版本（默认语言，不带 /zh 前缀）
  pages.forEach((page) => {
    sitemap.push({
      url: `${SITE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    })
  })

  // 英文版本
  pages.forEach((page) => {
    sitemap.push({
      url: `${SITE_URL}/en${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 0.9 : 0.7,
    })
  })

  return sitemap
}
