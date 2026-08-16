import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { defaultLocale } from '@/lib/i18n';
import { SITE_URL, OG_IMAGE } from '@/lib/seo';
import PricingContent from './PricingContent';

interface PageProps {
  params: { locale: string };
}

const descriptions: Record<string, string> = {
  en: 'Simple, transparent pricing for PixBanana AI image generation. Buy credit packages with a one-time purchase — no subscription required. Credits never expire.',
  zh: 'PixBanana AI 图像生成定价简单透明。一次性购买点数套餐，无需订阅，点数永不过期。',
};

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const localePath = locale === defaultLocale ? '' : `/${locale}`;
  const title = t('title');
  const description = descriptions[locale] ?? descriptions.en;
  const url = `${SITE_URL}${localePath}/pricing`;

  return {
    title: `${title} — ${t('subtitle')}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PricingPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  return <PricingContent />;
}
