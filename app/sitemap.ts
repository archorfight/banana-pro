import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * Sitemap — only final 200-status, indexable URLs.
 *
 * localePrefix: 'as-needed' + defaultLocale: 'en' means:
 *   English (default): no prefix  → /, /pricing, /privacy, ...
 *   Chinese:           /zh prefix → /zh, /zh/pricing, /zh/privacy, ...
 *
 * /en/* URLs are NOT included because they 3XX-redirect to the unprefixed
 * canonical URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes = ['', '/pricing', '/privacy', '/terms', '/refund']

  const entries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    const enPath = route || '/'
    const zhPath = `/zh${route}`

    entries.push({
      url: `${SITE_URL}${enPath}`,
      lastModified,
      changeFrequency: route === '' ? 'daily' : route === '/pricing' ? 'weekly' : 'monthly',
      priority: route === '' ? 1.0 : route === '/pricing' ? 0.9 : 0.5,
      alternates: {
        languages: {
          en: `${SITE_URL}${enPath}`,
          zh: `${SITE_URL}${zhPath}`,
          'x-default': `${SITE_URL}${enPath}`,
        },
      },
    })

    entries.push({
      url: `${SITE_URL}${zhPath}`,
      lastModified,
      changeFrequency: route === '' ? 'daily' : route === '/pricing' ? 'weekly' : 'monthly',
      priority: route === '' ? 0.9 : route === '/pricing' ? 0.8 : 0.4,
      alternates: {
        languages: {
          en: `${SITE_URL}${enPath}`,
          zh: `${SITE_URL}${zhPath}`,
          'x-default': `${SITE_URL}${enPath}`,
        },
      },
    })
  }

  return entries
}
