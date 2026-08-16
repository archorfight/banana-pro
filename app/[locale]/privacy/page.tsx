import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Shield, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { defaultLocale } from '@/lib/i18n';
import { SITE_URL, OG_IMAGE } from '@/lib/seo';

interface PageProps {
  params: { locale: string };
}

const descriptions: Record<string, string> = {
  en: 'Read the PixBanana privacy policy: what data we collect (account, usage, payment, technical), how we use and protect it, who we share it with, and the rights you have over your information.',
  zh: '阅读 PixBanana 隐私政策：我们收集哪些数据（账户、使用、支付、技术信息），如何使用与保护数据、与谁共享，以及您对自己信息的权利。',
};

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const localePath = locale === defaultLocale ? '' : `/${locale}`;
  const title = t('title');
  const description = descriptions[locale] ?? descriptions.en;
  const url = `${SITE_URL}${localePath}/privacy`;

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

export default function PrivacyPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations('privacy');
  const footer = useTranslations('footer');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
            <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('lastUpdated')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.introduction.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.introduction.content')}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.informationCollect.title')}
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>{t('sections.informationCollect.items.account')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>{t('sections.informationCollect.items.usage')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>{t('sections.informationCollect.items.payment')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>{t('sections.informationCollect.items.technical')}</span>
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.informationUse.title')}
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {t.raw('sections.informationUse.items').map((item: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.dataSharing.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.dataSharing.content')}
            </p>
            <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>• Service providers who assist in operating our platform</li>
              <li>• Payment processors (for transaction processing only)</li>
              <li>• Legal authorities when required by law</li>
              <li>• Third parties with your explicit consent</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.dataSecurity.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.dataSecurity.content')}
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.userRights.title')}
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {t.raw('sections.userRights.items').map((item: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.cookies.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.cookies.content')}
            </p>
          </section>

          {/* Contact */}
          <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              {t('sections.contact.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {t('sections.contact.content')}
            </p>
            <a
              href={`mailto:${footer('supportEmail')}`}
              className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium"
            >
              {footer('supportEmail')}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
