import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { defaultLocale } from '@/lib/i18n';
import { SITE_URL, OG_IMAGE } from '@/lib/seo';
import RefundContent from './RefundContent';

interface PageProps {
  params: { locale: string };
}

const descriptions: Record<string, string> = {
  en: 'PixBanana refund policy: full refund within 7 days if credits are unused; prorated refunds for partially used packages.',
  zh: 'PixBanana 退款政策：点数未使用可在 7 天内申请全额退款，部分使用的套餐按比例退款，以及如何提交退款申请。',
};

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'refund' });
  const localePath = locale === defaultLocale ? '' : `/${locale}`;
  const title = t('title');
  const description = descriptions[locale] ?? descriptions.en;
  const url = `${SITE_URL}${localePath}/refund`;

  return {
    title,
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

export default function RefundPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  return <RefundContent />;
}
