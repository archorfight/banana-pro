import { useTranslations } from 'next-intl';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: { locale: string };
}

export default function CancelPage({ params: { locale } }: PageProps) {
  const t = useTranslations('pricing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          If you changed your mind, you can always purchase credits later from our pricing page.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
          >
            Back to Pricing
          </Link>
          <Link
            href="/"
            className="w-full py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
