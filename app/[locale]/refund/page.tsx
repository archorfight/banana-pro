import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { defaultLocale } from '@/lib/i18n';
import RefundContent from './RefundContent';

const SITE_URL = 'https://www.pixbanana.xyz';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'refund' });
  const localePath = locale === defaultLocale ? '' : `/${locale}`;
  const title = t('title');

  return {
    title,
    description: 'Refund Policy for PixBanana AI image generation platform.',
    alternates: {
      canonical: `${SITE_URL}${localePath}/refund`,
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
