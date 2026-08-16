// Canonical site origin — single source of truth for canonical/OG/sitemap/robots.
// Live canonical origin: the apex domain redirects to this www host.
export const SITE_URL = 'https://www.pixbanana.xyz';

export const APP_NAME = 'PixBanana';

// OG image — static file in public/og-image.png (served verbatim by Next.js,
// no dynamic route, no middleware rewrite, never 404s). Absolute URL so every
// page's og:image/twitter:image is identical.
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'PixBanana — AI Image Editor',
} as const;
