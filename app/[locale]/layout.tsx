import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/lib/i18n';
import { SITE_URL, OG_IMAGE } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AuthButton from '@/components/AuthButton';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: typeof locales[number] };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const appName = t('appName');
  const tagline = t('tagline');
  const heroTitle = tHero('title');
  const heroSubtitle = tHero('subtitle');
  const localePath = locale === defaultLocale ? '' : `/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${appName} — ${heroTitle} | ${tagline}`,
      template: `%s | ${appName}`,
    },
    description: heroSubtitle,
    keywords: ['AI image generator', 'AI image editor', 'text to image', 'image to image', appName],
    alternates: {
      canonical: `${SITE_URL}${localePath}`,
      languages: {
        'en': `${SITE_URL}`,
        'zh': `${SITE_URL}/zh`,
        'x-default': `${SITE_URL}`,
      },
    },
    openGraph: {
      title: `${appName} — ${heroTitle}`,
      description: heroSubtitle,
      url: `${SITE_URL}${localePath}`,
      siteName: appName,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${appName} — ${heroTitle}`,
      description: heroSubtitle,
      images: [OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      ],
      shortcut: ['/favicon.ico'],
      apple: '/apple-touch-icon.png',
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: LayoutProps) {
  // Enable static rendering
  setRequestLocale(locale);

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F96LQ95MYZ"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F96LQ95MYZ');
          `
        }} />
        {/* Structured data: WebApplication + FAQPage from i18n messages (SEO GO gate, 2026-10-03) */}
        {(() => {
          let faq: Record<string, string> = {};
          try {
            const msg = require(`@/lib/messages/${locale}.json`);
            faq = msg.faq || {};
          } catch { /* fallback: no FAQ schema */ }
          const questions = [1, 2, 3, 5, 6, 7]
            .map((i) => [faq[`q${i}`], faq[`a${i}`]] as [string, string])
            .filter(([q, a]) => q && a)
            .map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            }));
          if (!questions.length) return null;
          const ld = [
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "PixBanana",
              url: SITE_URL,
              applicationCategory: "DesignApplication",
              operatingSystem: "Web",
              description: faq.a1 || "AI-powered image generation platform.",
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: questions,
            },
          ];
          return (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
            />
          );
        })()}
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <nav className="border-b border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/50">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <Link href={locale === defaultLocale ? '/' : `/${locale}`} className="flex items-center space-x-2">
                    <span className="text-2xl">🍌</span>
                    <span className="text-xl font-bold text-primary-600">PixBanana</span>
                  </Link>
                  <div className="flex items-center space-x-4">
                    <LanguageSwitcher currentLocale={locale} />
                    <AuthButton />
                  </div>
                </div>
              </div>
            </nav>
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
