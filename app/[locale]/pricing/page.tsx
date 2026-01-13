'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Check, Zap, Mail, HelpCircle, Coins, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface PageProps {
  params: { locale: string };
}

export default function PricingPage({ params: { locale } }: PageProps) {
  return <PricingContent />;
}

function PricingContent() {
  const t = useTranslations('pricing');
  const footer = useTranslations('footer');
  const locale = useLocale();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [productIds, setProductIds] = useState<Record<string, string>>({});
  const supabase = createClient();

  // Get product IDs and user email on mount
  useEffect(() => {
    // Fetch product IDs from API
    fetch('/api/creem/products')
      .then(res => res.json())
      .then(data => setProductIds(data))
      .catch(err => console.error('Failed to fetch product IDs:', err));

    // Get user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePurchase = async (packageAmount: string) => {
    // Check if user is logged in
    if (!userEmail) {
      alert('请先登录后再购买积分');
      return;
    }

    const productId = productIds[packageAmount];
    if (!productId) {
      alert('产品配置错误，请联系客服');
      return;
    }

    setLoadingPackage(packageAmount);

    try {
      // Build URLs with locale prefix (only for non-default locale)
      const successUrl = locale === 'en'
        ? `${window.location.origin}/success?package=${packageAmount}`
        : `${window.location.origin}/${locale}/success?package=${packageAmount}`;
      const cancelUrl = locale === 'en'
        ? `${window.location.origin}/pricing`
        : `${window.location.origin}/${locale}/pricing`;

      const response = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: userEmail, // Pass logged-in user's email
          metadata: {
            package_amount: packageAmount,
          },
        }),
      });

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoadingPackage(null);
    }
  };

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
            <span>{t('badge')}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-yellow-200 dark:hover:border-yellow-800 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('plans.free.name')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('plans.free.description')}
              </p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t('plans.free.price')}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('plans.free.period')}
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              {t.raw('plans.free.features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#editor"
              className="block w-full py-3 px-4 text-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              {t('plans.free.cta')}
            </a>
          </div>

          {/* Credit Package 100 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-yellow-200 dark:hover:border-yellow-800 flex flex-col h-full">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">STARTER</span>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t('plans.credits.packages.0.amount')}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('plans.credits.credits')}
              </p>
              <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {t('plans.credits.packages.0.price')}
              </div>
              <p className="text-xs text-gray-500">{t('plans.credits.oneTime')}</p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              {t.raw('plans.credits.features').slice(0, 4).map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase('100')}
              disabled={loadingPackage !== null}
              className="w-full py-3 px-4 text-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPackage === '100' ? t('generating') : t('plans.credits.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Credit Package 200 - Popular */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-6 relative transform lg:-translate-y-2 flex flex-col h-full">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-300" />
              {t('plans.credits.popular')}
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-300" />
                  <span className="text-xs font-medium text-yellow-100">RECOMMENDED</span>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">
                  {t('plans.credits.packages.1.amount')}
                </span>
              </div>
              <p className="text-sm text-white/80 mt-1">
                {t('plans.credits.credits')}
              </p>
              <div className="mt-2 text-2xl font-bold text-white">
                {t('plans.credits.packages.1.price')}
              </div>
              <p className="text-xs text-white/70">{t('plans.credits.oneTime')}</p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              {t.raw('plans.credits.features').slice(0, 5).map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white">
                  <Check className="w-3 h-3 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase('200')}
              disabled={loadingPackage !== null}
              className="w-full py-3 px-4 text-center rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPackage === '200' ? t('generating') : t('plans.credits.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Credit Package 500 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-yellow-200 dark:hover:border-yellow-800 flex flex-col h-full">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">BEST VALUE</span>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t('plans.credits.packages.2.amount')}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('plans.credits.credits')}
              </p>
              <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {t('plans.credits.packages.2.price')}
              </div>
              <p className="text-xs text-gray-500">{t('plans.credits.oneTime')}</p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              {t.raw('plans.credits.features').map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase('500')}
              disabled={loadingPackage !== null}
              className="w-full py-3 px-4 text-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPackage === '500' ? t('generating') : t('plans.credits.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            {t('comparison.title')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-900 dark:text-white font-semibold">
                    {t('comparison.feature')}
                  </th>
                  <th className="px-6 py-4 text-center text-gray-900 dark:text-white font-semibold">
                    {t('plans.free.name')}
                  </th>
                  <th className="px-6 py-4 text-center text-gray-900 dark:text-white font-semibold">
                    {t('plans.credits.name')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {t.raw('comparison.rows').map((row: any, i: number) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.free === '✓' ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : row.free === '✗' ? (
                        <span className="text-red-500 font-bold">✗</span>
                      ) : (
                        <span className="text-gray-500">{row.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.credits === '✓' ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : row.credits === '✗' ? (
                        <span className="text-red-500 font-bold">✗</span>
                      ) : (
                        <span className="text-gray-500">{row.credits}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
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
            {t('contact.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('contact.description')}
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
