'use client';

import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: { locale: string };
  searchParams: { package?: string };
}

export default function SuccessPage({
  params: { locale },
  searchParams: { package: packageAmount },
}: PageProps) {
  const t = useTranslations('pricing');
  const currentLocale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your purchase! Your credits have been added to your account.
        </p>

        {packageAmount && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              You purchased:
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {packageAmount} Credits
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href={`/${currentLocale}`}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
          >
            Start Creating
          </Link>
          <Link
            href={`/${currentLocale}/pricing`}
            className="w-full py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
