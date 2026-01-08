import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Check, Zap, Mail, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: { locale: string };
}

export default function PricingPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  return <PricingContent />;
}

function PricingContent() {
  const t = useTranslations('pricing');
  const footer = useTranslations('footer');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/30 to-pink-50/30 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400">
            <Zap className="h-4 w-4" />
            <span>Simple Pricing</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            {t('title')}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('plans.free.name')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('plans.free.description')}
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {t('plans.free.price')}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                {t('plans.free.period')}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {t.raw('plans.free.features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="block w-full py-3 px-6 text-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('plans.free.cta')}
            </a>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
              {t('plans.pro.popular')}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {t('plans.pro.name')}
            </h3>
            <p className="text-white/80 mb-6">
              {t('plans.pro.description')}
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">
                {t('plans.pro.price')}
              </span>
              <span className="text-white/80 ml-2">
                /{t('plans.pro.period')}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {t.raw('plans.pro.features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="block w-full py-3 px-6 text-center rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t('plans.pro.cta')}
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('plans.enterprise.name')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('plans.enterprise.description')}
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {t('plans.enterprise.price')}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {t.raw('plans.enterprise.features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${footer('supportEmail')}`}
              className="block w-full py-3 px-6 text-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('plans.enterprise.cta')}
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
              <HelpCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('faq.title')}
            </h2>
          </div>
          <div className="space-y-4">
            {t.raw('faq.items').map((item: { q: string; a: string }, i: number) => (
              <details
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">{item.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-12">
          <Mail className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Questions about pricing?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Contact our team for custom solutions
          </p>
          <a
            href={`mailto:${footer('supportEmail')}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
          >
            {footer('supportEmail')}
          </a>
        </div>
      </div>
    </div>
  );
}
