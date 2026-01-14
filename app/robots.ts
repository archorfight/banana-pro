import { MetadataRoute } from 'next'

const SITE_URL = 'https://www.pixbanana.xyz'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/success', '/cancel'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
