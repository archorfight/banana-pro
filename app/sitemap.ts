import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { landingPages } from '@/lib/landing-pages';
import { landingPages2 } from '@/lib/landing-pages-2';
import { BATCH1_EXTRA_SLUGS } from '@/lib/deploy-batches';
import { christmasPages } from '@/lib/landing-pages-christmas';

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

  // Keyword-cluster landing pages: batch-1 slice only (一期全部 + 二期 BATCH1_EXTRA_SLUGS).
  // Staged 二期页不入 sitemap — sitemap 只反映实际上线路由 (照 obbba 配方).
  const batch1Pages = [...landingPages, ...landingPages2.filter((p) => BATCH1_EXTRA_SLUGS.has(p.slug)), ...christmasPages];
  for (const p of batch1Pages) {
    for (const path of [`/${p.slug}`, `/zh/${p.slug}`]) {
      entries.push({
        url: `${SITE_URL}${path}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${SITE_URL}/${p.slug}`,
            zh: `${SITE_URL}/zh/${p.slug}`,
            'x-default': `${SITE_URL}/${p.slug}`,
          },
        },
      })
    }
  }

  return entries
}
